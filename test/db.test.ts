/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import {dataBase} from '../src/utils/db';

let config = {
    "usewhitelist" : true,
    "commonName": "localhost",
    "mpsport": 4433,
    "mpsusername": "standalone",
    "mpspass": "P@ssw0rd",
    "useglobalmpscredentials": true,
    "country": "US",
    "company": "NoCorp",
    "debug": true,
    "listenany": true,
    "https": true,
    "mpstlsoffload": false,
    "webport" : 3000,
    "generateCertificates": true,
    "loggeroff": true
}

describe("Use GUID whitelisting: ", () => {
    config.usewhitelist =  true;
    let db = new dataBase(config,null); 
    it('Test if listed GUID is allowed', () => {   
        db.IsGUIDApproved("12345678-9abc-def1-2345-123456789000", (ret) => { 
            expect(ret).toBe(true);
        });
    });
    //ToDo:
    // it('Test if non listed GUID is not allowed', async() => {
    //       await db.IsGUIDApproved("12345678-9abc-def1-2345-123456789001", (ret) => {
    //         return ret;
    //       }).then((state) => {
    //         expect(state).toBe(false);
    //       })
    //       .catch((error) => {
    //         expect(error).toBe(false);
    //     });
    // });
});

describe("Do not use GUID whitelisting: ", () => {
    config.usewhitelist =  false;
    let db = new dataBase(config,null); 
    it('Test if listed GUID is allowed', () => {   
        db.IsGUIDApproved("12345678-9abc-def1-2345-123456789000", (ret) => { 
            expect(ret).toBe(true);
        });
    });

    it('Test if non listed GUID is still allowed', () => {
        db.IsGUIDApproved("12345678-9abc-def1-2345-123456789001", (ret) => {
            expect(ret).toBe(true);
        });
    });

});
