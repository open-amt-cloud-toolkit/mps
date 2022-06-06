/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export interface ILogger {
  debug: (log: string, ...params: any[]) => void
  info: (log: string, ...params: any[]) => void
  warn: (log: string, ...params: any[]) => void
  error: (log: string, ...params: any[]) => void
  verbose: (log: string, ...params: any[]) => void
  silly: (log: string, ...params: any[]) => void
}
