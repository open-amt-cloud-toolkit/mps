/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Encoding } from "../core/RFBStateProcessors/Encoding";
import { TypeConverter } from '../core/converter';

// classes defined for Unit testing
import { Communicator } from './helper/testcommunicator';
import { zLib } from './helper/testzlib';
import { AmtDesktop } from './helper/testdesktop';
import { Decoder } from './helper/testDecoder';

describe("Test processState function in Encoding", () => {

    it('Test processState: acc > 12 with encoding === 0', (doneCallback) => {  
      // create objects
      var communicator = new Communicator();
      var decoder = new Decoder();
      var desktop = new AmtDesktop();
      var serverinit = new Encoding(communicator, desktop, decoder, (state) => {
        new Promise((result) => {
          expect(state).toBe(4);
          doneCallback();
        })
      });

      // Test input
      var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // data
                  String.fromCharCode(0x00) + String.fromCharCode(0x00);  
      desktop.frameRateDelay = 2;
      desktop.state = 101;

      // Test processState
      var returnvalue1 = serverinit.processState(input);
      expect(returnvalue1).toBe(16);
    });

    it('Test processState negative test case: acc > 12, encoding === 0 and acc.length < cs', () => {  
      // create objects
      var communicator = new Communicator();
      var decoder = new Decoder();
      var desktop = new AmtDesktop();
      var serverinit = new Encoding(communicator, desktop, decoder, callback);

      // Test input - acc.length < cs
      var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // data
                  String.fromCharCode(0x00); 

      // Test processState
      var returnvalue1 = serverinit.processState(input);
      expect(returnvalue1).toBe(0);
    });

    it('Test processState: acc > 12, encoding === 0XFFFFFF21', (doneCallback) => {  
        // create objects
        var communicator = new Communicator();
        var decoder = new Decoder();
        var desktop = new AmtDesktop();
        var serverinit = new Encoding(communicator, desktop, decoder, (state) => {
          new Promise((result) => {
            expect(state).toBe(4);
            doneCallback();
          })
        });
  
        // Test input
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y
                    String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                    String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                    String.fromCharCode(0xFF) + String.fromCharCode(0xFF) + // encoding byte 0-1
                    String.fromCharCode(0xFF) + String.fromCharCode(0x21) + // encoding byte 2-3;
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // data
                    String.fromCharCode(0x00); 
                    desktop.frameRateDelay = 2;
                    desktop.state = 101; 
  
        // Test processState
        var returnvalue1 = serverinit.processState(input);
        expect(returnvalue1).toBe(12);
    });

    it('Test processState: encoding === 16 with uncompressed ZLib data block', (doneCallback) => {  
        // create objects
        var communicator = new Communicator();
        var decoder = new Decoder();
        var desktop = new AmtDesktop();
        var serverinit = new Encoding(communicator, desktop, decoder, (state) => {
          new Promise((result) => {
            expect(state).toBe(4);
            doneCallback();
          })
        });
  
        // Test input
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y
                    String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                    String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                    String.fromCharCode(0x00) + String.fromCharCode(0x10) + // encoding byte 2-3;
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // datalen
                    String.fromCharCode(0x00) + String.fromCharCode(0x06) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x01) + // data
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x00);  
                    desktop.frameRateDelay = 2;
                    desktop.state = 101;
  
        // Test processState
        var returnvalue1 = serverinit.processState(input);
        expect(returnvalue1).toBe(22);
    });

    it('Test processState: encoding === 16 with compressed ZLib data', (doneCallback) => {  
        // create objects
        var communicator = new Communicator();
        var decoder = new Decoder();
        var desktop = new AmtDesktop();
        var serverinit = new Encoding(communicator, desktop, decoder, (state) => {
          new Promise((result) => {
            expect(state).toBe(4);
            doneCallback();
          })
        });
  
        // Test input
        var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x:0-1
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y:2-3
                    String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                    String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                    String.fromCharCode(0x00) + String.fromCharCode(0x10) + // encoding byte 2-3;
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) + // datalen:12-15
                    String.fromCharCode(0x00) + String.fromCharCode(0x06) +
                    String.fromCharCode(0x01) + String.fromCharCode(0x01) + // data:16-21
                    String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                    String.fromCharCode(0x00) + String.fromCharCode(0x00);  
                    desktop.frameRateDelay = 2;
                    desktop.state = 101;
  
        // Test processState
        var returnvalue1 = serverinit.processState(input);
        expect(returnvalue1).toBe(22);
    });

    it('Test processState: encoding === 16 with compressed ZLib data', (doneCallback) => {  
      // create objects
      var communicator = new Communicator();
      var decoder = new Decoder();
      var desktop = new AmtDesktop();
      var serverinit = new Encoding(communicator, desktop, decoder, (state) => {
        new Promise((result) => {
          expect(state).toBe(4);
          doneCallback();
        })
      });

      // Test input
      var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x:0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y:2-3
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x10) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // datalen:12-15
                  String.fromCharCode(0x00) + String.fromCharCode(0x06) +
                  String.fromCharCode(0x01) + String.fromCharCode(0x01) + // data:16-21
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) + String.fromCharCode(0x00); 
      desktop.frameRateDelay = 2;
      desktop.state = 101;

      // Test processState
      var returnvalue1 = serverinit.processState(input);
      expect(returnvalue1).toBe(22);
  });

  it('Test processState negative test case: encoding === 16 and acc.length < 16', () => {  
    // create objects
    var communicator = new Communicator();
    var decoder = new Decoder();
    var desktop = new AmtDesktop();
    var serverinit = new Encoding(communicator, desktop, decoder, callback);

      // Test input
      var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x:0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y:2-3
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x10) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // datalen:12-15
                  String.fromCharCode(0x00); 

    // Test processState
    var returnvalue1 = serverinit.processState(input);
    expect(returnvalue1).toBe(0);
  });

  it('Test processState negative test case: encoding === 16 and acc.length < (16 + datalen)', () => {  
    // create objects
    var communicator = new Communicator();
    var decoder = new Decoder();
    var desktop = new AmtDesktop();
    var serverinit = new Encoding(communicator, desktop, decoder, callback);

      // Test input
      var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x:0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y:2-3
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                  String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                  String.fromCharCode(0x00) + String.fromCharCode(0x10) + // encoding byte 2-3;
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) + // datalen:12-15
                  String.fromCharCode(0x00) + String.fromCharCode(0x06) +
                  String.fromCharCode(0x01) + String.fromCharCode(0x01) + // data:16-21
                  String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                  String.fromCharCode(0x00); 

    // Test processState
    var returnvalue1 = serverinit.processState(input);
    expect(returnvalue1).toBe(0);
  });

  it('Test processState with negative test case: acc length < 12', () => {  
    // create objects
    var communicator = new Communicator();
    var decoder = new Decoder();
    var desktop = new AmtDesktop();
    var serverinit = new Encoding(communicator, desktop, decoder, callback);

    // Test input
    var input = '00000000000';

    // Test processState
    var returnvalue1 = serverinit.processState(input);
    expect(returnvalue1).toBe(0);
  });

  it('Test processState: encoding === 16 with state = 101 and frameRateDelay = 0', (doneCallback) => {  
    // create objects
    var communicator = new Communicator();
    var decoder = new Decoder();
    var desktop = new AmtDesktop();
    var serverinit = new Encoding(communicator, desktop, decoder, (state) => {
      new Promise((result) => {
        expect(state).toBe(4);
        doneCallback();
      })
    });

    // Test input
    var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x:0-1
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y:2-3
                String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                String.fromCharCode(0x00) + String.fromCharCode(0x10) + // encoding byte 2-3;
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + // datalen:12-15
                String.fromCharCode(0x00) + String.fromCharCode(0x05) +
                String.fromCharCode(0x01) + String.fromCharCode(0x01) + // data:16-21
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00);
                desktop.frameRateDelay = 0;
                desktop.state = 101;

    // Test processState
    var returnvalue1 = serverinit.processState(input);
    expect(returnvalue1).toBe(21);
  });

  it('Test processState: encoding === 16 with state = 101 and frameRateDelay != 0', (doneCallback) => {  
    // create objects
    var communicator = new Communicator();
    var decoder = new Decoder();
    var desktop = new AmtDesktop();
    var serverinit = new Encoding(communicator, desktop, decoder, (state) => {
      new Promise((result) => {
        expect(state).toBe(4);
        doneCallback();
      })
    });

    // Test input
    var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) + //x:0-1
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + // y:2-3
                String.fromCharCode(0x00) + String.fromCharCode(0x02) + // width
                String.fromCharCode(0x00) + String.fromCharCode(0x02) + // height
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + // encoding byte 0-1
                String.fromCharCode(0x00) + String.fromCharCode(0x10) + // encoding byte 2-3;
                String.fromCharCode(0x00) + String.fromCharCode(0x00) + // datalen:12-15
                String.fromCharCode(0x00) + String.fromCharCode(0x06) +
                String.fromCharCode(0x01) + String.fromCharCode(0x01) + // data:16-21
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00);
                desktop.frameRateDelay = 2;
                desktop.state = 101;

    // Test processState
    var returnvalue1 = serverinit.processState(input);
    expect(returnvalue1).toBe(22);
  });

});

// callback function for Unit testing
function callback(state: number) {
}