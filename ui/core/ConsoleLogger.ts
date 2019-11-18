/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/
import { ILogger, LogLevel } from "./ILogger";

/**
 * ConsoleLogger implements ILogger to provide basic console logging functionality.
 */
export class ConsoleLogger implements ILogger {
  minLevel: LogLevel
  constructor(level : LogLevel) {
    this.minLevel = level
  }
  log(level: LogLevel, data: string): void {
    switch (level) {
      case LogLevel.VERBOSE:
        this.verbose(data)
        break;
      case LogLevel.INFO:
        this.info(data)
        break;
      case LogLevel.DEBUG:
        this.debug(data)
        break;
      case LogLevel.WARNING:
        this.warn(data)
        break;
      case LogLevel.ERROR:
        this.error(data)
        break;
      default:
        break;
    }
  }
  debug(log: string): void {
    if(this.minLevel >= LogLevel.DEBUG) console.debug(log)
  }
  info(log: string): void {
    if(this.minLevel >= LogLevel.INFO) console.info(log)
  }
  error(log: string): void {
    if(this.minLevel >= LogLevel.ERROR) console.error(log)
  }
  warn(log: string): void {
    if(this.minLevel >= LogLevel.WARNING) console.warn(log)
  }
  verbose(log: string): void {
    if(this.minLevel >= LogLevel.VERBOSE) console.log(log)
  }
}
