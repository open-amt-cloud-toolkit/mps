//Import all required methods from common.js file    
import {ReadInt, ShortToStr, ReadShort,ShortToStrX,ReadShortX, IntToStr, IntToStrX, ReadIntX, MakeToArray,SplitArray,Clone,IsFilenameValid,ArrayElementMove,rstr2hex,hex2rstr,char2hex,encode_utf8,decode_utf8,data2blob,quoteSplit,parseNameValueList,toNumber,escapeHtml,objKeysToLower,validateString,validateInt,validateArray,validateStrArray,validateObject,validateEmail,validateUsername} from '../src/utils/common'
var v=256;
var p=0;
var s3="256";
var ar1='256';
var arr=['256'];
var teststr='This,is,test';
var tstr='test';



//ReadShort method verification- it takes string and pointer as input and return short value
describe('Reading Short',function(){
   test('ReadShort-Should return Short',function(){
       var s=ShortToStr(v);
       expect(ReadShort(s,p)).toBe(v);
    });
});


//ReadShorx method verification- it takes string and pointer as input and return short value
describe('Reading Shortx',function(){
    it('ReadShortx- Should return Short',function(){
        var s=ShortToStrX(v);
        expect(ReadShortX(s,p)).toBe(v);
     });
 });

 //ReadInt method verification- it takes string and pointer as input and return int value
describe('Reading Int',function(){
    it('ReadInt-Should return int',function(){
        var s=IntToStr(v);
        expect(ReadInt(s,p)).toBe(v);
     });
 });

 //ReadIntx method verification- it takes string and pointer as input and return int value
describe('Reading intx',function(){
    it('ReadIntx- Should return int',function(){
        var s=IntToStrX(v);
        expect(ReadIntX(s,p)).toBe(v);
     });
 });

 //Short to string
 describe('Short to String',function(){
    it('Short to String-Should return String',function(){
        
        var s=ShortToStr(v);
        var s1=ReadShort(s,p);
        var str2=s1.toString();
        expect(str2).toBe(s3);
     });
 });
 

 
 //Short to stringX
 describe('ShortX to String',function(){
    it('ShortToStrX- should return string',function(){
        var s=ShortToStrX(v);
        var s1=ReadShortX(s,p);
        var str2=s1.toString();
        expect(str2).toBe(s3);
    })
});


//Int to string
describe('Int to String',function(){
    it('IntToStr- should return string',function(){
        var s=IntToStr(v);
        var s1=ReadInt(s,p);
        var str2=s1.toString();
        expect(str2).toBe(s3);
    })
});

//Int to stringx
describe('Intx to String',function(){
    it('IntToStrx- should return string',function(){
        var s=IntToStrX(v);
        var s1=ReadIntX(s,p);
        var str2=s1.toString();
        expect(str2).toBe(s3);
    })
});

//Make to Array
describe('Making to Array',function(){
    it('MakeToArray-should return array',function(){
        expect(MakeToArray(ar1)).toStrictEqual(arr);
    })
});

//Split Array
describe('Split an Array',function(){
    it('SplitArray-should spilt an array',function(){
        var words=SplitArray(teststr);
        expect(words[2]).toBe(tstr);
    })
});

//Clone
describe('Clone string',function(){
    it('Clone-should return JSOn.parse of string',function(){
        var jsontxt={ x: 5, y: 6 };
        expect(Clone(jsontxt)).toStrictEqual(jsontxt);
    })
});

//Check filename validity
describe('Validate file name 1',function(){
    it('IsFilenameValid- should validate file name',function(){
        var fname='test1';
        expect(IsFilenameValid(fname)).toBe(true);
    })
});

//Check filename validity- negative test
describe('Validate file name 2',function(){
    it('IsFilenameValid- should validate file name',function(){
        var fname='test1/^tt';
        expect(IsFilenameValid(fname)).toBe(false);
    })
});

