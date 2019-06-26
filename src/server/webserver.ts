﻿/*********************************************************************
* Copyright (c) Intel Corporation 2018-2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/** 
* @description Intel AMT Web server object 
* @author Ylian Saint-Hilaire
* @version v0.2.0c
*/

import * as net from "net";
import * as tls from "tls";
import * as path from "path";
import * as express from "express";
import * as https from "https";
import * as parser from "body-parser";

import { configType, certificatesType } from "../models/Config";
import { amtRoutes } from "../routes/amtRoutes";
import { adminRoutes } from "../routes/adminRoutes";
import {ErrorResponse} from "../utils/amtHelper";
import { logger as log } from "../utils/logger";
import {constants, UUIDRegex} from "../utils/constants";
import { mpsMicroservice } from "../mpsMicroservice";

const interceptor = require("../utils/interceptor.js");
const expressWs = require('express-ws');

export class webServer {
  db: any;
  app: any;
  users: any = {};
  serverHttps = null;
  expressWs: any;
  mpsService: mpsMicroservice;
  config: configType;
  certs: certificatesType;

  constructor(mpsService: mpsMicroservice) {
    try {
      this.mpsService = mpsService;
      this.db = this.mpsService.db;
      this.config = this.mpsService.config;
      this.certs = this.mpsService.certs;
      this.app = express();
      this.expressWs = expressWs(this.app);
      let amt = new amtRoutes(this.mpsService);
      let admin = new adminRoutes(this.mpsService);

      if (this.config.https) {
        this.serverHttps = https.createServer(this.certs.webConfig, this.app);
        this.expressWs = expressWs(this.app, this.serverHttps);
      }

      //Clickjacking defence
      this.app.use(function (req, res, next) {
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        next();
      })

      // Indicates to ExpressJS that the public folder should be used to serve static files.
      //Mesh Commander will be at "default.htm".
      this.app.use(express.static(path.join(__dirname, "../../public")));
      
      //Handles the Bad JSON exceptions
      this.app.use(parser.json(), (err, req, res, next) => {
        if (err instanceof SyntaxError) {
            return res.status(400).send(ErrorResponse(400));
        }
        next();
      });

      this.app.get("/", this.default);
      this.app.ws("/notifications/control.ashx", this.controlSocket);
      this.app.ws("/relay/webrelay.ashx", this.webrelaySocket);

      // Validates GUID format
      this.app.use((req, res, next) => {
         let method = req.body.method;
         let payload = req.body.payload || {};
         if(method){
           if(payload && payload.guid !== undefined){
             if(!UUIDRegex.test(payload.guid)){
              return res.status(404).send(ErrorResponse(404, null, "invalidGuid"));
             }
           }
           next();
         }else{
          return res.status(404).send(ErrorResponse(404, null, "method"));
         }
       });
  
      //Routes
      this.app.use("/amt", amt.router);
      this.app.use("/admin", admin.router);
        
      // Start the ExpressJS web server
      var port = 3000;
      if (this.config.webport != null) {
        port = this.config.webport;
      }
      if (isNaN(port) || port == null || typeof port != "number" || port < 0 || port > 65536) {
        port = 3000;
      }

      if (this.config.https) {
        if (this.config.listenany && this.config.listenany == true) {
          this.serverHttps.listen(port, () => {
            log.info(
              `MPS Microservice running on https://${
                this.config.commonName
              }:${port}.`
            );
          });
        } else {
          //Only accept request from local host
          this.serverHttps.listen(port, "127.0.0.1", () => {
            log.info(`MPS Microservice running on https://127.0.0.1:${port}.`);
          });
        }
      } else {
        if (this.config.listenany && this.config.listenany == true) {
          this.app.listen(port, () => {
            log.info(
              `MPS Microservice running on https://${
                this.config.commonName
              }:${port}.`
            );
          });
        } else {
          this.app.listen(port, "127.0.0.1", () => {
            log.info(`MPS Microservice running on https://127.0.0.1:${port}.`);
          });
        }
      }
    } catch (error) {
      log.error(`Exception in webserver: ${error}`);
    }
  }

  notifyUsers(msg) {
    for (var i in this.users) {
      try {
        this.users[i].send(JSON.stringify(msg));
      } catch (error) {
        log.error(error);
      }
    }
  }

