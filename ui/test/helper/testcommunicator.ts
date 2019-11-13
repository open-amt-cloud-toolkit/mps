/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { ICommunicator } from '../../core/ICommunicator';

class Communicator implements ICommunicator {

    static sentData: string;
  
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
        Communicator.sentData += data;
    }
  
    stop() {    
    }
  
}

export { Communicator }