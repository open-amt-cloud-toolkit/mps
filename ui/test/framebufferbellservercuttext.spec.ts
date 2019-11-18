/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { FrameBufferBellServerCutText } from "../core/RFBStateProcessors/FrameBufferBellServerCutText";

// classes defined for Unit testing
import { Communicator } from './helper/testcommunicator';
import { ServerCutTextHandler } from './helper/testServerCutTextHandler'

describe("Test processState function in FrameBufferBellServerCutText", () => {

    it('Test processState: acc string length === 4 and value at position 0 is 0', (doneCallback) => {
        // create object
        var communicator = new Communicator();
        var servercuttexthandler = new ServerCutTextHandler();
        var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, (state) => {
          new Promise((result) => {
            expect(state).toBe(105);
            doneCallback();
          })
        });

        //input 
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x05);

        // Test processState
        var returnvalue1 = framebuffer.processState(input);
        expect(returnvalue1).toBe(4);
    });

    it('Test processState: acc string length > 4 and value at position 0 is 0', (doneCallback) => {
        // create object
        var communicator = new Communicator();
        var servercuttexthandler = new ServerCutTextHandler();
        var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, (state) => {
          new Promise((result) => {
            expect(state).toBe(108);
            doneCallback();
          })
        });

        //input 
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x08) +
                    String.fromCharCode(0x05);

        // Test processState
        var returnvalue1 = framebuffer.processState(input);
        expect(returnvalue1).toBe(4);
    });

    it('Test processState negative test case: acc string length < 4 and value at position 0 is 0', () => {
        // create object
        var communicator = new Communicator();
        var servercuttexthandler = new ServerCutTextHandler();
        var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, callback);

        //input 
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x06);

        // Test processState
        var returnvalue1 = framebuffer.processState(input);
        expect(returnvalue1).toBe(0);
    });

    it('Test processState: acc string value at position 0 is 2', () => {
        // create object
        var communicator = new Communicator();
        var servercuttexthandler = new ServerCutTextHandler();
        var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, callback);

        //input 
        var input = String.fromCharCode(0x02) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x06);

        // Test processState
        var returnvalue1 = framebuffer.processState(input);
        expect(returnvalue1).toBe(1);
    });

    it('Test processState: acc string length > 8 (length === 12), value at position 0 is 3 and len === 4', () => {
        // create object
        var communicator = new Communicator();
        var servercuttexthandler = new ServerCutTextHandler();
        var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, callback);

        //input 
        var input = String.fromCharCode(0x03) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                    String.fromCharCode(0x00) + String.fromCharCode(0x04) + // len = 4
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x00);

        // Test processState
        var returnvalue1 = framebuffer.processState(input);
        expect(returnvalue1).toBe(15);
    });

    it('Test processState: acc string length > 8 (length > 12), value at position 0 is 3 and len === 4', () => {
      // create object
      var communicator = new Communicator();
      var servercuttexthandler = new ServerCutTextHandler();
      var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, callback);

      //input 
      var input = String.fromCharCode(0x03) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  String.fromCharCode(0x00) + String.fromCharCode(0x04) + // len = 4
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00);

      // Test processState
      var returnvalue1 = framebuffer.processState(input);
      expect(returnvalue1).toBe(15);
  });

  it('Test processState negative test case: acc string length < 8 and value at position 0 is 3', () => {
    // create object
    var communicator = new Communicator();
    var servercuttexthandler = new ServerCutTextHandler();
    var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, callback);

    //input 
    var input = String.fromCharCode(0x03) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                String.fromCharCode(0x00);

    // Test processState
    var returnvalue1 = framebuffer.processState(input);
    expect(returnvalue1).toBe(0);
  });

  it('Test processState negative test case: acc string length < 8, value at position 0 is 3 and len < acc.length+8', () => {
    // create object
    var communicator = new Communicator();
    var servercuttexthandler = new ServerCutTextHandler();
    var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, callback);

    //input 
    var input = String.fromCharCode(0x03) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                String.fromCharCode(0x00) + String.fromCharCode(0x03) + // len = 3
                String.fromCharCode(0x00) + String.fromCharCode(0x00);

    // Test processState
    var returnvalue1 = framebuffer.processState(input);
    expect(returnvalue1).toBe(0);
  });

  it('Test processState negative test case: value at position 0 is 1', () => {
    // create object
    var communicator = new Communicator();
    var servercuttexthandler = new ServerCutTextHandler();
    var framebuffer = new FrameBufferBellServerCutText(communicator, servercuttexthandler, callback);

    //input 
    var input = String.fromCharCode(0x01) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                String.fromCharCode(0x00) + String.fromCharCode(0x03) + // len = 3
                String.fromCharCode(0x00) + String.fromCharCode(0x00);

    // Test processState
    var returnvalue1 = framebuffer.processState(input);
    expect(returnvalue1).toBe(0);
  });
});

// callback function for Unit testing
function callback(state: number) {
}