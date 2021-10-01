// Import all required methods from common.js file
import { ReadInt, ShortToStr, ReadShort, ShortToStrX, ReadShortX, IntToStr, IntToStrX, ReadIntX, MakeToArray, SplitArray, Clone, ArrayElementMove, rstr2hex, hex2rstr, char2hex, encode_utf8, decode_utf8, data2blob, quoteSplit, parseNameValueList, toNumber, escapeHtml, objKeysToLower, validateString, validateInt, validateArray, validateStrArray, validateObject, validateEmail, validateUsername } from '../utils/common'
const v = 256
const p = 0
const s3 = '256'
const ar1 = '256'
const arr = ['256']
const teststr = 'This,is,test'
const tstr = 'test'

// ReadShort method verification- it takes string and pointer as input and return short value
describe('Reading Short', function () {
  test('ReadShort-Should return Short', function () {
    const s = ShortToStr(v)
    expect(ReadShort(s, p)).toBe(v)
  })
})

// ReadShorx method verification- it takes string and pointer as input and return short value
describe('Reading Shortx', function () {
  it('ReadShortx- Should return Short', function () {
    const s = ShortToStrX(v)
    expect(ReadShortX(s, p)).toBe(v)
  })
})

// ReadInt method verification- it takes string and pointer as input and return int value
describe('Reading Int', function () {
  it('ReadInt-Should return int', function () {
    const s = IntToStr(v)
    expect(ReadInt(s, p)).toBe(v)
  })
})

// ReadIntx method verification- it takes string and pointer as input and return int value
describe('Reading intx', function () {
  it('ReadIntx- Should return int', function () {
    const s = IntToStrX(v)
    expect(ReadIntX(s, p)).toBe(v)
  })
})

