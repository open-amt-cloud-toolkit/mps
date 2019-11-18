/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { TypeConverter } from "../core/converter";

describe("Test ReadShort function: ", () => {

    // Test Input "1928"
    var input = String.fromCharCode(0x00) + String.fromCharCode(0x13) +
               String.fromCharCode(0x00) + String.fromCharCode(0x1C);

    it('Test if ReadShort works for positive test case: first two nibbles', () => {   
        var value = TypeConverter.ReadShort(input, 0);
        expect(value).toBe(19);
    });

    it('Test if ReadShort works for positive test case: third-fourth nibble', () => {   
        var value = TypeConverter.ReadShort(input, 2);
        expect(value).toBe(28);
    });
});

describe("Test ReadShortX function: ", () => {

    // Test Input "9876"
    var input = String.fromCharCode(0x62) + String.fromCharCode(0x00) +
                String.fromCharCode(0x4C) + String.fromCharCode(0x00);

    it('Test if ReadShortX works for positive test case: first two nibbles', () => {   
        var value = TypeConverter.ReadShortX(input, 0);
        expect(value).toBe(98);
    });

    it('Test if ReadShortX works for positive test case: third-fourth nibble', () => {   
        var value = TypeConverter.ReadShortX(input, 2);
        expect(value).toBe(76);
    });
});

describe("Test ReadInt function: ", () => {

    // Test Input "98765432"
    var input = String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x26) + String.fromCharCode(0x94) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x15) + String.fromCharCode(0x38);

    it('Test if ReadInt works for positive test case: position 0th-3rd bytes', () => {   
        var value = TypeConverter.ReadInt(input, 0);
        expect(value).toBe(9876);
    });

    it('Test if ReadInt works for positive test case: position 4th-7th bytes', () => {
        var value = TypeConverter.ReadInt(input, 4);
        expect(value).toBe(5432);
    });
});

describe("Test ReadSInt function: ", () => {

    // Test Input "-98765432"
    var input = String.fromCharCode(0xFF) + String.fromCharCode(0xFF) +
                String.fromCharCode(0xD9) + String.fromCharCode(0x6C) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x15) + String.fromCharCode(0x38);
 
    it('Test if ReadSInt works for positive test case: position 0th-3rd bytes', () => {   
        var value = TypeConverter.ReadSInt(input, 0);
        expect(value).toBe(-9876);
    });

    it('Test if ReadSInt works for positive test case: position 4th-7th bytes', () => {   
        var value = TypeConverter.ReadSInt(input, 4);
        expect(value).toBe(5432);
    });
});

describe("Test ReadIntX function: ", () => {

    // Test Input "98765432"
    var input = String.fromCharCode(0x94) + String.fromCharCode(0x26) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00) +
                String.fromCharCode(0x38) + String.fromCharCode(0x15) +
                String.fromCharCode(0x00) + String.fromCharCode(0x00);

    it('Test if ReadIntX works for positive test case: position 0th-3rd bytes', () => {   
        var value = TypeConverter.ReadIntX(input, 0);
        expect(value).toBe(9876);
    });

    it('Test if ReadIntX works for positive test case: position 4th-7th bytes', () => {
        var value = TypeConverter.ReadIntX(input, 4);
        expect(value).toBe(5432);
    });
});

describe("Test ShortToStr function: ", () => {

    // Test Input 43
    var input = 0X3433;

    it('Test if ShortToStr works for positive test case', () => {   
        var value = TypeConverter.ShortToStr(input);
        expect(value).toBe('43');
    });
});

describe("Test ShortToStrX function: ", () => {

    // Test Input 34
    var input = 0X3433;

    it('Test if ShortToStrX works for positive test case', () => {   
        var value = TypeConverter.ShortToStrX(input);
        expect(value).toBe('34');
    });
});

describe("Test IntToStr function: ", () => {

    // Test Input 9876
    var input = 0X39383736;

    it('Test if IntToStr works for positive test case', () => {   
        var value = TypeConverter.IntToStr(input);
        expect(value).toBe('9876');
    });
});

describe("Test IntToStrX function: ", () => {

    // Test Input 4321
    var input = 0X31323334;

    it('Test if IntToStrX works for positive test case', () => {   
        var value = TypeConverter.IntToStrX(input);
        expect(value).toBe('4321');
    });
});

