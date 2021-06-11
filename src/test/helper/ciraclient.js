/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

module.exports.CreateCiraClient = function (parent, args) {
    var obj = {};
    obj.parent = parent;
    obj.args = args;
    obj.tls = require('tls');
    obj.common = require('./common.js');
    obj.constants = (require('crypto').constants ? require('crypto').constants : require('constants'));
    obj.forwardClient = null;
    obj.pfwd_idx = 0;
    obj.timer = null; // keep alive timer
    obj.testciraState = obj.args.testciraState;
    var callbackFunc = null;
    // Debug
    function Debug(str) {
        if (obj.args.debug) {
            console.log(str);
        }
    }
    // CIRA state
    var CIRASTATE = {
        INITIAL: 0,
        PROTOCOL_VERSION_SENT: 1,
        AUTH_SERVICE_REQUEST_SENT: 2,
        AUTH_REQUEST_SENT: 3,
        PFWD_SERVICE_REQUEST_SENT: 4,
        GLOBAL_REQUEST_SENT: 5,
        FAILED: -1
    }
    // Set CIRA Initial state
    obj.cirastate = CIRASTATE.INITIAL;
    // AMT forwarded port list for non-TLS mode
    var pfwd_ports = [16992, 623, 16994, 5900];
    // protocol definitions
    var APFProtocol = {
        UNKNOWN: 0,
        DISCONNECT: 1,
        SERVICE_REQUEST: 5,
        SERVICE_ACCEPT: 6,
        USERAUTH_REQUEST: 50,
        USERAUTH_FAILURE: 51,
        USERAUTH_SUCCESS: 52,
        GLOBAL_REQUEST: 80,
        REQUEST_SUCCESS: 81,
        REQUEST_FAILURE: 82,
        CHANNEL_OPEN: 90,
        CHANNEL_OPEN_CONFIRMATION: 91,
        CHANNEL_OPEN_FAILURE: 92,
        CHANNEL_WINDOW_ADJUST: 93,
        CHANNEL_DATA: 94,
        CHANNEL_CLOSE: 97,
        PROTOCOLVERSION: 192,
        KEEPALIVE_REQUEST: 208,
        KEEPALIVE_REPLY: 209,
        KEEPALIVE_OPTIONS_REQUEST: 210,
        KEEPALIVE_OPTIONS_REPLY: 211
    }

    var APFDisconnectCode = {
        HOST_NOT_ALLOWED_TO_CONNECT: 1,
        PROTOCOL_ERROR: 2,
        KEY_EXCHANGE_FAILED: 3,
        RESERVED: 4,
        MAC_ERROR: 5,
        COMPRESSION_ERROR: 6,
        SERVICE_NOT_AVAILABLE: 7,
        PROTOCOL_VERSION_NOT_SUPPORTED: 8,
        HOST_KEY_NOT_VERIFIABLE: 9,
        CONNECTION_LOST: 10,
        BY_APPLICATION: 11,
        TOO_MANY_CONNECTIONS: 12,
        AUTH_CANCELLED_BY_USER: 13,
        NO_MORE_AUTH_METHODS_AVAILABLE: 14,
        INVALID_CREDENTIALS: 15,
        CONNECTION_TIMED_OUT: 16,
        BY_POLICY: 17,
        TEMPORARILY_UNAVAILABLE: 18
    }

    var APFChannelOpenFailCodes = {
        ADMINISTRATIVELY_PROHIBITED: 1,
        CONNECT_FAILED: 2,
        UNKNOWN_CHANNEL_TYPE: 3,
        RESOURCE_SHORTAGE: 4,
    }

    var APFChannelOpenFailureReasonCode = {
        AdministrativelyProhibited: 1,
        ConnectFailed: 2,
        UnknownChannelType: 3,
        ResourceShortage: 4,
    }

    obj.onSecureConnect = function () {
        Debug("CIRA TLS socket connected.");
        obj.forwardClient.tag = { accumulator: '' };
        obj.forwardClient.setEncoding('binary');
        obj.forwardClient.on('data', function (data) {
            obj.forwardClient.tag.accumulator += data;
            try {
                var len = 0;
                do {
                    len = ProcessData(obj.forwardClient);
                    if (len > 0) {
                        obj.forwardClient.tag.accumulator = obj.forwardClient.tag.accumulator.substring(len);
                    }
                    if (obj.cirastate == CIRASTATE.FAILED) {
                        Debug("CIRA Simulator: in a failed state, destroying socket.")
                        obj.forwardClient.end();
                    }
                } while (len > 0);
            } catch (e) {
                Debug(e);
            }
        });
        obj.forwardClient.on('error', function (e) {
            Debug("CIRA Simulator: Connection error, ending connecting.");
            if (obj.timer != null) {
                clearInterval(obj.timer);
                obj.timer = null;
            }
        });

        obj.forwardClient.on('close', function (e) {
            Debug("CIRA Simulator: Connection is closing.");
            if (obj.timer != null) {
                clearInterval(obj.timer);
                obj.timer = null;
            }
        });

        obj.forwardClient.on('end', function (data) {
            Debug("CIRA Simulator: Connection end.");
            if (obj.timer != null) {
                clearInterval(obj.timer);
                obj.timer = null;
            }
        });

        obj.state = CIRASTATE.INITIAL;
        SendProtocolVersion(obj.forwardClient, obj.args.uuid);
        SendServiceRequest(obj.forwardClient, 'auth@amt.intel.com');
    }

    function guidToStr(g) { return g.substring(6, 8) + g.substring(4, 6) + g.substring(2, 4) + g.substring(0, 2) + "-" + g.substring(10, 12) + g.substring(8, 10) + "-" + g.substring(14, 16) + g.substring(12, 14) + "-" + g.substring(16, 20) + "-" + g.substring(20); }

    function strToGuid(s) {
        s = s.replace(/-/g, '');
        var ret = s.substring(6, 8) + s.substring(4, 6) + s.substring(2, 4) + s.substring(0, 2);
        ret += s.substring(10, 12) + s.substring(8, 10) + s.substring(14, 16) + s.substring(12, 14) + s.substring(16, 20) + s.substring(20);
        return ret;
    }

    function SendProtocolVersion(socket, uuid) {
        var buuid = strToGuid(uuid);
        var data = String.fromCharCode(APFProtocol.PROTOCOLVERSION) + '' + obj.common.IntToStr(1) + obj.common.IntToStr(0) + obj.common.IntToStr(0) + obj.common.hex2rstr(buuid) + Buffer.alloc(64);
        socket.write(Buffer.from(data, 'binary'));
        Debug("CIRA Simulator: Send protocol version 1 0 " + uuid);
        obj.cirastate = CIRASTATE.PROTOCOL_VERSION_SENT;
        if (obj.testciraState == 'PROTOCOL_VERSION_SENT') {
            callbackFunc();
        }
    }

    function SendServiceRequest(socket, service) {
        var data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) + obj.common.IntToStr(service.length) + service;
        socket.write(Buffer.from(data, 'binary'));
        Debug("CIRA Simulator: Send service request " + service);
        if (service == 'auth@amt.intel.com') {
            obj.cirastate = CIRASTATE.AUTH_SERVICE_REQUEST_SENT;
        } else if (service == 'pfwd@amt.intel.com') {
            obj.cirastate = CIRASTATE.PFWD_SERVICE_REQUEST_SENT;
        }
    }

    function SendUserAuthRequest(socket, user, pass) {
        var service = "pfwd@amt.intel.com";
        var data = String.fromCharCode(APFProtocol.USERAUTH_REQUEST) + obj.common.IntToStr(user.length) + user + obj.common.IntToStr(service.length) + service;
        //password auth
        data += obj.common.IntToStr(8) + 'password';
        data += Buffer.alloc(1) + obj.common.IntToStr(pass.length) + pass;
        socket.write(Buffer.from(data, 'binary'));
        Debug("CIRA Simulator: Send username password authentication to MPS");
        obj.cirastate = CIRASTATE.AUTH_REQUEST_SENT;
    }

    function SendGlobalRequestPfwd(socket, amthostname, amtport) {
        var tcpipfwd = 'tcpip-forward';
        var data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) + obj.common.IntToStr(tcpipfwd.length) + tcpipfwd + Buffer.alloc(1, 1);
        data += obj.common.IntToStr(amthostname.length) + amthostname + obj.common.IntToStr(amtport);
        socket.write(Buffer.from(data, 'binary'));
        Debug("CIRA Simulator: Send tcpip-forward " + amthostname + ":" + amtport);
        obj.cirastate = CIRASTATE.GLOBAL_REQUEST_SENT;
    }

    function SendKeepAliveRequest(socket) {
        var data = String.fromCharCode(APFProtocol.KEEPALIVE_REQUEST) + obj.common.IntToStr(255);
        socket.write(Buffer.from(data, 'binary'));
        Debug("CIRA Simulator: Send keepalive request");
    }

    function SendKeepAliveReply(socket, cookie) {
        var data = String.fromCharCode(APFProtocol.KEEPALIVE_REPLY) + obj.common.IntToStr(cookie);
        socket.write(Buffer.from(data, 'binary'));
        Debug("CIRA Simulator: Send keepalive reply");
    }

    function ProcessData(socket) {
        var cmd = socket.tag.accumulator.charCodeAt(0);
        var len = socket.tag.accumulator.length;
        var data = socket.tag.accumulator;
        if (len == 0) { return 0; }
        // respond to MPS according to obj.cirastate
        switch (cmd) {
            case APFProtocol.SERVICE_ACCEPT: {
                var slen = obj.common.ReadInt(data, 1);
                var service = data.substring(5, 6 + slen);
                console.log("CIRA Simulator: Service request to " + service + " accepted.");
                if (service == 'auth@amt.intel.com') {
                    if (obj.cirastate >= CIRASTATE.AUTH_SERVICE_REQUEST_SENT) {
                        if (obj.testciraState == 'USERAUTH_SERVICE_ACCEPT') {
                            callbackFunc();
                        }
                        SendUserAuthRequest(socket, obj.args.username, obj.args.password);
                    }
                } else if (service == 'pfwd@amt.intel.com') {
                    if (obj.cirastate >= CIRASTATE.PFWD_SERVICE_REQUEST_SENT) {
                        if (obj.testciraState == 'PFWD_SERVICE_ACCEPT') {
                            callbackFunc();
                        }
                        SendGlobalRequestPfwd(socket, obj.args.clientName, pfwd_ports[obj.pfwd_idx++]);
                    }
                }
                return 5 + slen;
            }
            case APFProtocol.REQUEST_SUCCESS: {
                if (len >= 5) {
                    var port = obj.common.ReadInt(data, 1);
                    console.log("CIRA Simulator: Request to port forward " + port + " successful.");
                    // iterate to pending port forward request
                    if (obj.pfwd_idx < pfwd_ports.length) {
                        SendGlobalRequestPfwd(socket, obj.args.clientName, pfwd_ports[obj.pfwd_idx++]);
                    } else {
                        //Test CIRA State - GLOBAL_REQUEST_SUCCESS
                        if (obj.testciraState == 'GLOBAL_REQUEST_SUCCESS') {
                            callbackFunc();
                        }
                        // no more port forward, now setup timer to send keep alive
                        console.log("CIRA Simulator: Start keep alive for every " + obj.args.keepalive + " ms.");
                        obj.timer = setInterval(function () {
                            SendKeepAliveRequest(obj.forwardClient);
                        }, obj.args.keepalive);// 
                    }
                    return 5;
                }
                console.log("CIRA Simulator: Request successful.");
                return 1;
            }
            case APFProtocol.USERAUTH_SUCCESS: {
                console.log("CIRA Simulator: User Authentication successful");
                // Send Pfwd service request
                if (obj.testciraState == 'USERAUTH_SUCCESS') {
                    callbackFunc();
                }
                SendServiceRequest(socket, 'pfwd@amt.intel.com');
                return 1;
            }
            case APFProtocol.USERAUTH_FAILURE: {
                console.log("CIRA Simulator: User Authentication failed");
                obj.cirastate = CIRASTATE.FAILED;
                if (obj.testciraState == 'USERAUTH_FAILURE') {
                    callbackFunc();
                }
                return 14;
            }
            case APFProtocol.KEEPALIVE_REQUEST: {
                console.log("CIRA Simulator: Keep Alive Request with cookie: " + obj.common.ReadInt(data, 1));
                SendKeepAliveReply(socket, obj.common.ReadInt(data, 1));
                return 5;
            }
            case APFProtocol.KEEPALIVE_REPLY: {
                //Test CIRA State - KeepAlive Reply
                if (obj.testciraState == 'KEEPALIVE_REPLY') {
                    callbackFunc();
                }
                console.log("CIRA Simulator: Keep Alive Reply with cookie: " + obj.common.ReadInt(data, 1));
                return 5;
            }
            default: {
                console.log("CMD: " + cmd + " is not implemented.");
                obj.cirastate = CIRASTATE.FAILED;
                return 0;
            }
        }
    }

    obj.connect = function (func) {
        if (obj.forwardClient != null) {
            try {
                obj.forwardClient.end();
            } catch (e) {
                Debug(e);
            }
            //obj.forwardClient = null;
        }
        obj.cirastate = CIRASTATE.INITIAL;
        obj.pfwd_idx = 0;
        var tlsoptions = {
            secureOptions: obj.constants.SSL_OP_NO_SSLv2 | obj.constants.SSL_OP_NO_SSLv3 | obj.constants.SSL_OP_NO_COMPRESSION | obj.constants.SSL_OP_CIPHER_SERVER_PREFERENCE,
            rejectUnauthorized: false
        };
        callbackFunc = func;
        obj.forwardClient = obj.tls.connect(obj.args.port, obj.args.host, tlsoptions, obj.onSecureConnect);
    }

    obj.disconnect = function () {
        try {
            obj.forwardClient.end();
        } catch (e) {
            Debug(e);
        }
    }

    return obj;
}
