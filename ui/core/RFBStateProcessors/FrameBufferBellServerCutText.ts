/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { ICommunicator } from '../ICommunicator'
import { IStateProcessor } from '../IStateProcessor'
import { TypeConverter } from '../converter'
import { IServerCutTextHandler } from '../IServerCutTextHandler'

class FrameBufferBellServerCutText implements IStateProcessor {
  wsSocket: ICommunicator
  next: IStateProcessor
  cmdSize: number
  binaryEncDec: TypeConverter
  serverCutTextHandler: IServerCutTextHandler
  updateRFBState: any
  constructor(comm: ICommunicator, serverCutTextHandler: IServerCutTextHandler, updateRFBState: (state: number) => void) {
    this.wsSocket = comm;
    this.serverCutTextHandler = serverCutTextHandler
    this.updateRFBState = updateRFBState;
  }
  processState(acc: string): number { // acc is the accumulated byte encoded string so far
    let cmdsize = 0;
    switch (acc.charCodeAt(0)) {
      case 0: // FramebufferUpdate
        if (acc.length < 4) return 0;
        this.updateRFBState(100 + TypeConverter.ReadShort(acc, 2)); // Read the number of tiles that are going to be sent, add 100 and use that as our protocol state.
        cmdsize = 4;
        break;
      case 2: // This is the bell, do nothing.
        cmdsize = 1;
        break;
      case 3: // This is ServerCutText
        if (acc.length < 8) return 0;
        var len = TypeConverter.ReadInt(acc, 4) + 8;
        if (acc.length < len) return 0;
        cmdsize = this.serverCutTextHandler.handleServerCutText(acc);
        break;
    }
    return cmdsize;
  }
}

export { FrameBufferBellServerCutText }