/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { SecurityOptions } from "../core/RFBStateProcessors/SecurityOptions";

// classes defined for Unit testing
import { Communicator } from './helper/testcommunicator';

describe("Test processState function in SecurityOptions", () => {

    it('Test processState: acc string size === 1', (doneCallback) => {
        // create object
        var communicator = new Communicator()
        var securityoptions = new SecurityOptions(communicator, (state) => {
          new Promise((result) => {
            expect(state).toBe(2);
            doneCallback();
          })
        });

        // Test processState
        var returnvalue1 = securityoptions.processState(String.fromCharCode(0x03));
        expect(returnvalue1).toBe(4);
    });

    it('Test processState: acc string size > 1', (doneCallback) => {
        // create object
        var communicator = new Communicator()
        var securityoptions = new SecurityOptions(communicator, (state) => {
          new Promise((result) => {
            expect(state).toBe(2);
            doneCallback();
          })
        });

        // Test processState
        var returnvalue2 = securityoptions.processState(String.fromCharCode(0x05) + String.fromCharCode(0x07));
        expect(returnvalue2).toBe(6);
    });

    it('Test processState: acc string size  < 1 (negative test case)', () => {
        // create object
        var communicator = new Communicator()
        var securityoptions = new SecurityOptions(communicator, callback );
        
        // Test processState
        var returnvalue3 = securityoptions.processState('');
        expect(returnvalue3).toBe(0);
    });
});

// callback function for Unit testing
function callback(state: number) {
}