describe("Test MakeToArray function: ", () => {

    // Test Input 2
    var input = 2;

    it('Test if MakeToArray works for positive test case', () => {   
        var value = TypeConverter.MakeToArray(input);
        expect(value).toEqual(expect.arrayContaining([2]));
    });
});

describe("Test SplitArray function: ", () => {

    // Test Input "123"
    var input = '123';

    it('Test if SplitArray works for positive test case', () => {   
        var value = TypeConverter.SplitArray(input);
        expect(value).toEqual(expect.arrayContaining(['123']));
    });
});

describe("Test Clone function: ", () => {

    // Test Input "123"
    var input = '123456';

    it('Test if Clone works for positive test case', () => {   
        var value = TypeConverter.Clone(input);
        expect(value).toBe('123456');
    });
});

describe("Test EscapeHtml function: ", () => {

    // Test Input number:765
    var input1 = 765;

    it('Test if EscapeHtml works for positive test case: number', () => {   
        var value = TypeConverter.EscapeHtml(input1);
        expect(value).toBe(765);
    });

    // Test Input boolean:true
    var input2 = true;

    it('Test if EscapeHtml works for positive test case: boolean', () => {   
        var value = TypeConverter.EscapeHtml(input2);
        expect(value).toBe(true);
    });

    // Test Input string:'a">b&c<def'g'
    var input3 = 'a\"\>b\&c\<def\'g';

    it('Test if EscapeHtml works for positive test case: string', () => {   
        var value = TypeConverter.EscapeHtml(input3);
        expect(value).toBe('a&quot;&gt;b&amp;c&lt;def&apos;g');
    });
});

describe("Test ArrayElementMove function: ", () => {

    // Test Input [1, 2, 3, 4, 5, 6, 7, 8]
    var input = [1, 2, 3, 4, 5, 6, 7, 8];
    // Expected Output with movement of element from 
    // position 2 to 5 is [1, 2, 4, 5, 6, 3, 7, 8]
    var output = [1, 2, 4, 5, 6, 3, 7, 8];

    it('Test if ArrayElementMove works for positive test case', () => {   
        TypeConverter.ArrayElementMove(input, 2, 5);
        expect(input).toEqual(expect.arrayContaining(output));
    });
});

describe("Test ObjectToStringEx function: ", () => {

    // Test Input number:[10, 20, 30]
    var input = [10, 20, 30];
    // 4 non-breaking space
    var space = 1;
    var output = '<br />&nbsp;&nbsp;&nbsp;&nbsp;Item #0: 10'+
                 '<br />&nbsp;&nbsp;&nbsp;&nbsp;Item #1: 20'+
                 '<br />&nbsp;&nbsp;&nbsp;&nbsp;Item #2: 30';

    it('Test if ObjectToStringEx works for positive test case: array', () => {   
        var value = TypeConverter.ObjectToStringEx(input, space);
        expect(value).toBe(output);
    });

    // class for testing
    class Test{
        test1: number
        test2: string
        test3: number
    }
    // Test Input Object
    var input2 = new Test;
    input2.test1 = 22;
    input2.test2 = 'Test';
    input2.test3 = 33;
    var output2 = '<br />&nbsp;&nbsp;&nbsp;&nbsp;test1 = 22'+
                  '<br />&nbsp;&nbsp;&nbsp;&nbsp;test2 = Test'+
                  '<br />&nbsp;&nbsp;&nbsp;&nbsp;test3 = 33';

    it('Test if ObjectToStringEx works for positive test case: Object', () => {   
        var value = TypeConverter.ObjectToStringEx(input2, space);
        expect(value).toBe(output2);
    });
});

describe("Test ObjectToStringEx2 function: ", () => {

    // Test Input number:[10, 20, 30]
    var input = [10, 20, 30];
    // 4 non-breaking space
    var space = 1;
    var output = '\r\n    Item #0: 10'+
                 '\r\n    Item #1: 20'+
                 '\r\n    Item #2: 30';

    it('Test if ObjectToStringEx2 works for positive test case: array', () => {   
        var value = TypeConverter.ObjectToStringEx2(input, space);
        expect(value).toBe(output);
    });

    // class for testing
    class Test{
        test1: number
        test2: string
        test3: number
    }
    // Test Input Object
    var input2 = new Test;
    input2.test1 = 22;
    input2.test2 = 'Test';
    input2.test3 = 33;
    var output2 = '\r\n    test1 = 22'+
                  '\r\n    test2 = Test'+
                  '\r\n    test3 = 33';

    it('Test if ObjectToStringEx2 works for positive test case: Object', () => {   
        var value = TypeConverter.ObjectToStringEx2(input2, space);
        expect(value).toBe(output2);
    });
});

