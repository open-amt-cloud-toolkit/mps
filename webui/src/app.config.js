// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

const validExtensions = ['.png', '.jpeg', '.jpg', '.svg'];
const port = process.env.REACT_APP_MPS_WEB_PORT? process.env.REACT_APP_MPS_WEB_PORT : 3000;
const rpsPort = process.env.REACT_APP_RPS_WEB_PORT ? process.env.REACT_APP_RPS_WEB_PORT : 8081;
const rpsServerIP = process.env.REACT_APP_RPS_SERVER ? process.env.REACT_APP_RPS_SERVER : 'localhost';
const serverIP = process.env.REACT_APP_MPS_SERVER ? process.env.REACT_APP_MPS_SERVER : 'localhost';
const mpsAPIKey = process.env.REACT_APP_MPSXAPIKEY ? process.env.REACT_APP_MPSXAPIKEY : 'APIKEYFORMPS123!';
const rpsAPIKey = process.env.REACT_APP_RPSXAPIKEY ? process.env.REACT_APP_RPSXAPIKEY : 'APIKEYFORRPS123!'
const Config = {
  serviceUrls: {
    mps: `https://${serverIP}:${port}`, //ToDo: Need to update with rc config 
    rps: `https://${rpsServerIP}:${rpsPort}`
  },
  // Constants
  defaultAjaxTimeout: 20000, // 20s
  maxRetryAttempts: 2,
  retryWaitTime: 2000, // On retryable error, retry after 2s
  retryableStatusCodes: new Set([ 0, 401, 502, 503 ]),
  paginationPageSize: 50,
  smallGridPageSize: 8,
  clickDebounceTime: 180, // ms
  gridResizeDebounceTime: 200, // ms
  validExtensions: validExtensions.join(),
  emptyValue: '--',
  gridMinResize: 1200, // In px
  maxLogoFileSizeInBytes: 307200,
  mpsServer: `${serverIP}:${port}`,
  mpsApiKey: `${mpsAPIKey}`,
  rpsEnabled: true,
  rpsApiKey: `${rpsAPIKey}`
};

export default Config;
