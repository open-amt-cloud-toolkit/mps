/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { ICommunicator } from '../ICommunicator'
import { IStateProcessor } from '../IStateProcessor'
import { TypeConverter } from '../converter'

/**
 * Get auth security response and proceed with share desktop flag
 */
class SecurityResponse implements IStateProcessor {
  wsSocket: ICommunicator
  next: IStateProcessor
  binaryEncDec: TypeConverter
  updateRFBState: any
  constructor(comm: ICommunicator, updateRFBState: (state: number) => void) {
    this.wsSocket = comm;
    this.updateRFBState = updateRFBState;
  }
  processState(acc: string) : number{ // acc is the accumulated byte encoded string so far
    let cmdSize = 0
    if(acc.length >= 4) {
      // Getting security response
      cmdSize = 4;
      if (TypeConverter.ReadInt(acc, 0) != 0) 
      { 
        let reasonLength = TypeConverter.ReadInt(acc, 4);
        let reasonString = acc.substring(8, 8 + reasonLength);
        //console.log(reasonString)
        //Need to be fixed. Close the connection when this happens
        throw ("Error. Stopping. Security response not None.");
      }
      this.wsSocket.send(String.fromCharCode(1)); // Send share desktop flag
      this.updateRFBState(3)
      return cmdSize;
    }
    return 0   
  }
}

export { SecurityResponse }