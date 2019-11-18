/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { ICommunicator } from '../ICommunicator'
import { IStateProcessor } from '../IStateProcessor'
import { TypeConverter } from '../converter'
import { Desktop } from '../Desktop'
import { CommsHelper } from '../Utilities/CommsHelper';

/**
 * Set supported encodings for RFB
 */
class ServerInit implements IStateProcessor {
  wsSocket: ICommunicator
  next: IStateProcessor

  binaryEncDec: TypeConverter
  parent: Desktop
  updateRFBState: any
  constructor(comm: ICommunicator, parent: Desktop, updateRFBState: (state: number) => void) {
    this.wsSocket = comm;
    this.parent = parent
    this.updateRFBState = updateRFBState;
  }
  processState(acc: string) : number{ // acc is the accumulated byte encoded string so far
    let cmdSize: number = 0
    if(acc.length >= 24) {
      // Getting server init

      this.parent.rotation = 0; // We don't currently support screen init while rotated.
      var namelen = TypeConverter.ReadInt(acc, 20);
      if (acc.length < 24 + namelen) return 0;
      cmdSize = 24 + namelen;
      
      if(this.parent.updateScreenDimensions != null)
        this.parent.updateScreenDimensions(TypeConverter.ReadShort(acc, 0), TypeConverter.ReadShort(acc, 2))
      // obj.canvas.canvas.width = obj.rwidth = obj.width = obj.ScreenWidth = ReadShort(obj.acc, 0);
      // obj.canvas.canvas.height = obj.rheight = obj.height = obj.ScreenHeight = ReadShort(obj.acc, 2);

      // SetEncodings, with AMT we can't omit RAW, must be specified.
      // Intel AMT supports encodings: RAW (0), ZRLE (16), Desktop Size (0xFFFFFF21, -223), KVM Data Channel (1092)

      let supportedEncodings: string = '';
      if (this.parent.useZRLE) supportedEncodings += TypeConverter.IntToStr(16);
      supportedEncodings += TypeConverter.IntToStr(0);

      supportedEncodings += TypeConverter.IntToStr(1092);
      this.parent.logger.verbose('Send supported encodings')
      this.wsSocket.send(String.fromCharCode(2, 0) + TypeConverter.ShortToStr((supportedEncodings.length / 4) + 1) + supportedEncodings + TypeConverter.IntToStr(-223));          // Supported Encodings + Desktop Size

      // Set the pixel encoding to something much smaller
      // obj.Send(String.fromCharCode(0, 0, 0, 0, 16, 16, 0, 1) + ShortToStr(31) + ShortToStr(63) + ShortToStr(31) + String.fromCharCode(11, 5, 0, 0, 0, 0));                     // Setup 16 bit color RGB565 (This is the default, so we don't need to set it)
      if (this.parent.bpp == 1) 
        this.wsSocket.send(String.fromCharCode(0, 0, 0, 0, 8, 8, 0, 1) + TypeConverter.ShortToStr(7) + TypeConverter.ShortToStr(7) + TypeConverter.ShortToStr(3) + String.fromCharCode(5, 2, 0, 0, 0, 0));            // Setup 8 bit color RGB332

      this.updateRFBState(4)

      this.parent.onStateChange(3);
      this.parent.logger.info('Start new frame.')
      CommsHelper.sendRefresh(this.parent, this.wsSocket)
      //obj.timer = setInterval(obj.xxOnTimer, 50);
      this.parent.oldMouseX = -1; // Old mouse x position

      // if (this.parent.onScreenSizeChange != null) 
      // { 
      //   this.parent.onScreenSizeChange(obj, obj.ScreenWidth, obj.ScreenHeight); 
      // }

      return cmdSize;
    }
    return 0;
  }
}

export { ServerInit }