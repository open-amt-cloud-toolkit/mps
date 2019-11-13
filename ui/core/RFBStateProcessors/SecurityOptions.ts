/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { ICommunicator } from '../ICommunicator'
import { IStateProcessor } from '../IStateProcessor'

/**
 * Get security options from remote device. Send auth type.
 */
class SecurityOptions implements IStateProcessor {
  wsSocket: ICommunicator
  next: IStateProcessor
  updateRFBState: any
  constructor(comm: ICommunicator, updateRFBState: (state:number) => void) {
    this.wsSocket = comm;
    this.updateRFBState = updateRFBState;
    
  }
  processState(acc: string): number{ // acc is the accumulated byte encoded string so far
    let cmdSize = 0
    if(acc.length >= 1) {
      // Getting security options
      cmdSize = acc.charCodeAt(0) + 1;
      this.wsSocket.send(String.fromCharCode(1)); // Send the "None" security type. Since we already authenticated using redirection digest auth, we don't need to do this again.
      this.updateRFBState(2)
      return cmdSize;
    }
    return 0;
  }
}

export { SecurityOptions }