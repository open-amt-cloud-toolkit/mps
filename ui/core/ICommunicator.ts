/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

 /**
 * ICommunicator interface handles all communication over the websocket
 */
interface ICommunicator {
  onProcessData: (data: string) => void
  onStart: () => void
  onNewState: (state: number) => void
  onStateChanged: (redirector: any, state: number) => void;
  onError: () => void
  start<T>(c: new (path: string) => T) : void
  socketSend(data: string) : void
  send(data: string) : void
  stop() : void

}

/**
 * ICommunicator refined for KvmData
 */
interface IKvmDataCommunicator extends ICommunicator {
  onSendKvmData: (data: string) => void
}

export { ICommunicator, IKvmDataCommunicator }