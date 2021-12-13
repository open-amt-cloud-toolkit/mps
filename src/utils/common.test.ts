// Import all required methods from common.js file
import Common from './common'
const v = 256
const p = 0
const s3 = '256'
const ar1 = '256'
const arr = ['256']

// ReadShort method verification- it takes string and pointer as input and return short value
describe('Reading Short', function () {
  test('ReadShort-Should return Short', function () {
    const s = Common.ShortToStr(v)
    expect(Common.ReadShort(s, p)).toBe(v)
  })
})

// ReadShorx method verification- it takes string and pointer as input and return short value
describe('Reading Shortx', function () {
  it('ReadShortx- Should return Short', function () {
    const s = Common.ShortToStrX(v)
    expect(Common.ReadShortX(s, p)).toBe(v)
  })
})

// ReadInt method verification- it takes string and pointer as input and return int value
describe('Reading Int', function () {
  it('ReadInt-Should return int', function () {
    const s = Common.IntToStr(v)
    expect(Common.ReadInt(s, p)).toBe(v)
  })
})

// ReadIntx method verification- it takes string and pointer as input and return int value
describe('Reading intx', function () {
  it('ReadIntx- Should return int', function () {
    const s = Common.IntToStrX(v)
    expect(Common.ReadIntX(s, p)).toBe(v)
  })
})

// Short to string
describe('Short to String', function () {
  it('Short to String-Should return String', function () {
    const s = Common.ShortToStr(v)
    const s1 = Common.ReadShort(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Short to stringX
describe('ShortX to String', function () {
  it('ShortToStrX- should return string', function () {
    const s = Common.ShortToStrX(v)
    const s1 = Common.ReadShortX(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Int to string
describe('Int to String', function () {
  it('IntToStr- should return string', function () {
    const s = Common.IntToStr(v)
    const s1 = Common.ReadInt(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Int to stringx
describe('Intx to String', function () {
  it('IntToStrx- should return string', function () {
    const s = Common.IntToStrX(v)
    const s1 = Common.ReadIntX(s, p)
    const str2 = s1.toString()
    expect(str2).toBe(s3)
  })
})

// Make to Array
describe('Making to Array', function () {
  it('MakeToArray-should return array', function () {
    expect(Common.MakeToArray(ar1)).toStrictEqual(arr)
  })
})

// Clone
describe('Clone string', function () {
  it('Clone-should return JSOn.parse of string', function () {
    const jsontxt = { x: 5, y: 6 }
    expect(Common.Clone(jsontxt)).toStrictEqual(jsontxt)
  })
})

// Check converting raw string to hex string
describe('Validate raw to hex string conversion', function () {
  it('rstr2hex-should convert raw string to hex string', function () {
    const inputstr = 'hello'
    const hexstr = '68656C6C6F'
    expect(Common.Rstr2hex(inputstr)).toBe(hexstr)
  })
})

// Check converting hex string to raw string
describe('Validate hex to raw string conversion', function () {
  it('hex2rstr-should convert hex string to raw string', function () {
    const inputstr = '68656C6C6F'
    const rawstr = 'hello'
    expect(Common.Hex2rstr(inputstr)).toBe(rawstr)
  })
})

// Check converting decimal to hex
describe('Validate decimal to hex conversion', function () {
  it('char2hex-should convert decimal to hex', function () {
    const ival = 220
    const hval = 'DC'
    expect(Common.Char2hex(ival)).toBe(hval)
  })
})

// Check converting a byte array of SID into string
describe('Validate SID byte array to string conversion', function () {
  it('GetSidString-should convert SID byte array as a string to a SID string', function () {
    const networkServiceSidByteArrayAsHex = '010100000000000514000000'
    const myHex = Buffer.from(networkServiceSidByteArrayAsHex, 'hex').toString()
    const networkServiceSid = 'S-1-5-20'
    const sidString = Common.GetSidString(myHex)
    expect(sidString).toBe(networkServiceSid)
  })
})
