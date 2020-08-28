/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import Config from 'app.config';
import { HttpClient } from './httpClient'


//dummy endpoint 
const ENDPOINT = Config.serviceUrls.mps;

export class DevicesService {
    static fetchDevices(){
        const requestParams = {
            apikey: 'xxxxx',
            method: 'AllDevices',
            payload:{}
        };
        return HttpClient.post(`${ENDPOINT}/admin`, requestParams)
    }
    static fetchMEScript(){
        const requestParams = {
            apikey: 'xxxxx',
            method: 'MEScript',
            payload: {}
          };
        return HttpClient.post(`${ENDPOINT}/admin`, requestParams)
    }
}