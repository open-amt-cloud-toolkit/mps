/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { ICommunicator, IKvmDataCommunicator } from './ICommunicator'
import { IStateProcessor } from './IStateProcessor'
import { HandshakeState, SecurityOptions, SecurityResponse, ServerInit, FrameBufferBellServerCutText, Encoding } from './RFBStateProcessors'
import { Desktop } from './Desktop'
import { ServerCutTextHandler } from './RFBStateProcessors/ServerCutTextHandler'
import { RLEDecoder } from './ImageData/RLEDecoder';

/**
 * StateProcessorFactory is the factory class to return the processor for current state.
 */
class StateProcessorFactory {
  stateProcessors: any
  constructor(comm: ICommunicator, parent: Desktop, updateRFBState: (state: number) => void) {
    this.stateProcessors = {}
    this.stateProcessors[0] = new HandshakeState(comm, updateRFBState) // Got server version. Send client version
    this.stateProcessors[1] = new SecurityOptions(comm, updateRFBState) // Got security options, send None security type
    this.stateProcessors[2] = new SecurityResponse(comm, updateRFBState) // Got security response. Send share desktop flag
    this.stateProcessors[3] = new ServerInit(comm, parent, updateRFBState) // Got server init. Send encoding list
    let serverCutTextHandler = new ServerCutTextHandler(comm as IKvmDataCommunicator, parent)
    this.stateProcessors[4] = new FrameBufferBellServerCutText(comm, serverCutTextHandler, updateRFBState) // handles 3 different states, Framebufferupdate, bell and ServerCutText
    this.stateProcessors["100plus"] = new Encoding(comm, parent, new RLEDecoder(parent), updateRFBState) // handles tile count and encoding
  }
  /**
   * getProcessor returns the StateProcessor to handle the next RFB state
   * @param state RFB state to process next
   */
  getProcessor(state: number) : IStateProcessor {
    if(state <= 100) { // regular states before encoding information
      return this.stateProcessors[state]
    }
    else {
      return this.stateProcessors["100plus"] // when it reaches the encoding stage 100 is added to number of tiles in the image and processed by the Encoding processor
    }
  }
}

export { StateProcessorFactory }