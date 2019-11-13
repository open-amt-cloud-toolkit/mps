/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

 /**
 * Interface for Desktop
 */
export interface IModule {
  protocol: number;
  processData: (data: string) => void;
  onStateChange: (state: number) => void;
  start: () => void;
}
