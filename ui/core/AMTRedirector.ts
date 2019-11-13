/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/
import { TypeConverter } from "./converter";
import { ICommunicator } from "./ICommunicator";
import md5 from 'md5'
import { ILogger } from "./ILogger";
import { FileReader } from "./FileReader";
/**
 * Protocol for different Redir protocols. SOL=1,KVM=2,IDER=USB-R
 */
export enum Protocol {
  SOL = 1,
  KVM = 2,
  IDER = 3
}
/**
 * AMTRedirector provides all communication over WebSockets
 */
export class AMTRedirector implements ICommunicator {
  state: number;
  socket: any;
  host: string;
  port: number;
  user: string;
  pass: string;
  tls: number;
  authUri: string;
  tlsv1only: number;
  connectState: number;
  protocol: Protocol;
  amtAccumulator: string;
  amtSequence: number;
  amtKeepAliveTimer: any;

  fileReader: FileReader;
  fileReaderInUse: boolean;
  fileReaderAcc: any[];
  randomNonceChars: string;
  RedirectStartSol: string;
  RedirectStartKvm: string;
  RedirectStartIder: string;
  urlvars: any;
  inDataCount: number;
  server: string;
  logger: ILogger;
  onProcessData: (data: string) => void
  onStart: () => void
  onNewState: (state: number) => void
  onStateChanged: (redirector: any, state: number) => void;
  onError: () => void;

