/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

 /**
 * Interface for handling ZRLE decoding. Uses ZLIB.
 */
interface IRLEDecoder {
  Decode(acc:string, ptr: number, x: number, y: number, width: number, height: number, s: number, datalen: number): void
}

export { IRLEDecoder }