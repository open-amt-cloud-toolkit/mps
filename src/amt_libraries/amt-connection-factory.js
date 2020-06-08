/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

const wscomm = require("../amt_libraries/amt-wsman-cira.js");
const wsman = require("../amt_libraries/amt-wsman.js");
const amt = require("../amt_libraries/amt.js");

function getDeviceConnection(parent) {
  this.mpsService = parent;
  this.cache = {};
}

getDeviceConnection.prototype.getAmtStack = function getAmtStack (host, port, user, pass, tls) {
  if (typeof this.cache[host + ':' + port] === 'undefined') {
    var wsstack = new wsman(wscomm, host, port, user, pass, 0, this.mpsService);
    this.cache[host + ':' + port] = new amt(wsstack);
  }
  return this.cache[host + ':' + port];
}

module.exports = getDeviceConnection;