  constructor(logger: ILogger, protocol: number, fr: FileReader, host: string, port: number, user: string, pass: string, tls: number, tls1only: number, server?: string) {
    this.fileReader = fr;
    this.randomNonceChars = "abcdef0123456789";
    this.host = host
    this.port = port
    this.user = user
    this.pass = pass
    this.tls = tls
    this.tlsv1only = tls1only
    this.protocol = protocol
    this.RedirectStartSol = String.fromCharCode(0x10, 0x00, 0x00, 0x00, 0x53, 0x4F, 0x4C, 0x20);
    this.RedirectStartKvm = String.fromCharCode(0x10, 0x01, 0x00, 0x00, 0x4b, 0x56, 0x4d, 0x52);
    this.RedirectStartIder = String.fromCharCode(0x10, 0x00, 0x00, 0x00, 0x49, 0x44, 0x45, 0x52);
    this.urlvars = {}
    this.server = server
    this.amtAccumulator = ""
    this.authUri = ""
    this.logger = logger;
  }
  /**
   * Returns WebSocket path to connect to using the current environment. 
   * Uses host(deviceid), port, tls, tlsv1only, user, pass options to build the url. 
   */
  private getWsLocation(): string {
    if (this.isBrowser() && !this.server) {

      return window.location.protocol.replace("http", "ws") + "//" +
        window.location.host +
        window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) +
        "/webrelay.ashx?p=2&host=" + this.host +
        "&port=" + this.port +
        "&tls=" + this.tls +
        ((this.user == '*') ? "&serverauth=1" : "") +
        ((typeof this.pass === "undefined") ? ("&serverauth=1&user=" + this.user) : "") +
        "&tls1only=" + this.tlsv1only
    }
    else {
      return "wss://" + this.server + "/webrelay.ashx?p=2&host=" + this.host +
        "&port=" + this.port +
        "&tls=" + this.tls +
        ((this.user == '*') ? "&serverauth=1" : "") +
        ((typeof this.pass === "undefined") ? ("&serverauth=1&user=" + this.user) : "") +
        "&tls1only=" + this.tlsv1only
    }
  }
  /**
   * Check if current environment is browser or test
   */
  private isBrowser(): boolean {
    try {
      let isWeb = (typeof window !== 'undefined');
      if (isWeb) this.logger.debug("!!!!!BROWSER!!!!!")
      return isWeb
    }
    catch (e) {
      return false;
    }
  }
  /**
   * gets Ws Location and starts a websocket for listening
   * @param c is base type for WebSocket
   */
  start<T>(c: { new(path: string): T; }) { // Using this generic signature allows us to pass the WebSocket type from unit tests or in producion from a web browser
    this.connectState = 0;
    //let ws = new c(this.getWsLocation()) // using create function c invokes the constructor WebSocket()
    this.socket = new c(this.getWsLocation()) // The "p=2" indicates to the relay that this is a REDIRECTION session
    this.socket.onopen = this.onSocketConnected.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onSocketClosed.bind(this);
    let onload = (e: any) => {
      this.onSocketData(e.target.result);
      if (this.fileReaderAcc.length == 0) {
        this.fileReaderInUse = false;
      }
      else {
        this.fileReader.readAsBinaryString(new Blob([this.fileReaderAcc.shift()]));
      }
    }
    let onloadend = (e: any) => {
      this.onSocketData(e.target.result);
      if (this.fileReaderAcc.length == 0) {
        this.fileReaderInUse = false;
      }
      else {
        this.fileReader.readAsArrayBuffer(this.fileReaderAcc.shift());
      }
    }
    if (this.fileReader.readAsBinaryString) {
      // Chrome & Firefox (Draft)
      this.fileReader.onload = onload.bind(this)
    } else if (this.fileReader.readAsArrayBuffer) {
      // Chrome & Firefox (Spec)
      this.fileReader.onloadend = onloadend.bind(this)
    }
    this.logger.verbose('Connecting to websocket')
    this.onStateChange(1);
  }

  onSocketConnected() {
    if (this.urlvars && this.urlvars['redirtrace']) console.log("REDIR-CONNECT");
    this.onStateChange(2);
    this.logger.verbose('Connected to websocket server. With protocol ' + this.protocol + ' (2 = KVM)')
    this.logger.info('Start Redirect Session for protocol. ' + this.protocol);
    if (this.protocol == Protocol.SOL) this.socketSend(this.RedirectStartSol); // TODO: Put these strings in higher level module to tighten code
    if (this.protocol == Protocol.KVM) this.socketSend(this.RedirectStartKvm); // Don't need these is the feature is not compiled-in.
    if (this.protocol == Protocol.IDER) this.socketSend(this.RedirectStartIder);
  }
  /**
   * Called when there is new data on the websocket
   * @param e data received over the websocket
   */
  onMessage(e: any) {

    try {
      // console.log(e.data)
      this.inDataCount++
      if (typeof e.data == 'object') {
        if (this.fileReaderInUse == true) {
          this.fileReaderAcc.push(e.data);
          return;
        }
        if (this.fileReader.readAsBinaryString) {
          // Chrome & Firefox (Draft)
          this.fileReaderInUse = true;
          this.fileReader.readAsBinaryString(new Blob([e.data]));
        } else if (this.fileReader.readAsArrayBuffer) {
          // Chrome & Firefox (Spec)
          this.fileReaderInUse = true;
          this.fileReader.readAsArrayBuffer(e.data);
        } else {
          // IE10, readAsBinaryString does not exist, use an alternative.
          let binary = "", bytes = new Uint8Array(e.data), length = bytes.byteLength;
          for (let i = 0; i < length; i++) { binary += String.fromCharCode(bytes[i]); }
          this.onSocketData(binary);
        }
      } else {
        // If we get a string object, it maybe the WebRTC confirm. Ignore it.
        // this.debug("MeshDataChannel - OnData - " + typeof e.data + " - " + e.data.length);
        this.onSocketData(e.data);
      }
    } catch (error) {
      this.logger.error(error)
      this.stop();
      this.onError();
    }

  }
  /**
   * Called from onMessage
   * @param data data over the wire
   */
  private onSocketData(data: string) {
    if (!data || this.connectState == -1) return;

    if (typeof data === 'object') {
      // This is an ArrayBuffer, convert it to a string array (used in IE)
      let binary = "";
      let bytes = new Uint8Array(data);
      let length = bytes.byteLength;
      for (let i = 0; i < length; i++) { binary += String.fromCharCode(bytes[i]); }
      data = binary;
    }
    else if (typeof data !== 'string') { return; }

    if ((this.protocol == Protocol.KVM || this.protocol == Protocol.IDER) && this.connectState == 1) {
      return this.onProcessData(data);
    } // KVM traffic, forward it directly.

    //console.log('before: ', this.amtAccumulator)
    this.amtAccumulator += data;
    //console.log('after: ', this.amtAccumulator)
    //console.log("REDIR-RECV(" + this.amtAccumulator.length + "): " + TypeConverter.rstr2hex(this.amtAccumulator));
    while (this.amtAccumulator.length >= 1) {
      let cmdsize = 0;
      switch (this.amtAccumulator.charCodeAt(0)) {
        case 0x11: // StartRedirectionSessionReply (17)
          this.logger.verbose('Start Redirection Session reply received for ' + this.protocol);
          if (this.amtAccumulator.length < 4) return;
          let statuscode = this.amtAccumulator.charCodeAt(1);
          switch (statuscode) {
            case 0: // STATUS_SUCCESS
              this.logger.verbose('Session status success. Start handshake');
              if (this.amtAccumulator.length < 13) return;
              let oemlen = this.amtAccumulator.charCodeAt(12);
              if (this.amtAccumulator.length < 13 + oemlen) return;

              // Query for available authentication
              this.logger.verbose('Query for available authentication');
              this.socketSend(String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)); // Query authentication support
              cmdsize = (13 + oemlen);
              break;
            default:
              this.stop();
              break;
          }
          break;
        case 0x14: // AuthenticateSessionReply (20)
          this.logger.verbose('Available Authentications reply received.');
          if (this.amtAccumulator.length < 9) return;
          let authDataLen = TypeConverter.ReadIntX(this.amtAccumulator, 5);
          if (this.amtAccumulator.length < 9 + authDataLen) return;
          let status = this.amtAccumulator.charCodeAt(1);
          let authType = this.amtAccumulator.charCodeAt(4);
          let authData = [];
          for (let i = 0; i < authDataLen; i++) { authData.push(this.amtAccumulator.charCodeAt(9 + i)); }
          let authDataBuf = this.amtAccumulator.substring(9, 9 + authDataLen);
          cmdsize = 9 + authDataLen;

          if (authType == 0) {
            // Query
            if (authData.indexOf(4) >= 0) {
              // Good Digest Auth (With cnonce and all)
              this.logger.verbose('Good Digest Auth (With cnonce and all)')
              this.socketSend(String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x04) + TypeConverter.IntToStrX(this.user.length + this.authUri.length + 8) + String.fromCharCode(this.user.length) + this.user + String.fromCharCode(0x00, 0x00) + String.fromCharCode(this.authUri.length) + this.authUri + String.fromCharCode(0x00, 0x00, 0x00, 0x00));
            }
            else if (authData.indexOf(3) >= 0) {
              this.logger.warn('Bad Digest Auth')
              // Bad Digest Auth (Not sure why this is supported, cnonce is not used!)
              this.socketSend(String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x03) + TypeConverter.IntToStrX(this.user.length + this.authUri.length + 7) + String.fromCharCode(this.user.length) + this.user + String.fromCharCode(0x00, 0x00) + String.fromCharCode(this.authUri.length) + this.authUri + String.fromCharCode(0x00, 0x00, 0x00));
            }
            else if (authData.indexOf(1) >= 0) {
              this.logger.verbose('Basic Auth')
              // Basic Auth (Probably a good idea to not support this unless this is an old version of Intel AMT)
              this.socketSend(String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x01) + TypeConverter.IntToStrX(this.user.length + this.pass.length + 2) + String.fromCharCode(this.user.length) + this.user + String.fromCharCode(this.pass.length) + this.pass);
            }
            else {
              this.logger.error('Auth Type not recognized. Stopping.')
              this.stop();
            }
          }
          else if ((authType == 3 || authType == 4) && status == 1) {
            let curptr = 0;

            // Realm
            let realmlen = authDataBuf.charCodeAt(curptr);
            let realm = authDataBuf.substring(curptr + 1, curptr + 1 + realmlen);
            curptr += (realmlen + 1);

            // Nonce
            let noncelen = authDataBuf.charCodeAt(curptr);
            let nonce = authDataBuf.substring(curptr + 1, curptr + 1 + noncelen);
            curptr += (noncelen + 1);

            // QOP
            let qoplen = 0;
            let qop = null;
            let cnonce = this.generateRandomNonce(32);
            let snc = '00000002';
            let extra = '';
            if (authType == 4) {
              qoplen = authDataBuf.charCodeAt(curptr);
              qop = authDataBuf.substring(curptr + 1, curptr + 1 + qoplen);
              curptr += (qoplen + 1);
              extra = snc + ":" + cnonce + ":" + qop + ":";
            }

            let digest = this.hex_md5(this.hex_md5(this.user + ":" + realm + ":" + this.pass) + ":" + nonce + ":" + extra + this.hex_md5("POST:" + this.authUri));
            let totallen = this.user.length + realm.length + nonce.length + this.authUri.length + cnonce.length + snc.length + digest.length + 7;
            if (authType == 4) totallen += (qop.length + 1);
            let buf = String.fromCharCode(0x13, 0x00, 0x00, 0x00, authType) + TypeConverter.IntToStrX(totallen) + String.fromCharCode(this.user.length) + this.user + String.fromCharCode(realm.length) + realm + String.fromCharCode(nonce.length) + nonce + String.fromCharCode(this.authUri.length) + this.authUri + String.fromCharCode(cnonce.length) + cnonce + String.fromCharCode(snc.length) + snc + String.fromCharCode(digest.length) + digest;
            if (authType == 4) buf += (String.fromCharCode(qop.length) + qop);
            this.socketSend(buf);
          }
          else
            if (status == 0) { // Success
              if (this.protocol == 1) {
                // Serial-over-LAN: Send Intel AMT serial settings...
                let MaxTxBuffer = 10000;
                let TxTimeout = 100;
                let TxOverflowTimeout = 0;
                let RxTimeout = 10000;
                let RxFlushTimeout = 100;
                let Heartbeat = 0;//5000;
                this.socketSend(String.fromCharCode(0x20, 0x00, 0x00, 0x00) + TypeConverter.IntToStrX(this.amtSequence++) + TypeConverter.ShortToStrX(MaxTxBuffer)
                  + TypeConverter.ShortToStrX(TxTimeout) + TypeConverter.ShortToStrX(TxOverflowTimeout) + TypeConverter.ShortToStrX(RxTimeout)
                  + TypeConverter.ShortToStrX(RxFlushTimeout) + TypeConverter.ShortToStrX(Heartbeat) + TypeConverter.IntToStrX(0));
              }
              if (this.protocol == 2) {
                // Remote Desktop: Send traffic directly...
                this.socketSend(String.fromCharCode(0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00));
              }
              if (this.protocol == 3) {
                // Remote IDER: Send traffic directly...
                this.connectState = 1;
                this.onStateChange(3);
              }
            } else this.stop();
          break;
        case 0x21: // Response to settings (33)
          if (this.amtAccumulator.length < 23) break;
          this.logger.verbose("Response to settings")
          cmdsize = 23;
          this.socketSend(String.fromCharCode(0x27, 0x00, 0x00, 0x00) + TypeConverter.IntToStrX(this.amtSequence++) + String.fromCharCode(0x00, 0x00, 0x1B, 0x00, 0x00, 0x00));
          if (this.protocol == 1) { this.amtKeepAliveTimer = setInterval(this.sendAmtKeepAlive, 2000); }
          this.connectState = 1;
          this.onStateChange(3);
          break;
        case 0x29: // Serial Settings (41)
          if (this.amtAccumulator.length < 10) break;
          this.logger.verbose("Serial Settings")
          cmdsize = 10;
          break;
        case 0x2A: // Incoming display data (42)
          if (this.amtAccumulator.length < 10) break;
          this.logger.verbose("Incoming display data")
          let cs = (10 + ((this.amtAccumulator.charCodeAt(9) & 0xFF) << 8) + (this.amtAccumulator.charCodeAt(8) & 0xFF));
          if (this.amtAccumulator.length < cs) break;
          this.onProcessData(this.amtAccumulator.substring(10, cs));
          cmdsize = cs;
          break;
        case 0x2B: // Keep alive message (43)
          if (this.amtAccumulator.length < 8) break;
          this.logger.verbose("Keep Alve message")
          cmdsize = 8;
          break;
        case 0x41:
          if (this.amtAccumulator.length < 8) break;
          this.logger.verbose("KVM traffic. Call onStart handler. And forward rest of acc directly.")
          this.connectState = 1;
          this.onStart();
          // KVM traffic, forward rest of accumulator directly.
          if (this.amtAccumulator.length > 8) { this.onProcessData(this.amtAccumulator.substring(8)); }
          cmdsize = this.amtAccumulator.length;
          break;
        default:
          this.logger.error("Unknown Intel AMT command: " + this.amtAccumulator.charCodeAt(0) + " acclen=" + this.amtAccumulator.length);
          this.stop();
          return;
      }
      if (cmdsize == 0) return;
      this.amtAccumulator = this.amtAccumulator.substring(cmdsize);
    }

  }
  hex_md5(str: string): string {
    this.logger.verbose("MD5 the string")
    return md5(str);
  }
  socketSend(data: string) { // xxSend
    if (this.urlvars && this.urlvars['redirtrace']) { this.logger.verbose("REDIR-SEND(" + data.length + "): " + TypeConverter.rstr2hex(data)); }


    try {
      if (this.socket != null && this.socket.readyState == 1) { // 1 = WebSocket.OPEN
        let b = new Uint8Array(data.length);
        this.logger.verbose("Redir Send(" + data.length + "): " + TypeConverter.rstr2hex(data));
        for (let i = 0; i < data.length; ++i) { b[i] = data.charCodeAt(i); }
        this.socket.send(b.buffer);
      }
    } catch (error) {
      this.logger.error('Socket send error: ' + error)
    }

  }
  /**
   * Send sends data over the websocket to the server.
   * @param data data to send to server
   */
  send(data: string) { // send
    this.logger.verbose('Send called ' + data)
    if (this.socket == null || this.connectState != 1) return;
    if (this.protocol == Protocol.SOL) {
      this.socketSend(String.fromCharCode(0x28, 0x00, 0x00, 0x00) +
        TypeConverter.IntToStrX(this.amtSequence++) +
        TypeConverter.ShortToStrX(data.length) +
        data);
    }
    else {
      this.socketSend(data);
    }
  }
  sendAmtKeepAlive() {
    if (this.socket == null) return;
    this.socketSend(String.fromCharCode(0x2B, 0x00, 0x00, 0x00) + TypeConverter.IntToStrX(this.amtSequence++));
  }
  generateRandomNonce(length: number) {
    let r = "";
    for (let i = 0; i < length; i++) { r += this.randomNonceChars.charAt(Math.floor(Math.random() * this.randomNonceChars.length)); }
    return r;
  }
  onSocketClosed(e: Event) {
    // console.log(e)
    if (this.urlvars && this.urlvars['redirtrace']) { console.log("REDIR-CLOSED"); }
    this.logger.warn("Redir Socket Closed");
    this.stop();
  }
  onStateChange(newstate: number) {
    if (this.state == newstate) return;
    this.state = newstate;
    this.onNewState(this.state);
    if (this.onStateChanged != null) this.onStateChanged(this, this.state);
  }
  stop() {
    this.logger.warn('Stop called on Redirector. Change state to 0 and close Socket.')
    this.onStateChange(0);
    this.connectState = -1;
    this.amtAccumulator = "";
    if (this.socket != null) { this.socket.close(); this.socket = null; }
    if (this.amtKeepAliveTimer != null) { clearInterval(this.amtKeepAliveTimer); this.amtKeepAliveTimer = null; }
  }
}