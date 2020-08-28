/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import Config from 'app.config';
import { HttpClient } from './httpClient'

//dummy endpoint 
const ENDPOINT = Config.serviceUrls.mps;
export class UserService {
  static loginUser ({payload: {userName: name, password}}) {
    const requestParams = {
      username: name,
      password
    }
    //placeholder login api
    return HttpClient.post(`${ENDPOINT}/authorize`, requestParams)
  }

  static logout () {
    //placeholder logout api
    return HttpClient.get(`${ENDPOINT}/logout`)
  }
}
