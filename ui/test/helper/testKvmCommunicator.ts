/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { IKvmDataCommunicator } from '../../core/ICommunicator';

class KvmCommunicator implements IKvmDataCommunicator {

    constructor() {
    }
  
    onProcessData(data: string) {
    }
  
    onStart() {    
    }
    
    onError() {
      
    }
    onNewState(state: number) {    
    }
    onStateChanged(redirector: any, state: number){

    } 
    onSocketData(data: string) {    
    }
  
    start<T>(c: new (path: string, options: any) => T) {    
    }
  
    socketSend(data: string) {    
    }
  
    send(data: string) {
      
    }
  
    stop() {    
    }
  
    onSendKvmData: (data: string) => void;
  
  }

  export { KvmCommunicator }