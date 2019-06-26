/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to download Mescript
**********************************************************************/

// import * as fs from "fs";
import * as path from "path";
import { Response, Request } from "express";
import { logger as log } from "../../utils/logger";
import { ErrorResponse } from "../../utils/amtHelper";
import { IAdminHandler } from "../../models/IAdminHandler";
import { mpsMicroservice } from "../../mpsMicroservice";

const common = require("../../utils/common.js");
//ToDo: Need to fix import fs issue
const fs = require("fs");

export class MEScriptHandler implements IAdminHandler {
  mps: mpsMicroservice;
  name: string;

  constructor(mps: mpsMicroservice) {
    this.name = "MEScript";
    this.mps = mps;
  }

  //Get list of CIRA connected devices.
  // For the server version of Mesh Commander, we send the computer list without credential and insertion credentials in the stream.
  async adminAction(req: Request, res: Response) {
    try {
      
      let filepath = path.join(__dirname,"../../../agent/cira_setup_script_dns.mescript");
      if (fs.existsSync(filepath)) {
        fs.readFile(filepath, (err, data) => {
          if (err) {
            log.error(err);
            return res
              .status(500)
              .send(ErrorResponse(500, "Request failed while downloading MEScript."));
          }
          let scriptFile = JSON.parse(data);

          // Change a few things in the script
          scriptFile.scriptBlocks[2].vars.CertBin.value = this.getRootCertBase64(
            path.join(__dirname, "../../../private/root-cert-public.crt")
          ); // Set the root certificate
          scriptFile.scriptBlocks[3].vars.FQDN.value = this.mps.config.commonName; // Set the server DNS name
          scriptFile.scriptBlocks[3].vars.Port.value = this.mps.config.mpsport; // Set the server MPS port
          scriptFile.scriptBlocks[3].vars.username.value = this.mps.config.mpsusername; // Set the username
          scriptFile.scriptBlocks[3].vars.password.value = this.mps.config.mpspass; // Set the password
          scriptFile.scriptBlocks[4].vars.AccessInfo1.value =
            this.mps.config.commonName + ":" + this.mps.config.mpsport; // Set the primary server name:port to set periodic timer
          scriptFile.scriptBlocks[6].vars.DetectionStrings.value = "dummy.com"; // Set the environment detection local FQDN's

          // Compile the script
          var scriptEngine = require("../../utils/amtscript.js").CreateAmtScriptEngine();
          var runscript = scriptEngine.script_blocksToScript(
            scriptFile.blocks,
            scriptFile.scriptBlocks
          );
          scriptFile.mescript = Buffer.from(scriptEngine.script_compile(runscript),"binary").toString("base64");
          scriptFile.scriptText = runscript;
          res.send(JSON.stringify(scriptFile, null, 3));
        });
      }
    } catch (error) {
      log.error(`Exception while downloading MEScript: ${error}`);
      return res
        .status(500)
        .send(ErrorResponse(500, "Request failed while downloading MEScript."));
    }
  }

  getRootCertBase64(path) {
    try {
      if (fs.existsSync(path)) {
        var rootcert = fs.readFileSync(path, "utf8");
        let i: number = rootcert.indexOf("-----BEGIN CERTIFICATE-----\r\n");
        if (i >= 0) {
          rootcert = rootcert.substring(i + 29);
        }
        i = rootcert.indexOf("-----END CERTIFICATE-----");
        if (i >= 0) {
          rootcert = rootcert.substring(i, 0);
        }
        return Buffer.from(rootcert, "base64").toString("base64");
      }
      return;
    } catch (error) {
      log.error(`Exception in getRootCertBase64 : ${error}`);
    }
  }
}
