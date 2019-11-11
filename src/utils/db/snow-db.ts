import * as path from "path";
import * as util from "util";
import * as CryptoJS from 'crypto-js';
import axios from 'axios';

import { configType } from "../../models/Config";
import { logger as log } from "../logger";
import { dataBase } from "./db";


export default class SnowDB extends dataBase {
  constructor(config: configType, datapath: string) {
    super(config, datapath)
  }

  // not sure what to do about this...
  async CIRAAuth(guid, username, password, func) {
    try {
      var result = false;
      // var cred = await this.getCredentialsForGuid(guid);
      // if (cred && cred.mpsuser == username && cred.mpspass == password) {
      //   result = true;
      if (super.getConfig().useglobalmpscredentials) {
        if (super.getConfig().mpsusername == username && super.getConfig().mpspass == password) {
          result = true;
        }
      }
      if (func) func(result);
    } catch (error) {
      log.error(`Exception in CIRAAuth: ${error}`);
    }
  }

  async getAmtPassword(uuid: string) {
    var result = ["admin", ""];
    try {
      var resp = await axios({
        url: super.getConfig().snowUrl,
        params: {
          guid: uuid
        },
        auth: {
          username: super.getConfig().snowAuthUsername,
          password: super.getConfig().snowAuthPassword
        }
      });

      var code = CryptoJS.AES.decrypt(resp.data.result.pwd, super.getConfig().snowSecret);
      var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

      if (resp) {
        result = [resp.data.result.user, decryptedMessage];
      }
    } catch (error) {
      log.error(`Exception in getAmtPassword: ${error}`);
    }
    return result;
  }
}