// Short to string
describe('Short to String', function () {
  it('Short to String-Should return String', function () {
    const s = ShortToStr(v)
    const s1 = ReadShort(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Short to stringX
describe('ShortX to String', function () {
  it('ShortToStrX- should return string', function () {
    const s = ShortToStrX(v)
    const s1 = ReadShortX(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Int to string
describe('Int to String', function () {
  it('IntToStr- should return string', function () {
    const s = IntToStr(v)
    const s1 = ReadInt(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Int to stringx
describe('Intx to String', function () {
  it('IntToStrx- should return string', function () {
    const s = IntToStrX(v)
    const s1 = ReadIntX(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Make to Array
describe('Making to Array', function () {
  it('MakeToArray-should return array', function () {
    expect(MakeToArray(ar1)).toStrictEqual(arr)
  })
})

// Split Array
describe('Split an Array', function () {
  it('SplitArray-should spilt an array', function () {
    const words = SplitArray(teststr)
    expect(words[2]).toBe(tstr)
  })
})

// Clone
describe('Clone string', function () {
  it('Clone-should return JSOn.parse of string', function () {
    const jsontxt = { x: 5, y: 6 }
    expect(Clone(jsontxt)).toStrictEqual(jsontxt)
  })
})



// Check array element moving from one position to other
describe('Validate array move', function () {
  it('ArrayElementMove- should move array element positoon', function () {
    const testarr = ['John', 'Mike', 'Mary']
    const resarr = ['Mike', 'John', 'Mary']
    ArrayElementMove(testarr, 0, 1)
    expect(testarr).toStrictEqual(resarr)
  })
})

// Check converting raw string to hex string
describe('Validate raw to hex string conversion', function () {
  it('rstr2hex-should convert raw string to hex string', function () {
    const inputstr = 'hello'
    const hexstr = '68656C6C6F'
    expect(rstr2hex(inputstr)).toBe(hexstr)
  })
})

// Check converting hex string to raw string
describe('Validate hex to raw string conversion', function () {
  it('hex2rstr-should convert hex string to raw string', function () {
    const inputstr = '68656C6C6F'
    const rawstr = 'hello'
    expect(hex2rstr(inputstr)).toBe(rawstr)
  })
})

// Check converting decimal to hex
describe('Validate decimal to hex conversion', function () {
  it('char2hex-should convert decimal to hex', function () {
    const ival = 220
    const hval = 'DC'
    expect(char2hex(ival)).toBe(hval)
  })
})

// Check utf encoding
describe('Validate utf encoding of given string', function () {
  it('encode_utf8- should do utf8 encoding of given string', function () {
    const sencode = '\x46\x6F\x6F\x20\xC2\xA9\x20\x62\x61\x72\x20\xF0\x9D\x8C\x86\x20\x62\x61\x7A\x20\xE2\x98\x83\x20\x71\x75\x78'
    const s = 'Foo © bar 𝌆 baz ☃ qux'
    expect(encode_utf8(s)).toBe(sencode)
  })
})

// Check utf decoding
describe('Validate utf decoding', function () {
  it('decode_utf8- should do utf8 decoding of given encoded string', function () {
    const s = '\x46\x6F\x6F\x20\xC2\xA9\x20\x62\x61\x72\x20\xF0\x9D\x8C\x86\x20\x62\x61\x7A\x20\xE2\x98\x83\x20\x71\x75\x78'
    const sdecode = 'Foo © bar 𝌆 baz ☃ qux'
    expect(decode_utf8(s)).toBe(sdecode)
  })
})

// Check split comma seperated string
describe('Validate split of comma seperated string', function () {
  it('quoteSplit- should split comma seperated string', function () {
    const s = 'Hello,this,is,test'
    const result = ['Hello', 'this', 'is', 'test']
    expect(quoteSplit(s)).toStrictEqual(result)
  })
})

// Check converting list of "name = value" into object
describe('Validate converting list of "name=value" into object', function () {
  it('parseNameValueList- should convert list of "name=value" into object', function () {
    const list = ['name=john', 'age=36']
    const output = parseNameValueList(list)
    expect(output).toHaveProperty('name', 'john')
    expect(output).toHaveProperty('age', '36')
  })
})

// Check converting to number- x=parsetInt(s), if x is same as s then returns x else returns s.
describe('Validate converting string to number 1', function () {
  it('toNumber-convert string to number', function () {
    const s = '123'
    const output = 123
    const result = toNumber(s)
    expect(result).toBe(output)
  })
})

// Check converting to number- x=parsetInt(s), if x is same as s then returns x else returns s.
describe('Validate converting string to number 2', function () {
  it('toNumber-convert string to number', function () {
    const s = '123'
    const output = '123'
    const result = toNumber(s)
    expect(result).not.toBe(output)
  })
})

// Check converting to number- x=parsetInt(s), if x is same as s then returns x else returns s.
describe('Validate converting string to number 3', function () {
  it('toNumber-convert string to number', function () {
    const s = 'this is test'
    const output = 'this is test'
    const result = toNumber(s)
    expect(result).toBe(output)
  })
})

// Check escape html functionality
describe('Validate string escape html functionality', function () {
  it('escapeHtml-escape html -1', function () {
    const s = 'this is & test'
    const output = 'this is &amp; test'
    const result = escapeHtml(s)
    expect(result).toBe(output)
  })
})

// Check escape html functionality -2
describe('Validate string escape html functionality -2', function () {
  it('escapeHtml-escape html -2', function () {
    const s = "this is <>'`=\/ test"
    const output = 'this is &lt;&gt;&#39;&#x60;&#x3D;&#x2F; test'
    const result = escapeHtml(s)
    expect(result).toBe(output)
  })
})

// Check covertomg to lowercase all the names in an object
describe('Validate converitng all names in objects to lowercase', function () {
  it('objKeysToLower-should convert all object keys to lowercase', function () {
    const inputobj = {
      Name: 'John',
      AGE: 38
    }

    const outputobj = {
      name: 'John',
      age: 38
    }

    expect(objKeysToLower(inputobj)).toStrictEqual(outputobj)
  })
})

// Check covertomg to lowercase all the names in an object recursilvely
describe('Validate converitng all names in objects to lowercase recursively', function () {
  it('objKeysToLower-should convert all object keys to lowercase recursively', function () {
    const inputobj = {
      Name: 'John',
      AGE: 38,
      MOREinfo: {
        Job: 'teacher',
        City: 'Phoenix'
      }
    }

    const outputobj = {
      name: 'John',
      age: 38,
      moreinfo: {
        job: 'teacher',
        city: 'Phoenix'
      }
    }
    const result = objKeysToLower(inputobj)
    expect(result).toStrictEqual(outputobj)
  })
})

// Check Validating string functionality - test 1
describe('Validate string -1 ', function () {
  it('validateString- should check validity of string - test 1', function () {
    const s = 'test'
    const mlen = 2
    const mxlen = 5
    expect(validateString(s, mlen, mxlen)).toBe(true)
  })
})

// Check Validating string functionality - test 2
describe('Validate string -2 ', function () {
  it('validateString- should check validity of string - test 2', function () {
    const s = 'testggggggggggggggggggggggggggggggg7777777777777777777777777************************@#$%^!'
    const mlen = null
    const mxlen = null
    expect(validateString(s, mlen, mxlen)).toBe(true)
  })
})

// Check Validating string functionality - negative test 3
describe('Validate string -3 negative test ', function () {
  it('validateString- should check validity of string - negative test 3', function () {
    const s = 'test'
    const mlen = 2
    const mxlen = 1
    expect(validateString(s, mlen, mxlen)).toBe(false)
  })
})

// Check Validating string functionality - negative test 4
describe('Validate string -4 negative test ', function () {
  it('validateString- should check validity of string - negative test 4', function () {
    const s = null
    const mlen = 2
    const mxlen = 1
    expect(validateString(s, mlen, mxlen)).toBe(false)
  })
})

// Check Validating string functionality - negative test 5
describe('Validate string -5 negative test ', function () {
  it('validateString- should check validity of string - negative test 5', function () {
    const s = 123
    const mlen = 2
    const mxlen = 1
    expect(validateString(s, mlen, mxlen)).toBe(false)
  })
})

// Check validating int functionality - test1
describe('Validate int test -1', function () {
  it('validateInt- should validate whether given value is integer or not', function () {
    const val = 2147483647
    const minlen = -2147483648
    const mxlen = 2147483647
    expect(validateInt(val, minlen, mxlen)).toBe(true)
  })
})

// Check validating int functionality - test2
describe('Validate int test -2', function () {
  it('validateInt- should validate whether given value is integer or not', function () {
    const val = 66666662147483650
    const minlen = -2147483648
    const mxlen = 2147483647
    expect(validateInt(val, minlen, mxlen)).toBe(false)
  })
})

// Check validating int functionality - test3
describe('Validate int test -3', function () {
  it('validateInt- should validate whether given value is integer or not', function () {
    const val = '100'
    const minlen = -2147483648
    const mxlen = 2147483647
    expect(validateInt(val, minlen, mxlen)).toBe(false)
  })
})

// Check validating an array -test 1
describe('Validate array test-1', function () {
  it('validateArray- validate whether given value is an array or not', function () {
    const inputar = [10, 20, 30, 40]
    const minlen = 2
    const maxlen = 5
    expect(validateArray(inputar, minlen, maxlen)).toBe(true)
  })
})

// Check validating an array -test 2
describe('Validate array test-2', function () {
  it('validateArray- validate whether given value is an array or not', function () {
    const inputar = [10, 20, 30, 40]
    const minlen = 2
    const maxlen = 3
    expect(validateArray(inputar, minlen, maxlen)).toBe(false)
  })
})

// Check validating an array -test 3
describe('Validate array test-3', function () {
  it('validateArray- validate whether given value is an array or not', function () {
    const inputar = {
      name: 'John',
      age: 26
    }
    const minlen = 2
    const maxlen = 3
    expect(validateArray(inputar, minlen, maxlen)).toBe(false)
  })
})

// Check validating an array -test 4
describe('Validate array test-4', function () {
  it('validateArray- validate whether given value is an array or not', function () {
    const inputar = []
    const minlen = 2
    const maxlen = 3
    expect(validateArray(inputar, minlen, maxlen)).toBe(false)
  })
})

// Check validating an string array -test 1
describe('Validate string array test-1', function () {
  it('validateStrArray- validate whether given value is a string array or not', function () {
    const inputar = ['Johny', 'Mike', 'abcdefghi']
    const minlen = 2
    const maxlen = 15
    // console.log(validateStrArray(inputar,minlen,maxlen));
    expect(validateStrArray(inputar, minlen, maxlen)).toBe(true)
  })
})

// Check validating an string array -test 2
describe('Validate string array test-2', function () {
  it('validateStrArray- validate whether given value is a string array or not', function () {
    const inputar = ['test', 1]
    const minlen = 0
    const maxlen = 5
    //
    // console.log(validateStrArray(inputar,minlen,maxlen));
    expect(validateStrArray(inputar, minlen, maxlen)).toBe(false)
  })
})

// Check validating an object test-1
describe('Validate object test-1', function () {
  it('validateObject-validate whether given value is object or not', function () {
    const inputobj = {
      name: 'John',
      age: 45
    }

    expect(validateObject(inputobj)).toBe(true)
  })
})

// Check validating an object test-2
describe('Validate object test-2', function () {
  it('validateObject-validate whether given value is object or not', function () {
    const inputobj = 2

    expect(validateObject(inputobj)).toBe(false)
  })
})

// Check validating an object test-3
describe('Validate object test-3', function () {
  it('validateObject-validate whether given value is object or not', function () {
    const inputobj = null

    expect(validateObject(inputobj)).toBe(false)
  })
})

// Check validating an emaill test-1
describe('Validate email test-1', function () {
  it('validateEmail- validate whether given email is valid or not test1', function () {
    const inputemail = 'test@gmail.com'
    const minlen = 0
    const maxlen = 50
    expect(validateEmail(inputemail, minlen, maxlen)).toBe(true)
  })
})

// Check validating an emaill test-2
describe('Validate email test-2', function () {
  it('validateEmail- validate whether given email is valid or not test1', function () {
    const inputemail = 'test@com'
    const minlen = 0
    const maxlen = 50
    expect(validateEmail(inputemail, minlen, maxlen)).toBe(false)
  })
})
