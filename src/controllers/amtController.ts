/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: handles all the amt endpoint calls
**********************************************************************/

import { RootContainer } from "../dependencyHandlers/RootContainer";
import { ErrorResponse } from "../utils/amtHelper";
import { logger as log } from "../utils/logger";
import { Response, Request } from "express";

export class amtController {
  static container: RootContainer;

  static init(mps) {
    amtController.container = new RootContainer(mps);
    amtController.container.amtBuild();
  }

  static async HandlePostRoute(req: Request, res: Response) {
    let method = req.body.method || '';
    if (method) {
     let payload = req.body.payload || '';
     if(payload){
        let handler = amtController.container.amtRegistrar.getHandler(method);
        if (handler) {
          await handler.AmtAction(req, res);
        } else {
          return res.status(404).send(ErrorResponse(404, null, "noMethod"));
        }
     }else{
        return res.status(404).send(ErrorResponse(404, null, "payload"));
     }
    } else {
      return res.status(404).send(ErrorResponse(404, null, "method"));
    }
  }
}
