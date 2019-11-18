/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { AMTKeyCodeConverter } from "../core/Utilities/AMTKeyCodeConverter";

// classes defined for Unit testing
import { TestEvent } from "./helper/testEvent"

describe("Test convertAMTKeyCode function in AMTKeyCodeConverter", () => {

    it('Test convertAMTKeyCode: startsWith Key, length == 4 and shiftKey is false', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Key' + String.fromCharCode(0x05);
        input.shiftKey = false;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);
        expect(returnvalue).toBe(37);
    });

    it('Test convertAMTKeyCode: startsWith Key, length == 4 and shiftKey is true', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Key' + String.fromCharCode(0x08);
        input.shiftKey = true;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);
        expect(returnvalue).toBe(8);
    });

    it('Test convertAMTKeyCode: startsWith Digit and length == 6', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Digit' + String.fromCharCode(0x04);
        input.shiftKey = false;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);
        expect(returnvalue).toBe(4);
    });

    it('Test convertAMTKeyCode: startsWith Numpad and length == 7', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Numpad' + String.fromCharCode(0x08);
        input.shiftKey = true;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);
        expect(returnvalue).toBe(8);
    });

    it('Test convertAMTKeyCode negative test case: startsWith Key and length === 3 ', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Key';
        input.shiftKey = true;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);    
        expect(returnvalue).toBe(undefined);
    });
    it('Test convertAMTKeyCode negative test case: startsWith Digit and length < 5', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Digit';
        input.shiftKey = true;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);    
        expect(returnvalue).toBe(undefined);
    });

    it('Test convertAMTKeyCode negative test case: startsWith Numpad and length === 6', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Numpad';
        input.shiftKey = true;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);    
        expect(returnvalue).toBe(undefined);
    });

    it('Test convertAMTKeyCode negative test case: startsWith Comma', () => {

        // Input
        var input = new TestEvent();
        input.code = 'Comma';
        input.shiftKey = true;

        // Test convertAMTKeyCode
        var returnvalue = AMTKeyCodeConverter.convertAMTKeyCode(input);    
        expect(returnvalue).toBe(44);
    });
});