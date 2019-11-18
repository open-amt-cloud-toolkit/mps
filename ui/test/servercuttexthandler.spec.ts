/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { ServerCutTextHandler } from "../core/RFBStateProcessors/ServerCutTextHandler";

// classes defined for Unit testing
import { AmtDesktop2 } from './helper/testAmtDesktop2';
import { KvmCommunicator } from './helper/testKvmCommunicator';

describe("Test handleServerCutText function in ServerCutTextHandler", () => {
 
    it('Test ServerCutTextHandler for positive test case', () => {
        // create object
        var communicator = new KvmCommunicator();
        var desktop = new AmtDesktop2();
        var securityresponse = new ServerCutTextHandler(communicator, desktop);

        // Test input (byte 0-3) value === 0
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x10) +
                    '\0KvmDataChannel1';
        desktop.start();

        // Test processState
        var returnvalue1 = securityresponse.handleServerCutText(input);
        expect(returnvalue1).toBe(24);
        expect(desktop.kvmDataSupported).toBe(true);
        expect(desktop.onKvmDataAck).toBe(true);
        expect(desktop.onKvmDataAck).toBe(true);
    });

      it('Test ServerCutTextHandler negative test case: acc.length < len', () => {
          // create object
          var communicator = new KvmCommunicator();
          var desktop = new AmtDesktop2();
          var securityresponse = new ServerCutTextHandler(communicator, desktop);

          // Test input (byte 0-3) value === 0
          var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                      String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                      String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                      String.fromCharCode(0x00) + String.fromCharCode(0x0F) +
                      'KvmDataChannel';

          // Test processState
          var returnvalue1 = securityresponse.handleServerCutText(input);
          expect(returnvalue1).toBe(0);
      });

      it('Test ServerCutTextHandler negative test case: acc length < 8', () => {
        // create object
        var communicator = new KvmCommunicator();
        var desktop = new AmtDesktop2();
        var securityresponse = new ServerCutTextHandler(communicator, desktop);

        // Test input (byte 0-3) value === 0
        var input = 'KvmData';

        // Test processState
        var returnvalue1 = securityresponse.handleServerCutText(input);
        expect(returnvalue1).toBe(0);
    }); 
});
  
// callback function for Unit testing
function callback(state: number) {
}

