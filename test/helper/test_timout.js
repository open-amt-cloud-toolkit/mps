/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

var obj = {
    debug: true,
    ciraclients: []
};

var args_template = {
    host: "localhost",
    port: 4433,
    clientName: 'cira-dummy',
    uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
    username: 'standalone', // mps username
    password: 'P@ssw0rd', // mps password
    keepalive: 60000 // interval for keepalive ping 60 second
};

var count = 2;
var tail_len = count.toString(16).length;

for (var i=0; i< count; i++) {
    var args = JSON.parse(JSON.stringify(args_template));
    args.clientName +='-'+i;
    args.uuid = args.uuid.substring(0, args.uuid.length - tail_len);
    var t = i.toString(16).toLocaleLowerCase();
    var pt = '';
    for (var j=t.length; j<tail_len; j++) {
        pt+='0';
    }
    pt+=t;
    args.uuid += pt;
    obj.ciraclients[i] = require('./ciraclient.js').CreateCiraClient(obj, args);
}

for (var i=0; i< count; i++) {
    obj.ciraclients[i].connect();
}
