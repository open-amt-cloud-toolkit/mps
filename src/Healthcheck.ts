/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { request } from 'http'
import { RequestOptions } from 'https'

const options: RequestOptions = {
  host: 'localhost',
  port: process.env.MPSWEBPORT || 3000,
  timeout: 2000,
  path: '/api/v1/health'
}

const health = request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

health.on('error', (err) => {
  console.error(err)
  process.exit(1)
})

health.end()
