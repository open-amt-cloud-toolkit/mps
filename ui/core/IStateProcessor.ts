/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

 /**
 * Interface for RFB state processors.
 */
interface IStateProcessor {
  next: IStateProcessor;
  processState(acc: string): number;
}

export { IStateProcessor }