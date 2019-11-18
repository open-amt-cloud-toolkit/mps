/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { IStateProcessor } from '../IStateProcessor'
import { IDataProcessor } from '../IDataProcessor'
import { StateProcessorFactory } from '../StateProcessorFactory'
import { ICommunicator } from '../ICommunicator'
import { Desktop } from '../Desktop'
import { ILogger } from '../ILogger';

/**
 * DataProcessor provides the functionality for processing different states of RFB leveraging
 * the different StateProcessors
 */
export class DataProcessor implements IDataProcessor {
  acc: string;
  remoteFrameBufferStateManager: IStateProcessor
  stateProcessorFac: StateProcessorFactory
  parent: Desktop
  logger: ILogger
  constructor(logger: ILogger, comm : ICommunicator, parent: Desktop) {
    this.acc = ""
    this.stateProcessorFac = new StateProcessorFactory(comm, parent, this.updateRFBState.bind(this))
    this.parent = parent
    this.logger = logger
  }
  /**
   * processData is called from ICommunicator on new data coming over the wire
   * @param data is the current data block received on the web socket
   */
  processData(data: string) {
    if (!data) return
    this.acc += data
    let cmdSize = 0;
    this.logger.verbose('Process Data ACC length: ' + this.acc.length)
    while(this.acc.length > 0) {
 
      let stateProcessor : IStateProcessor = this.stateProcessorFac.getProcessor(this.parent.state);
      let prevState = this.parent.state
      cmdSize = stateProcessor.processState(this.acc)
      this.logger.verbose('State ' + prevState + ' Processed. cmdSize returned ' + cmdSize)
      if (cmdSize == 0) return;
      //console.log('before acc ', this.acc)
      this.acc = this.acc.substring(cmdSize);
      this.logger.verbose('remaining acc ' + this.acc.length + " command size: " + cmdSize + " new parent state: " + this.parent.state)
    }
  }
  
  updateRFBState(state: number) {
    this.parent.state = state
  }
}