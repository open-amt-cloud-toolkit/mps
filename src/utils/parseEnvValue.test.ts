/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as parse from './parseEnvValue.js'

describe('Check parseEnvValue', () => {
  it('Should pass when converting string to number', () => {
    const result = parse.parseValue('1020')
    expect(result).toEqual(1020)
  })
  it('Should pass when passing number', () => {
    const result = parse.parseValue(12345)
    expect(result).toEqual(12345)
  })
  it('Should pass when converting string to true', () => {
    const result = parse.parseValue('true')
    expect(result).toEqual(true)
  })
  it('Should pass when converting string to false', () => {
    const result = parse.parseValue('false')
    expect(result).toEqual(false)
  })
  it('Should pass when converting FALSE to false', () => {
    const result = parse.parseValue('FALSE')
    expect(result).toEqual(false)
  })
  it('Should pass when converting TRUE to true', () => {
    const result = parse.parseValue('TRUE')
    expect(result).toEqual(true)
  })
  it('Should return val', () => {
    const result = parse.parseValue('fake')
    expect(result).toEqual('fake')
  })
})
