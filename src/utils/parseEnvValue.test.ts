/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as parse from './parseEnvValue'

describe('Check parseEnvValue', () => {
  it('Should pass when converting string to number', async () => {
    const result = await parse.parseValue('1020')
    expect(result).toEqual(1020)
  })
  it('Should pass when passing number', async () => {
    const result = await parse.parseValue(12345)
    expect(result).toEqual(12345)
  })
  it('Should pass when converting string to true', async () => {
    const result = await parse.parseValue('true')
    expect(result).toEqual(true)
  })
  it('Should pass when converting string to false', async () => {
    const result = await parse.parseValue('false')
    expect(result).toEqual(false)
  })
  it('Should pass when converting FALSE to false', async () => {
    const result = await parse.parseValue('FALSE')
    expect(result).toEqual(false)
  })
  it('Should pass when converting TRUE to true', async () => {
    const result = await parse.parseValue('TRUE')
    expect(result).toEqual(true)
  })
  it('Should return val', async () => {
    const result = await parse.parseValue('fake')
    expect(result).toEqual('fake')
  })
})
