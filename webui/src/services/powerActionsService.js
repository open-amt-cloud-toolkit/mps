/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import Config from 'app.config';
import { HttpClient } from './httpClient'


//dummy endpoint 
const ENDPOINT = Config.serviceUrls.mps;
export class PowerActionsService {
    static sendPowerAction({ payload: { guid, action } }) {
        const body = JSON.stringify({
            apikey: 'xxxxx',
            method: 'PowerAction',
            payload: { guid, action }
        });

        //power actions to amt devices
        return HttpClient.post(`${ENDPOINT}/amt`, body)
    }
}