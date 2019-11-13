/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { SecurityResponse } from "../core/RFBStateProcessors/SecurityResponse";

// classes defined for Unit testing
import { Communicator } from './helper/testcommunicator';

describe("Test processState function in SecurityResponse", () => {
  
      it('Test processState: prop size > 4 (positive test case)', (doneCallback) => {
          // create object
          var communicator = new Communicator()
          var securityresponse = new SecurityResponse(communicator, (state) => {
            new Promise((result) => {
              expect(state).toBe(3);
              doneCallback();
            })
          });

          // Test input (byte 0-3) value === 0
          var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                      String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                      String.fromCharCode(0x01) + String.fromCharCode(0x02);

          // Test processState
          var returnvalue1 = securityresponse.processState(input);
          expect(returnvalue1).toBe(4);
      });
  
      it('Test processState: prop size === 4 (positive test case)', (doneCallback) => {
          // create object
          var communicator = new Communicator()
          var securityresponse = new SecurityResponse(communicator, (state) => {
            new Promise((result) => {
              expect(state).toBe(3);
              doneCallback();
            })
          });

          // Test input (byte 0-3) value === 0
          var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                      String.fromCharCode(0x00) + String.fromCharCode(0x00);          

          // Test processState
          var returnvalue2 = securityresponse.processState(input);
          expect(returnvalue2).toBe(4);
      });
  
      it('Test processState: prop size > 4 but input non-zero (negative test case)', () => {
          // create object
          var communicator = new Communicator()
          var securityresponse = new SecurityResponse(communicator, callback );
          
          // Test input (byte 0-3) value != 0
          var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                      String.fromCharCode(0x00) + String.fromCharCode(0x01) +
                      String.fromCharCode(0x01) + String.fromCharCode(0x07);          

          // Test processState
          try {
            var returnvalue3 = securityresponse.processState(input);
            // Fail test if processState doesn't throw.
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toMatch("Error. Stopping. Security response not None.");
          }
      });

      it('Test processState: prop size === 4 but input non-zero (negative test case)', () => {
        // create object
        var communicator = new Communicator()
        var securityresponse = new SecurityResponse(communicator, callback );
        
        // Test input (byte 0-3) value != 0
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x10);          

          // Test processState
          try {
            var returnvalue3 = securityresponse.processState(input);
            // Fail test if processState doesn't throw.
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toMatch("Error. Stopping. Security response not None.");
          }
    });

      it('Test processState: prop size < 4 (negative test case)', () => {
        // create object
        var communicator = new Communicator()
        var securityresponse = new SecurityResponse(communicator, callback );
        
        // Test input
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00);       

        // Test processState
        var returnvalue4 = securityresponse.processState(input);
        expect(returnvalue4).toBe(0);
    });
  });
  
  // callback function for Unit testing
  function callback(state: number) {
  }