  // Indicates that any request to "/" should be redirected to "/default.htm" which is the Mesh Commander web application.
  default = (req, res) => {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    });
    res.redirect("/index.htm");
  };

  //Browser/Console connects to this websocket for a persistent connection
  controlSocket = (ws, req) => {
    this.users[ws] = ws;
    // log.debug("New control websocket.");
    ws.on("message", msg => {
      log.debug(`Incoming control message from browser: ${msg}`);
    });

    ws.on("close", req => {
      // log.debug("Closing control websocket.");
      delete this.users[ws];
    });
  };

  // Indicates to ExpressJS what we want to handle websocket requests on "/webrelay.ashx".
  //This is the same URL as IIS making things simple, we can use the same web application for both IIS and Node.
  webrelaySocket = async (ws, req) => {
    try {
      ws.pause();

      // When data is received from the web socket, forward the data into the associated TCP connection.
      // If the TCP connection is pending, buffer up the data until it connects.
      ws.on("message", msg => {
        // Convert a buffer into a string, "msg = msg.toString('ascii');" does not work
        //var msg2 = "";
        //for (var i = 0; i < msg.length; i++) { msg2 += String.fromCharCode(msg[i]); }
        //msg = msg2;
        msg = msg.toString("binary");

        if (ws.interceptor) {
          msg = ws.interceptor.processBrowserData(msg);
        } // Run data thru interceptor
        ws.forwardclient.write(msg); // Forward data to the associated TCP connection.
      });

      // If the web socket is closed, close the associated TCP connection.
      ws.on("close", req => {
        log.debug(
          `Closing web socket connection to  ${ws.upgradeReq.query.host}: ${
            ws.upgradeReq.query.port
          }.`
        );
        if (ws.forwardclient) {
          if (ws.forwardclient.close) {
            ws.forwardclient.close();
          }
          try {
            ws.forwardclient.destroy();
          } catch (e) {}
        }
      });

      // We got a new web socket connection, initiate a TCP connection to the target Intel AMT host/port.
      log.debug(
        `Opening web socket connection to ${req.query.host}: ${req.query.port}.`
      );

      // Fetch Intel AMT credentials & Setup interceptor
      let credentials = await this.db.getAmtPassword(req.query.host);
      //obj.debug("Credential for " + req.query.host + " is " + JSON.stringify(credentials));

      if (credentials != null) {
        log.debug("Creating credential");
        if (req.query.p == 1) {
          ws.interceptor = interceptor.CreateHttpInterceptor({
            host: req.query.host,
            port: req.query.port,
            user: credentials[0],
            pass: credentials[1]
          });
        } else if (req.query.p == 2) {
          ws.interceptor = interceptor.CreateRedirInterceptor({
            user: credentials[0],
            pass: credentials[1]
          });
        }
      }

      if (req.query.tls == 0) {
        // If this is TCP (without TLS) set a normal TCP socket
        // check if this is MPS connection
        var uuid = req.query.host;
        if (uuid && this.mpsService.mpsserver.ciraConnections[uuid]) {
          var ciraconn = this.mpsService.mpsserver.ciraConnections[uuid];
          ws.forwardclient = this.mpsService.mpsserver.SetupCiraChannel(
            ciraconn,
            req.query.port
          );
          ws.forwardclient.xtls = 0;
          ws.forwardclient.onData = (ciraconn, data) => {
            // Run data thru interceptor
            if (ws.interceptor) {
              data = ws.interceptor.processAmtData(data);
            }
            try {
              ws.send(data);
            } catch (e) {}
          };

          ws.forwardclient.onStateChange = (ciraconn, state) => {
            //console.log('Relay CIRA state change:'+state);
            if (state == 0) {
              try {
                //console.log("Closing websocket.");
                ws.close();
              } catch (e) {}
            }
          };
          ws.resume();
        } else {
          ws.forwardclient = new net.Socket();
          ws.forwardclient.setEncoding("binary");
          ws.forwardclient.forwardwsocket = ws;
        }
      } else {
        // If TLS is going to be used, setup a TLS socket
        log.info("TLS Enabled!");
        var tlsoptions = {
          secureProtocol:
            req.query.tls1only == 1 ? "TLSv1_method" : "SSLv23_method",
          ciphers: "RSA+AES:!aNULL:!MD5:!DSS",
          secureOptions:
            constants.SSL_OP_NO_SSLv2 |
            constants.SSL_OP_NO_SSLv3 |
            constants.SSL_OP_NO_COMPRESSION |
            constants.SSL_OP_CIPHER_SERVER_PREFERENCE,
          rejectUnauthorized: false
        };
        ws.forwardclient = tls.connect(
          req.query.port,
          req.query.host,
          tlsoptions,
          () => {
            // The TLS connection method is the same as TCP, but located a bit differently.
            log.debug(`TLS connected to ${req.query.host}: ${req.query.port}.`);
            ws.resume();
          }
        );
        ws.forwardclient.setEncoding("binary");
        ws.forwardclient.forwardwsocket = ws;
      }

      // When we receive data on the TCP connection, forward it back into the web socket connection.
      ws.forwardclient.on("data", data => {
        if (ws.interceptor) {
          data = ws.interceptor.processAmtData(data);
        } // Run data thru interceptor
        try {
          ws.send(data);
        } catch (e) {}
      });

      // If the TCP connection closes, disconnect the associated web socket.
      ws.forwardclient.on("close", () => {
        log.debug(
          `TCP disconnected from ${req.query.host} : ${req.query.port}.`
        );
        try {
          ws.close();
        } catch (e) {}
      });

      // If the TCP connection causes an error, disconnect the associated web socket.
      ws.forwardclient.on("error", err => {
        log.debug(
          `TCP disconnected with error from ${req.query.host}:${
            req.query.port
          }:${err.code},${req.url}`
        );
        try {
          ws.close();
        } catch (e) {}
      });

      if (req.query.tls == 0) {
        if (!this.mpsService.mpsComputerList[req.query.host]) {
          // A TCP connection to Intel AMT just connected, send any pending data and start forwarding.
          ws.forwardclient.connect(req.query.port, req.query.host, () => {
            log.debug(`TCP connected to ${req.query.host}:${req.query.port}.`);
            ws.resume();
          });
        }
      }
    } catch (err) {}
  };
}
