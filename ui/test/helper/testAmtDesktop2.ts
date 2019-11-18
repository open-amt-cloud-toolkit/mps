/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { Desktop } from '../../core/Desktop';
import { ILogger } from '../../core/ILogger';
import { TypeConverter } from '../../core/converter';

let ZLIB = require('../../core/zlib/zlib')

class AmtDesktop2 extends Desktop 
{
  rotation: number;
  useZRLE: boolean;
  oldMouseX: number;
  oldMouseY: number;
  lastMouseX: number;
  lastMouseY: number;
  bpp: number; // Bytes per pixel
  kvmDataSupported: boolean;
  onKvmDataAck: any;
  urlvars: any;
  onKvmDataPending: any[];
  sparew: number;
  spareh: number;
  sparew2: number;
  spareh2: number;
  spare: any;
  sparecache: any;
  frameRateDelay: number;
  inflate: any;
  logger: ILogger;
  holding: boolean;
  canvasCtx: any;
  tcanvas: any;
  width: number;
  height: number;
  canvasId: string;
  focusMode: number;
  rwidth: number;
  rheight: number;
  ScreenWidth: number;
  ScreenHeight: number;
  lastKeepAlive: number;
  buttonmask: number;
  state: number;
  canvasControl: any;
  scrolldiv: any;
  focusmode: number;
  lastMouseX2: number;
  noMouseRotate: boolean;
  updateScreenDimensions: (width: number, height: number) => void;
  onKvmData: (data: string) => void;
  onScreenResize: (width: number, height: number, canvasId: string) => void;
  onScreenSizeChange: (width: number, height: number) => void;
  setDeskFocus: (el: string, focusmode: number) => void;
  getDeskFocus: (el: string) => any;

  protocol: number = 2;  

  constructor() {
    super();
    this.inflate = ZLIB.inflateInit([15])
    this.bpp = 1
    this.kvmDataSupported = false;
    this.onKvmDataAck = -1
    this.state = 0
    this.focusMode = 0
    this.useZRLE = true
    this.frameRateDelay = 2
    this.onKvmData = callback2
    this.canvasCtx = {
      canvas : {
        width : 0,
        height : 0
      },
      createImageData : (width, height) => {
        console.log('spare width height', width, height)
        let spare = { data: [] }
        for (let index = 0; index < width*height; index++) {
          spare.data[index] = 0;
        }
        return spare
      },
      putImageData : (spare, x, y) => {
        console.log('image x y', x, y)
      }, 
      fillRect: (x, y, width, height) => {
        console.log("fill rect", x, y, width, height)
      }
    }
    this.sparecache = {}

  }
 
  processData(data: string) {
    this.onProcessData(data)
  }
  onStateChange(state: number) {
    console.log('state change', state)
  }

  start() {
    console.log("Starting desktop here")
    this.state = 0;
    this.inflate.inflateReset();
    console.log(this.inflate)
    //this.ZRLEfirst = 1;
    //obj.inbytes = 0;
    //obj.outbytes = 0;
    this.onKvmDataPending = [];
    this.onKvmDataAck = -1;
    this.kvmDataSupported = false;
    for (var i in this.sparecache) { delete this.sparecache[i]; }
  }
  onSendKvmData(data: string) {
    if (this.onKvmDataAck !== true) {
      this.onKvmDataPending.push(data);
    } else {
      if (this.urlvars && this.urlvars['kvmdatatrace']) { console.log('KVM-Send(' + data.length + '): ' + data); }
      data = '\0KvmDataChannel\0' + data;
      this.onSend(String.fromCharCode(6, 0, 0, 0) + TypeConverter.IntToStr(data.length) + data);
      this.onKvmDataAck = false;
    }
  }
  onSend: (data: string) => void
}

// callback function for Unit testing
   function callback2(data: string):void {
   }

export { AmtDesktop2 }