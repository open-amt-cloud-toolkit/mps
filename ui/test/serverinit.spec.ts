/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { ServerInit } from "../core/RFBStateProcessors/ServerInit";
import { TypeConverter } from '../core/converter';

// classes defined for Unit testing
import { AmtDesktop } from './helper/testdesktop';
import { Communicator } from './helper/testcommunicator';

describe("Test processState function in ServerInit", () => {

    it('Test processState with positive test case: acc length greater than 24 + count value (at bytes20-23)', (doneCallback) => {  
      // create objects
      var communicator = new Communicator()
      var serverinit = new ServerInit(communicator, new AmtDesktop(), (state) => {
        // Create promise object to test callback
        new Promise((result) => {
        expect(state).toBe(4)
        doneCallback()
        })
      });

      // Test input
      var input = String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                  '0030008000000000' + String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x03) + '0000000'; // acc length greater than 24 + count value at bytes20-23 value

      // Test processState
      var returnvalue1 = serverinit.processState(input);
      expect(returnvalue1).toBe(27);
    });

    it('Test processState with positive test case: acc length equal to that of 24 + count value at bytes20-23 value', (doneCallback) => {  
      // create objects
      var communicator = new Communicator()
      var serverinit = new ServerInit(communicator, new AmtDesktop(), (state) => {
        // Create promise object to test callback
        new Promise((result) => {
          expect(state).toBe(4)
          doneCallback()
        })
      });

      // Test input
      var input = String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                  '0030008000000000' + String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + '00'; // acc length equal to that of 24 + count value at bytes20-23 value

      // Test processState
      var returnvalue1 = serverinit.processState(input);
      expect(returnvalue1).toBe(26);
  });

  it('Test processState with positive test case: acc length is equal to 24 and count value at bytes20-23 value is 0', (doneCallback) => {
    // create objects
    var communicator = new Communicator()
    var serverinit = new ServerInit(communicator, new AmtDesktop(), (state) => {
      // Create promise object to test callback
      new Promise((result) => {
        expect(state).toBe(4)
        doneCallback()
      })
    });

    // Test input
    var input = String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                '0030008000000000' + String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00); // acc length is equal to 24 and count value at bytes20-23 value is 0

    // Test processState
    var returnvalue2 = serverinit.processState(input);
    expect(returnvalue2).toBe(24);
  });

  it('Test processState with negative test case: acc length less than 24 + count value at bytes20-23 value', () => {
    // create objects
    var communicator = new Communicator()
    var serverinit = new ServerInit(communicator, new AmtDesktop(), callback);

    // Test input
    var input = String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                '0030008000000000' + String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x09) + '000000'; // acc length less than 24 + count value at bytes20-23 value

    // Test processState
    var returnvalue2 = serverinit.processState(input);
    expect(returnvalue2).toBe(0);
  });

  it('Test processState with negative test case: acc length < 24: negative test case', () => {
    // create objects
    var communicator = new Communicator()
    var serverinit = new ServerInit(communicator, new AmtDesktop(), callback);

    // Test processState
    var returnvalue3 = serverinit.processState('00000000000000000000000');
    expect(returnvalue3).toBe(0);
  });
});

// callback function for Unit testing
function callback(state: number) {
}