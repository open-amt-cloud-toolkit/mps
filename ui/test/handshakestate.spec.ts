/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { HandshakeState } from "../core/RFBStateProcessors/HandshakeState";

// classes defined for Unit testing
import { Communicator } from './helper/testcommunicator';

describe("Test processState function in HandshakeState", () => {

    it('Test processState: string size === 12', (doneCallback) => {
        // create object
        var communicator = new Communicator()
        var handshakestate = new HandshakeState(communicator, (state) => {
          new Promise((result) => {
            expect(state).toBe(1);
            doneCallback();
          })
        });

        // Test processState
        var returnvalue1 = handshakestate.processState('RFB 003.008\n');
        expect(returnvalue1).toBe(12);
    });

    it('Test processState: string size > 12', (doneCallback) => {
        // create object
        var communicator = new Communicator()
        var handshakestate = new HandshakeState(communicator, (state) => {
          new Promise((result) => {
            expect(state).toBe(1);
            doneCallback();
          })
        });

        // Test processState
        var returnvalue2 = handshakestate.processState('RRFB 003.008\n');
        expect(returnvalue2).toBe(12);
    });

    it('Test processState: string size  < 12 (negative test case)', () => {
        // create object
        var communicator = new Communicator()
        var handshakestate = new HandshakeState(communicator, callback );
        
        // Test processState
        var returnvalue3 = handshakestate.processState('RFB ');
        expect(returnvalue3).toBe(0);
    });
});

// callback function for Unit testing
function callback(state: number) {
}