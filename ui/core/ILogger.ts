/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

interface ILogger {
  debug(log: string):void
  info(log: string):void
  error(log: string):void
  warn(log: string):void
  verbose(log: string):void
}
enum LogLevel {
  VERBOSE = 5,
  INFO = 4,
  DEBUG = 3,
  WARNING = 2,
  ERROR = 1
}
export { ILogger, LogLevel }