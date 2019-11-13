/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { IServerCutTextHandler } from '../IServerCutTextHandler'
import { IKvmDataCommunicator } from '../ICommunicator'
import { Desktop } from '../Desktop'
import { TypeConverter } from '../converter'
class ServerCutTextHandler implements IServerCutTextHandler {
  binaryEncDec: TypeConverter
  wsSocket: IKvmDataCommunicator
  parent: Desktop
  constructor(comm: IKvmDataCommunicator, parent: Desktop) {
    this.wsSocket = comm;
    this.parent = parent;
  }
  handleServerCutText(acc: string) : number {
    if (acc.length < 8) return 0;
    var len = TypeConverter.ReadInt(acc, 4) + 8;
    if (acc.length < len) return 0;

    if (this.parent.onKvmData != null) {
        var d = acc.substring(8, len);
        if ((d.length >= 16) && (d.substring(0, 15) == '\0KvmDataChannel')) {
            if (this.parent.kvmDataSupported == false) { this.parent.kvmDataSupported = true; console.log('KVM Data Channel Supported.'); }
            if (((this.parent.onKvmDataAck == -1) && (d.length == 16)) || (d.charCodeAt(15) != 0)) { this.parent.onKvmDataAck = true; }
            if (this.parent.urlvars && this.parent.urlvars['kvmdatatrace']) { console.log('KVM-Recv(' + (d.length - 16) + '): ' + d.substring(16)); }
            if (d.length > 16) { this.parent.onKvmData(d.substring(16)); } // Event the data and ack
            if ((this.parent.onKvmDataAck == true) && (this.parent.onKvmDataPending.length > 0)) { this.wsSocket.onSendKvmData(this.parent.onKvmDataPending.shift()); } // Send pending data
        }
    }
    return len;
  }
}

export { ServerCutTextHandler }