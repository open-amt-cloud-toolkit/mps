/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
export interface IDbProvider {
  CIRAAuth(guid: string, username: string, password: string, cb: any);
  getAmtPassword(uuid: string);
  IsGUIDApproved(guid:string, cb: any);
  IsOrgApproved(org:string, cb:any);
  getAllAmtCredentials();
}