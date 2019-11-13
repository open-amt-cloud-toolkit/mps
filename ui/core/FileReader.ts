/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

 /**
 * Interface for FileReader to read data over WebSockets
 */
export interface FileReader {
  readAsArrayBuffer(data: Blob): void;
  readAsBinaryString(data: Blob): void;
  onload: (e: Event) => void;
  onloadend: (e: Event) => void;
}
