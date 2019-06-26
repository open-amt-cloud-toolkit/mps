/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get power capabilities of amt device
**********************************************************************/

import {Response, Request} from 'express'
import { logger as log } from "../../utils/logger";
import { IAmtHandler } from "../../models/IAmtHandler";
import { mpsMicroservice } from "../../mpsMicroservice";
import {ErrorResponse} from "../../utils/amtHelper";
import { wscomm, wsman, amt} from "../../utils/constants";

export class PowerCapabilitiesHandler implements IAmtHandler {
  
  mpsService: mpsMicroservice;
  name: string;

  constructor(mpsService: mpsMicroservice) {
      this.name="PowerCapabilities";
      this.mpsService =mpsService;
  }

  async AmtAction(req: Request, res: Response){
    try{
        let payload = req.body.payload;  
        if(payload.guid){
          let ciraconn = this.mpsService.mpsserver.ciraConnections[payload.guid];
          if(ciraconn && ciraconn.readyState == 'open'){
            var cred = await this.mpsService.db.getAmtPassword(payload.guid);
            var wsstack = new wsman(wscomm, payload.guid, 16992, cred[0], cred[1], 0, this.mpsService);
            var amtstack = new amt(wsstack);
            this.getVersion(amtstack, res, (responses, res) =>{
              var versionData = responses;
              amtstack.Get("AMT_BootCapabilities", async (stack, name, responses, status) => {
                  if (status != 200) {
                    log.error(`Request failed during GET AMT_BootCapabilities for guid : ${payload.guid}`);
                    return res.status(status).send(ErrorResponse(status, `Request failed during GET AMT_BootCapabilities for guid : ${payload.guid}`));
                  }
                  //console.log("AMT_BootCapabilities info of " + uuid + " sent.");
                  let power_cap = await this.bootCapabilities(versionData, responses.Body);
                  return res.send(power_cap);
                }, 0, 1);
            });
          }else{
            res.set({ 'Content-Type': 'application/json' });
            return res.status(404).send(ErrorResponse(404, `guid : ${payload.guid}`, 'device'));
          }            
        }else{
            res.set({ 'Content-Type': 'application/json' });
            return res.status(404).send(ErrorResponse(404, null, 'guid'));
        }
    }catch(error){
         log.error(`Exception in AMT PowerCapabilities : ${error}`);
         return res.status(500).send(ErrorResponse(500, 'Request failed during AMT PowerCapabilities.'));
    }
  }

  //Return Boot Capabilities
  bootCapabilities(amtVersionData, response) {
    var amtversion = this.parseVersionData(amtVersionData);
    var data = { 'Power up': 2, 'Power cycle': 5, 'Power down': 8, 'Reset': 10 };
    if (amtversion > 9) {
        data['Soft-off'] = 12;
        data['Soft-reset'] = 14;
        data['Sleep'] = 4;
        data['Hibernate'] = 7;
    }
    if (response["BIOSSetup"] == true) {
        data['Power up to BIOS'] = 100;
        data['Reset to BIOS'] = 101;
    }
    if (response["SecureErase"] == true) {
        data['Reset to Secure Erase'] = 104;
    }
    data['Reset to IDE-R Floppy'] = 200;
    data['Power on to IDE-R Floppy'] = 201;
    data['Reset to IDE-R CDROM'] = 202;
    data['Power on to IDE-R CDROM'] = 203;
    if (response["ForceDiagnosticBoot"] == true) {
        data['Power on to diagnostic'] = 300;
        data['Reset to diagnostic'] = 301;
    }
    data['Reset to PXE'] = 400;
    data['Power on to PXE'] = 401;
    return data;
  }

  //Parse Version Data
  parseVersionData(amtVersionData) {
    var verList = amtVersionData["CIM_SoftwareIdentity"].responses
    for (var i in verList) {
        if (verList[i]["InstanceID"] == "AMT") {
            return verList[i]["VersionString"].split('.')[0];
        }
    }
  }

  //Returns AMT version data
  getVersion(amtstack, res, func) {
    try {
        amtstack.BatchEnum("", ["CIM_SoftwareIdentity", "*AMT_SetupAndConfigurationService"],
            function (stack, name, responses, status) {
                if (status != 200) {
                    return res.status(status).send(ErrorResponse(status, "Request failed during AMTVersion BatchEnum Exec."));
                }
                if (!func) { return res.send(JSON.stringify(responses)); }
                else { func(responses, res); }
            });
    }
    catch (ex) {
        return res.status(500).send(ErrorResponse(500, 'Request failed during AMTVersion BatchEnum Exec.'));
    }
  }
}