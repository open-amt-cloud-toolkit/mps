/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as winston from 'winston'
import { ILogger } from '../interfaces/ILogger'

const { combine, timestamp, printf } = winston.format
const myFormat = printf(info => {
  return `${info.timestamp as string} ${info.level}: ${info.message}`
})

export const logger: ILogger = winston.createLogger({
  level: process.env.MPS_LOG_LEVEL || 'info',
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.Console()
    // new winston.transports.File({
    //   filename: path.join(__dirname, '/logs/debug.log')
    // })
  ],
  exceptionHandlers: [
    new winston.transports.Console()
    // new winston.transports.File({
    //   filename: path.join(__dirname, '/logs/exceptions.log')
    // })
  ],
  exitOnError: false
})
