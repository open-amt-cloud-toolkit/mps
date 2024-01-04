/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

// Convert boolean strings to boolean
// And number strings to numbers.
// Need this to support ENV variables whose values are always strings
export function parseValue (val): number | boolean {
  if (!isNaN(val as number)) return parseInt(val as string)
  if (val.toLowerCase() === 'true') return true
  if (val.toLowerCase() === 'false') return false
  return val
}
