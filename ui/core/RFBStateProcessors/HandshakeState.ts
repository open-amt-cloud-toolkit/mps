/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { ICommunicator } from '../ICommunicator'
import { IStateProcessor } from '../IStateProcessor'

/**
 * Initial handshake and send RFB protocol supported on client
 */
class HandshakeState implements IStateProcessor {
  wsSocket: ICommunicator
  next: IStateProcessor
  
  updateRFBState: any
  constructor(comm: ICommunicator, updateRFBState: (state: number) => void) {
    this.wsSocket = comm;
    this.updateRFBState = updateRFBState;
  }
  processState(acc: string): number{ // acc is the accumulated byte encoded string so far
    let cmdSize = 0
    if(acc.length >= 12) {
      // Getting handshake & version
      cmdSize = 12;
      //if (obj.acc.substring(0, 4) != "RFB ") { return obj.Stop(); }
      //var version = parseFloat(obj.acc.substring(4, 11));
      //obj.Debug("KVersion: " + version);
      this.updateRFBState(1)
      this.wsSocket.send("RFB 003.008\n");

      return cmdSize;
    }

    return 0;
  }
}

export { HandshakeState }