//Check filename validity- negative test
describe('Validate file name 3',function(){
    it('IsFilenameValid- should validate file name',function(){
        var fname='.test1';
        expect(IsFilenameValid(fname)).toBe(false);
    })
});


//Check filename validity- negative test
describe('Validate file name 4',function(){
    it('IsFilenameValid- should validate file name',function(){
        var fname='test/1';
        expect(IsFilenameValid(fname)).toBe(false);
    })
});

//Check filename validity- negative test
describe('Validate file name 5',function(){
    it('IsFilenameValid- should validate file name',function(){
        var fname='asgertereretterereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee8888+$$$$$$$$$$$$/';
        expect(IsFilenameValid(fname)).toBe(false);
    })
});

//Check array element moving from one position to other
describe('Validate array move',function(){
    it('ArrayElementMove- should move array element positoon',function(){
        var testarr=['John','Mike','Mary'];
        var resarr=['Mike','John','Mary'];
        ArrayElementMove(testarr,0,1);
        expect(testarr).toStrictEqual(resarr);
    })
});

//Check converting raw string to hex string
describe('Validate raw to hex string conversion',function(){
    it('rstr2hex-should convert raw string to hex string',function(){
        var inputstr='hello';
        var hexstr='68656C6C6F';
        expect(rstr2hex(inputstr)).toBe(hexstr);
    })
});

//Check converting hex string to raw string
describe('Validate hex to raw string conversion',function(){
    it('hex2rstr-should convert hex string to raw string',function(){
        var inputstr='68656C6C6F';
        var rawstr='hello';
        expect(hex2rstr(inputstr)).toBe(rawstr);
    })
});

//Check converting decimal to hex
describe('Validate decimal to hex conversion',function(){
    it('char2hex-should convert decimal to hex',function(){
        var ival=220;
        var hval='DC';
        expect(char2hex(ival)).toBe(hval);
    })
});


//Check utf encoding
describe('Validate utf encoding of given string',function(){
    it('encode_utf8- should do utf8 encoding of given string',function(){
        var sencode='\x46\x6F\x6F\x20\xC2\xA9\x20\x62\x61\x72\x20\xF0\x9D\x8C\x86\x20\x62\x61\x7A\x20\xE2\x98\x83\x20\x71\x75\x78';
        var s='Foo © bar 𝌆 baz ☃ qux';
        expect(encode_utf8(s)).toBe(sencode);
        
    })
});

//Check utf decoding
describe('Validate utf decoding',function(){
    it('decode_utf8- should do utf8 decoding of given encoded string',function(){
        var s='\x46\x6F\x6F\x20\xC2\xA9\x20\x62\x61\x72\x20\xF0\x9D\x8C\x86\x20\x62\x61\x7A\x20\xE2\x98\x83\x20\x71\x75\x78';
        var sdecode='Foo © bar 𝌆 baz ☃ qux';
        expect(decode_utf8(s)).toBe(sdecode);
        
    })
});


//Check split comma seperated string
describe('Validate split of comma seperated string',function(){
    it('quoteSplit- should split comma seperated string',function(){
        var s='Hello,this,is,test';
        var result=['Hello','this','is','test'];
        expect(quoteSplit(s)).toStrictEqual(result);
    })
});

// Check converting list of "name = value" into object
describe('Validate converting list of "name=value" into object',function(){
    it('parseNameValueList- should convert list of "name=value" into object',function(){
        var list=["name=john","age=36"];
        var output=parseNameValueList(list);
        expect(output).toHaveProperty('name','john');
        expect(output).toHaveProperty('age','36');
    })
});

//Check converting to number- x=parsetInt(s), if x is same as s then returns x else returns s.
describe('Validate converting string to number 1',function(){
    it('toNumber-convert string to number',function(){
        var s="123";
        var output=123;
        var result=toNumber(s);
        expect(result).toBe(output);
    })
});

