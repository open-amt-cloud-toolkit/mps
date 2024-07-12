/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as winston from 'winston'
import { type ILogger } from '../interfaces/ILogger.js'

const { combine, timestamp, printf } = winston.format
const myFormat = printf((info) => `${info.timestamp as string} ${info.level}: ${info.message}`)

export const logger: ILogger = winston.createLogger({
  level: process.env.MPS_LOG_LEVEL ?? 'info',
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.Console()
  ],
  exceptionHandlers: [
    new winston.transports.Console()
  ],
  exitOnError: false
})