describe("Test gap function: ", () => {

    // Test Input number:2
    var input = 2;

    it('Test if gap works for positive test case', () => {   
        var value = TypeConverter.gap(input);
        expect(value).toBe('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    });
});

describe("Test gap2 function: ", () => {

    // Test Input number:3
    var input = 3;

    it('Test if gap2 works for positive test case', () => {   
        var value = TypeConverter.gap2(input);
        expect(value).toBe('            ');
    });
});

describe("Test ObjectToString function: ", () => {

    class Test{
        test1:number
        test2:boolean
        test3:string
    }
    // Test Input number:Object
    var input = new Test;
    input.test1 = 25;
    input.test2 = true;
    input.test3 = 'TEST'
    // Test Output
    var output = '<br />test1 = 25'+
                 '<br />test2 = true'+
                 '<br />test3 = TEST';

    it('Test if ObjectToString works for positive test case', () => {   
        var value = TypeConverter.ObjectToString(input);
        expect(value).toBe(output);
    });
});

describe("Test ObjectToString2 function: ", () => {

    class Test{
        test1:number
        test2:boolean
        test3:string
    }
    // Test Input number:Object
    var input = new Test;
    input.test1 = 35;
    input.test2 = false;
    input.test3 = 'TEST'
    // Test Output
    var output = '\r\ntest1 = 35'+
                 '\r\ntest2 = false'+
                 '\r\ntest3 = TEST';

    it('Test if ObjectToString2 works for positive test case', () => {   
        var value = TypeConverter.ObjectToString2(input);
        expect(value).toBe(output);
    });
});

describe("Test hex2rstr function: ", () => {

    // Test Input number:56
    var input = '3536';

    it('Test if hex2rstr works for positive test case', () => {   
        var value = TypeConverter.hex2rstr(input);
        expect(value).toBe('56');
    });
});

describe("Test char2hex function: ", () => {

    // Test Input number:75
    var input = 75;

    it('Test if char2hex works for positive test case', () => {   
        var value = TypeConverter.char2hex(input);
        expect(value).toBe('4B');
    });
});

describe("Test rstr2hex function: ", () => {

    // Test Input number:89
    var input = '89';

    it('Test if rstr2hex works for positive test case', () => {   
        var value = TypeConverter.rstr2hex(input);
        expect(value).toBe('3839');
    });
});

describe("Test encode_utf8 function: ", () => {

    // Test Input number:URL
    var input = "https://TEST.com/";
    // encode_utf8 function calls encodeURIComponent and then
    //  call unescape; input should be same as output
    var output = "https://TEST.com/";

    it('Test if encode_utf8 works for positive test case', () => {   
        var value = TypeConverter.encode_utf8(input);
        expect(value).toBe(output);
    });
});

describe("Test decode_utf8 function: ", () => {

    var input = 'https%3A%2F%2FTEST.com%2F';
    // decode_utf8 function calls escape and then
    //  call decodeURIComponent; input should be same as output
    var output = 'https%3A%2F%2FTEST.com%2F';

    it('Test if decode_utf8 works for positive test case', () => {   
        var value = TypeConverter.decode_utf8(input);
        expect(value).toBe(output);
    });
});

describe("Test random function: ", () => {

    var max = 10000;

    it('Test if random works for positive test case', () => {
        // Call random() multiple times and 
        // verify that they are not same value
        var value1 = TypeConverter.random(max);
        var value2 = TypeConverter.random(max);
        var value3 = TypeConverter.random(max);
        expect(value1).not.toEqual(value2);
        expect(value1).not.toEqual(value3);
        expect(value3).not.toEqual(value2);
    });
});

describe("Test trademarks function: ", () => {

    var input = 'AB/\(TM\)/CD/\(R\)/EF';
    var output = 'AB/&trade;/CD/&reg;/EF';

    it('Test if trademarks works for positive test case', () => {   
        var value = TypeConverter.trademarks(input);
        expect(value).toBe(output);
    });
});
