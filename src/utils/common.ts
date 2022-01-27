/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { createHash, randomBytes } from 'crypto'
const Common = {
  ReadShort: (v: string, p: number): number => {
    return (v.charCodeAt(p) << 8) + v.charCodeAt(p + 1)
  },
  ReadShortX: (v: string, p: number): number => {
    return (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p)
  },
  ReadInt: (v: string, p: number): number => {
    return (v.charCodeAt(p) * 0x1000000) + (v.charCodeAt(p + 1) << 16) + (v.charCodeAt(p + 2) << 8) + v.charCodeAt(p + 3)
  }, // We use "*0x1000000" instead
  ReadIntX: (v: string, p: number): number => {
    return (v.charCodeAt(p + 3) * 0x1000000) + (v.charCodeAt(p + 2) << 16) + (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p)
  },
  ReadBufferIntX: (v: Buffer, p: number): number => {
    return (v[p + 3] * 0x1000000) + (v[p + 2] << 16) + (v[p + 1] << 8) + v[p]
  },
  ShortToStr: (v: number): string => {
    return String.fromCharCode((v >> 8) & 0xFF, v & 0xFF)
  },
  ShortToStrX: (v: number): string => {
    return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF)
  },
  IntToStr: (v: number): string => {
    return String.fromCharCode((v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF)
  },
  IntToStrX: (v: number): string => {
    return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >> 24) & 0xFF)
  },
  MakeToArray: (v: any): any[] => {
    // if (!v || v == null || typeof v === 'object') { return v as any } if things go wonky, put this back
    return [v]
  },
  Clone: (v: any) => {
    return JSON.parse(JSON.stringify(v))
  },
  Rstr2hex: (input: string): string => {
    let r = ''
    for (let i = 0; i < input.length; i++) {
      r += Common.Char2hex(input.charCodeAt(i))
    }
    return r
  },
  // Convert a hex string to a raw string
  Hex2rstr: (d: string): string => {
    let r = ''
    const m = ('' + d).match(/../g)
    for (let i = 0; i < m.length; i++) {
      r += String.fromCharCode('0x' as any + m[i] as any)
    }
    return r
  },

  // Convert decimal to hex
  Char2hex: (i: number): string => {
    return (i + 0x100).toString(16).substr(-2).toUpperCase()
  },

  // Compute the MD5 digest hash for a set of values
  ComputeDigesthash: (username: string, password: string, realm: string, method: string, path: string, qop: string, nonce: string, nc: string, cnonce: string): string => {
    const ha1 = createHash('md5').update(username + ':' + realm + ':' + password).digest('hex')
    const ha2 = createHash('md5').update(method + ':' + path).digest('hex')
    return createHash('md5').update(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2).digest('hex')
  },

  RandomValueHex (len: number): string {
    return randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len)
  },

  // Convert a byte array of SID into string
  GetSidString (sid: string): string {
    let value: string = `S-${sid.charCodeAt(0)}-${sid.charCodeAt(7)}`
    for (let i = 2; i < (sid.length / 4); i++) {
      value += `-${Common.ReadIntX(sid, i * 4)}`
    }
    return value
  }
}
export default Common