//Check converting to number- x=parsetInt(s), if x is same as s then returns x else returns s.
describe('Validate converting string to number 2',function(){
    it('toNumber-convert string to number',function(){
        var s="123";
        var output="123";
        var result=toNumber(s);
        expect(result).not.toBe(output);
    })
});

//Check converting to number- x=parsetInt(s), if x is same as s then returns x else returns s.
describe('Validate converting string to number 3',function(){
    it('toNumber-convert string to number',function(){
        var s="this is test";
        var output="this is test";
        var result=toNumber(s);
        expect(result).toBe(output);
    })
});

//Check escape html functionality
describe('Validate string escape html functionality',function(){
    it('escapeHtml-escape html -1',function(){
        var s="this is & test";
        var output='this is &amp; test';
        var result=escapeHtml(s);
        expect(result).toBe(output);
    })
});

//Check escape html functionality -2
describe('Validate string escape html functionality -2',function(){
    it('escapeHtml-escape html -2',function(){
        var s="this is <>'`=\/ test";
        var output='this is &lt;&gt;&#39;&#x60;&#x3D;&#x2F; test';
        var result=escapeHtml(s);
        expect(result).toBe(output);
    })
});

//Check covertomg to lowercase all the names in an object
describe('Validate converitng all names in objects to lowercase',function(){
    it('objKeysToLower-should convert all object keys to lowercase',function(){
        var inputobj={
            Name:'John', 
            AGE:38
        };

        var outputobj={
            name:'John', 
            age:38
        };
        
        expect(objKeysToLower(inputobj)).toStrictEqual(outputobj);
    })
});

//Check covertomg to lowercase all the names in an object recursilvely
describe('Validate converitng all names in objects to lowercase recursively',function(){
    it('objKeysToLower-should convert all object keys to lowercase recursively',function(){
    var inputobj={
            Name:'John', 
            AGE:38,
            MOREinfo:{
                Job: 'teacher',
                City:'Phoenix'
            }
        };

        let outputobj={
            name:'John', 
            age:38,
            moreinfo:{
                job: 'teacher',
                city:'Phoenix'
            }
        };
        var result=objKeysToLower(inputobj);
        expect(result).toStrictEqual(outputobj);
    })
});

//Check Validating string functionality - test 1
describe('Validate string -1 ',function(){
    it('validateString- should check validity of string - test 1',function(){
        var s='test';
        var mlen=2;
        var mxlen=5;
        expect(validateString(s,mlen,mxlen)).toBe(true);
    } )
});

//Check Validating string functionality - test 2
describe('Validate string -2 ',function(){
    it('validateString- should check validity of string - test 2',function(){
        var s='testggggggggggggggggggggggggggggggg7777777777777777777777777************************@#$%^!';
        var mlen=null;
        var mxlen=null;
        expect(validateString(s,mlen,mxlen)).toBe(true);
    } )
});

//Check Validating string functionality - negative test 3
describe('Validate string -3 negative test ',function(){
    it('validateString- should check validity of string - negative test 3',function(){
        var s='test';
        var mlen=2;
        var mxlen=1;
        expect(validateString(s,mlen,mxlen)).toBe(false);
    } )
});

//Check Validating string functionality - negative test 4
describe('Validate string -4 negative test ',function(){
    it('validateString- should check validity of string - negative test 4',function(){
        var s=null;
        var mlen=2;
        var mxlen=1;
        expect(validateString(s,mlen,mxlen)).toBe(false);
    } )
});

//Check Validating string functionality - negative test 5
describe('Validate string -5 negative test ',function(){
    it('validateString- should check validity of string - negative test 5',function(){
        var s=123;
        var mlen=2;
        var mxlen=1;
        expect(validateString(s,mlen,mxlen)).toBe(false);
    } )
});

//Check validating int functionality - test1
describe('Validate int test -1',function(){
    it('validateInt- should validate whether given value is integer or not',function(){
        var val=2147483647;
        var minlen=-2147483648;
        var mxlen= 2147483647;
        expect(validateInt(val,minlen,mxlen)).toBe(true);
    })
});

