/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

 interface IServerCutTextHandler {
  handleServerCutText(acc: string) : number
}

export { IServerCutTextHandler }