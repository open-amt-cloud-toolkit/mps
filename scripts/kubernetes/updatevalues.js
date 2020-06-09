/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
var fs = require('fs');

let envPath = `.env`;
let helmfilepath = "./serversChart/values.yaml";

if (fs.existsSync(envPath)) {
    if (fs.existsSync(helmfilepath)) {
        var array = fs.readFileSync(envPath).toString().split("\n");
        let helmFile = fs.readFileSync(helmfilepath).toString();

        for (i in array) {
            var line = array[i];
            var entry = line.split(`=`);

            if (entry.length == 2 && entry[0] && entry[1]) {
                helmFile = helmFile.replace(new RegExp(entry[0], 'g'), entry[1].trim());
                console.log(`replaced: ${entry[0]} with: ${entry[1]}`);
            } else {
                console.log(`line invalid: ${line}`);
            }
        }

        fs.writeFileSync(helmfilepath, helmFile);

    } else {
        console.log(`${helmfilepath} doesn't exist`);
    }

} else {
    console.log(`${envPath} doesn't exist`);
}
