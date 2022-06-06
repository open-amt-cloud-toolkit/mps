/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

// Import all required methods from common.js file
import Common from './common'
const v = 256
const p = 0
const s3 = '256'
const ar1 = '256'
const arr = ['256']

// ReadShort method verification- it takes string and pointer as input and return short value
describe('Reading Short', () => {
  test('ReadShort-Should return Short', () => {
    const s = Common.ShortToStr(v)
    expect(Common.ReadShort(s, p)).toBe(v)
  })
})

// ReadShorx method verification- it takes string and pointer as input and return short value
describe('Reading Shortx', () => {
  it('ReadShortx- Should return Short', () => {
    const s = Common.ShortToStrX(v)
    expect(Common.ReadShortX(s, p)).toBe(v)
  })
})

// ReadInt method verification- it takes string and pointer as input and return int value
describe('Reading Int', () => {
  it('ReadInt-Should return int', () => {
    const s = Common.IntToStr(v)
    expect(Common.ReadInt(s, p)).toBe(v)
  })
})

// ReadIntx method verification- it takes string and pointer as input and return int value
describe('Reading intx', () => {
  it('ReadIntx- Should return int', () => {
    const s = Common.IntToStrX(v)
    expect(Common.ReadIntX(s, p)).toBe(v)
  })
})

// Short to string
describe('Short to String', () => {
  it('Short to String-Should return String', () => {
    const s = Common.ShortToStr(v)
    const s1 = Common.ReadShort(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Short to stringX
describe('ShortX to String', () => {
  it('ShortToStrX- should return string', () => {
    const s = Common.ShortToStrX(v)
    const s1 = Common.ReadShortX(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Int to string
describe('Int to String', () => {
  it('IntToStr- should return string', () => {
    const s = Common.IntToStr(v)
    const s1 = Common.ReadInt(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Int to stringx
describe('Intx to String', () => {
  it('IntToStrx- should return string', () => {
    const s = Common.IntToStrX(v)
    const s1 = Common.ReadIntX(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Make to Array
describe('Making to Array', () => {
  it('MakeToArray-should return array', () => {
    expect(Common.MakeToArray(ar1)).toStrictEqual(arr)
  })
})

// Clone
describe('Clone string', () => {
  it('Clone-should return JSOn.parse of string', () => {
    const jsontxt = { x: 5, y: 6 }
    expect(Common.Clone(jsontxt)).toStrictEqual(jsontxt)
  })
})

// Check converting raw string to hex string
describe('Validate raw to hex string conversion', () => {
  it('rstr2hex-should convert raw string to hex string', () => {
    const inputstr = 'hello'
    const hexstr = '68656C6C6F'
    expect(Common.Rstr2hex(inputstr)).toBe(hexstr)
  })
})

// Check converting hex string to raw string
describe('Validate hex to raw string conversion', () => {
  it('hex2rstr-should convert hex string to raw string', () => {
    const inputstr = '68656C6C6F'
    const rawstr = 'hello'
    expect(Common.Hex2rstr(inputstr)).toBe(rawstr)
  })
})

// Check converting decimal to hex
describe('Validate decimal to hex conversion', () => {
  it('char2hex-should convert decimal to hex', () => {
    const ival = 220
    const hval = 'DC'
    expect(Common.Char2hex(ival)).toBe(hval)
  })
})

// Check converting a byte array of SID into string
describe('Validate SID byte array to string conversion', () => {
  it('GetSidString-should convert SID byte array as a string to a SID string', () => {
    const networkServiceSidByteArrayAsHex = '010100000000000514000000'
    const myHex = Buffer.from(networkServiceSidByteArrayAsHex, 'hex').toString()
    const networkServiceSid = 'S-1-5-20'
    const sidString = Common.GetSidString(myHex)
    expect(sidString).toBe(networkServiceSid)
  })
})