//Check validating int functionality - test2
describe('Validate int test -2',function(){
    it('validateInt- should validate whether given value is integer or not',function(){
        var val=66666662147483650;
        var minlen=-2147483648;
        var mxlen= 2147483647;
        expect(validateInt(val,minlen,mxlen)).toBe(false);
    })
});


//Check validating int functionality - test3
describe('Validate int test -3',function(){
    it('validateInt- should validate whether given value is integer or not',function(){
        var val='100';
        var minlen=-2147483648;
        var mxlen= 2147483647;
        expect(validateInt(val,minlen,mxlen)).toBe(false);
    })
});

//Check validating an array -test 1
describe('Validate array test-1',function(){
    it('validateArray- validate whether given value is an array or not',function(){
        var inputar=[10,20,30,40];
        var minlen=2;
        var maxlen=5;
        expect(validateArray(inputar,minlen,maxlen)).toBe(true);
    })
});

//Check validating an array -test 2
describe('Validate array test-2',function(){
    it('validateArray- validate whether given value is an array or not',function(){
        var inputar=[10,20,30,40];
        var minlen=2;
        var maxlen=3;
        expect(validateArray(inputar,minlen,maxlen)).toBe(false);
    })
});

//Check validating an array -test 3
describe('Validate array test-3',function(){
    it('validateArray- validate whether given value is an array or not',function(){
        var inputar={
            name:'John',
            age:26
        }
        var minlen=2;
        var maxlen=3;
        expect(validateArray(inputar,minlen,maxlen)).toBe(false);
    })
});


//Check validating an array -test 4
describe('Validate array test-4',function(){
    it('validateArray- validate whether given value is an array or not',function(){
        var inputar=[];
        var minlen=2;
        var maxlen=3;
        expect(validateArray(inputar,minlen,maxlen)).toBe(false);
    })
});

//Check validating an string array -test 1
describe('Validate string array test-1',function(){
    it('validateStrArray- validate whether given value is a string array or not',function(){
        var inputar=['Johny','Mike','abcdefghi'];
        var minlen=2;
        var maxlen=15;
        //console.log(validateStrArray(inputar,minlen,maxlen));
        expect(validateStrArray(inputar,minlen,maxlen)).toBe(true);
    })
});

//Check validating an string array -test 2
describe('Validate string array test-2',function(){
    it('validateStrArray- validate whether given value is a string array or not',function(){
        var inputar=['test',1];
        var minlen=0;
        var maxlen=5;
       //
       //console.log(validateStrArray(inputar,minlen,maxlen));
       expect(validateStrArray(inputar,minlen,maxlen)).toBe(false);
    })
});

//Check validating an object test-1
describe('Validate object test-1',function(){
    it('validateObject-validate whether given value is object or not',function(){
        var inputobj={
            name:'John',
            age:45
        }

        expect(validateObject(inputobj)).toBe(true);
    })
});

//Check validating an object test-2
describe('Validate object test-2',function(){
    it('validateObject-validate whether given value is object or not',function(){
        var inputobj=2;

        expect(validateObject(inputobj)).toBe(false);
    })
});

//Check validating an object test-3
describe('Validate object test-3',function(){
    it('validateObject-validate whether given value is object or not',function(){
        var inputobj=null;

        expect(validateObject(inputobj)).toBe(false);
    })
});

//Check validating an emaill test-1
describe('Validate email test-1',function(){
    it('validateEmail- validate whether given email is valid or not test1',function(){
        var inputemail='test@gmail.com';
        var minlen=0;
        var maxlen=50;
        expect(validateEmail(inputemail,minlen,maxlen)).toBe(true);
    })
});


//Check validating an emaill test-2
describe('Validate email test-2',function(){
    it('validateEmail- validate whether given email is valid or not test1',function(){
        var inputemail='test@com';
        var minlen=0;
        var maxlen=50;
        expect(validateEmail(inputemail,minlen,maxlen)).toBe(false);
    })
})










