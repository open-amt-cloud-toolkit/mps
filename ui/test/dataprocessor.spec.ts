/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { DataProcessor } from '../core/ImageData/DataProcessor'
import { StateProcessorFactory } from '../core/StateProcessorFactory'

// classes defined for Unit testing
import { AmtDesktop } from './helper/testdesktop';
import { Communicator } from './helper/testcommunicator';
import { TestLogger } from "./helper/testlogger"

describe("Test processData function in DataProcessor", () => {

    it('Test processData for all the states', () => {  
      
      // create objects
      var communicator = new Communicator();
      var desktop = new AmtDesktop();
      var output = new Array();
      var testLogger = new TestLogger();

      function updateRFBState(state: number) {
        desktop.state = state;
        output.push(state);
      }

      var dataprocessor = new DataProcessor(testLogger, communicator, desktop);
      dataprocessor.stateProcessorFac = new StateProcessorFactory(communicator, desktop, updateRFBState);

      // Test input
      var input = 'RFB 003.008\n' + // HandshakeState
                  String.fromCharCode(0x01) + String.fromCharCode(0x05) + // SecurityOptions
                  // SecurityResponse
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  // ServerInit
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                  '0030008000000000' + String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // acc length is equal to 24 and count value at bytes20-23 value is 0
                  // FrameBufferBellServerCutText
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x01) +
                  // encoding
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // data
                  String.fromCharCode(0x00) + String.fromCharCode(0x00); 

      // Test processState
      dataprocessor.processData(input);

      // expected result
      expect(output.length).toBe(6); // transitioned states
      expect(output[0]).toBe(1); // processed HandshakeState
      expect(output[1]).toBe(2); // processed SecurityOptions
      expect(output[2]).toBe(3); // processed SecurityResponse
      expect(output[3]).toBe(4); // processed ServerInit
      expect(output[4]).toBe(101); // processed FrameBufferBellServerCutText
      expect(output[5]).toBe(4); // processed encoding
    });

    it('processData: Test processData with Error in processing in HandshakeState state', () => {  
      // create objects
      var communicator = new Communicator();
      var desktop = new AmtDesktop();
      var output = new Array();
      var testLogger = new TestLogger();

      function updateRFBState(state: number) {
        desktop.state = state;
        output.push(state);
      }

      var dataprocessor = new DataProcessor(testLogger, communicator, desktop);
      dataprocessor.stateProcessorFac = new StateProcessorFactory(communicator, desktop, updateRFBState);

      // Test input
      var input = 'RFB 003.008' // HandshakeState

      // Test processState
      dataprocessor.processData(input);

      // expected result - no transition to any state
      expect(output.length).toBe(0); // transitioned states
    });

    it('processData: Test processData with Error in processing in SecurityOptions state', () => {  
      // create objects
      var communicator = new Communicator();
      var desktop = new AmtDesktop();
      var output = new Array();
      var testLogger = new TestLogger();

      function updateRFBState(state: number) {
        desktop.state = state;
        output.push(state);
      }

      var dataprocessor = new DataProcessor(testLogger, communicator, desktop);
      dataprocessor.stateProcessorFac = new StateProcessorFactory(communicator, desktop, updateRFBState);

      // Test input
      var input = 'RFB 003.008\n' // HandshakeState

      // Test processState
      dataprocessor.processData(input);
      
      // expected result
      expect(output.length).toBe(1); // transitioned states
      expect(output[0]).toBe(1); // processed HandshakeState
    });

    it('processData: Test processData with Error in processing in SecurityResponse state', () => {  
      // create objects
      var communicator = new Communicator();
      var desktop = new AmtDesktop();
      var output = new Array();
      var testLogger = new TestLogger();

      function updateRFBState(state: number) {
        desktop.state = state;
        output.push(state);
      }

      var dataprocessor = new DataProcessor(testLogger, communicator, desktop);
      dataprocessor.stateProcessorFac = new StateProcessorFactory(communicator, desktop, updateRFBState);

      // Test input
      var input = 'RFB 003.008\n' + // HandshakeState
                  String.fromCharCode(0x01) + String.fromCharCode(0x05) + // SecurityOptions
                  // SecurityResponse
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  String.fromCharCode(0x00);

      // Test processState
      dataprocessor.processData(input);

      // expected result
      expect(output.length).toBe(2); // transitioned states
      expect(output[0]).toBe(1); // processed HandshakeState
      expect(output[1]).toBe(2); // processed SecurityOptions
    });

    it('processData: Test processData with Error in processing in ServerInit state', () => {  
      // create objects
      var communicator = new Communicator();
      var desktop = new AmtDesktop();
      var output = new Array();
      var testLogger = new TestLogger();

      function updateRFBState(state: number) {
        desktop.state = state;
        output.push(state);
      }

      var dataprocessor = new DataProcessor(testLogger, communicator, desktop);
      dataprocessor.stateProcessorFac = new StateProcessorFactory(communicator, desktop, updateRFBState);

      // Test input
      var input = 'RFB 003.008\n' + // HandshakeState
                  String.fromCharCode(0x01) + String.fromCharCode(0x05) + // SecurityOptions
                  // SecurityResponse
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  // ServerInit
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                  '003000800000000';

      // Test processState
      dataprocessor.processData(input);
      // expected result
      expect(output.length).toBe(3); // transitioned states
      expect(output[0]).toBe(1); // processed HandshakeState
      expect(output[1]).toBe(2); // processed SecurityOptions
      expect(output[2]).toBe(3); // processed SecurityResponse
    });

    it('processData: Test processData with Error in processing in FrameBufferBellServerCutText state', () => {  
      // create objects
      var communicator = new Communicator();
      var desktop = new AmtDesktop();
      var output = new Array();
      var testLogger = new TestLogger();

      function updateRFBState(state: number) {
        desktop.state = state;
        output.push(state);
      }

      var dataprocessor = new DataProcessor(testLogger, communicator, desktop);
      dataprocessor.stateProcessorFac = new StateProcessorFactory(communicator, desktop, updateRFBState);

      // Test input
      var input = 'RFB 003.008\n' + // HandshakeState
                  String.fromCharCode(0x01) + String.fromCharCode(0x05) + // SecurityOptions
                  // SecurityResponse
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  // ServerInit
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                  '0030008000000000' + String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // acc length is equal to 24 and count value at bytes20-23 value is 0
                  // FrameBufferBellServerCutText
                  String.fromCharCode(0x05) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x05) +
                  // encoding
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // data
                  String.fromCharCode(0x00) + String.fromCharCode(0x00);

      // Test processState
      dataprocessor.processData(input);

      // expected result
      expect(output.length).toBe(4); // transitioned states
      expect(output[0]).toBe(1); // processed HandshakeState
      expect(output[1]).toBe(2); // processed SecurityOptions
      expect(output[2]).toBe(3); // processed SecurityResponse
      expect(output[3]).toBe(4); // processed ServerInit
    });

    it('processData: Test processData with Error in processing in Encoding state', () => {  
      // create objects
      var communicator = new Communicator();
      var desktop = new AmtDesktop();
      var output = new Array();
      var testLogger = new TestLogger();

      function updateRFBState(state: number) {
        desktop.state = state;
        output.push(state);
      }

      var dataprocessor = new DataProcessor(testLogger, communicator, desktop);
      dataprocessor.stateProcessorFac = new StateProcessorFactory(communicator, desktop, updateRFBState);

      // Test input
      var input = 'RFB 003.008\n' + // HandshakeState
                  String.fromCharCode(0x01) + String.fromCharCode(0x05) + // SecurityOptions
                  // SecurityResponse
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + 
                  // ServerInit
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // First 2 bytes represent Screen size : 60
                  String.fromCharCode(0x00) + String.fromCharCode(0x3C) + // 3rd-4th bytes represent Screen size : 60
                  '0030008000000000' + String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // acc length is equal to 24 and count value at bytes20-23 value is 0
                  // FrameBufferBellServerCutText
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x08) +
                  // encoding
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // data
                  String.fromCharCode(0x00);                              // imcomplete

      // Test processState
      dataprocessor.processData(input);

      // expected result
      expect(output.length).toBe(5); // transitioned states
      expect(output[0]).toBe(1); // processed HandshakeState
      expect(output[1]).toBe(2); // processed SecurityOptions
      expect(output[2]).toBe(3); // processed SecurityResponse
      expect(output[3]).toBe(4); // processed ServerInit
      expect(output[4]).toBe(108); // processed FrameBufferBellServerCutText
    });
});
