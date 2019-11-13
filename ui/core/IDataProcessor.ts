/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/
/**
 * Interface for Data processing
 */
interface IDataProcessor {
  processData(data: string) : void
}

export { IDataProcessor }