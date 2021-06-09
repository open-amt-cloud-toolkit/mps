
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
export interface IDbProvider { // todo: change to auth provider?
  CIRAAuth: (guid: string, username: string, password: string) => any
  getAmtPassword: (uuid: string) => any
  IsGUIDApproved: (guid: string) => any
}
