/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Environment } from '../../utils/Environment'
import jws from 'jws'

export function signature (expirationMinutes, device: string): any {
  const expiration = Math.floor((Date.now() + (1000 * 60 * expirationMinutes)) / 1000)
  const signature = jws.sign({
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      tenantId: '',
      iss: Environment.Config.jwt_issuer,
      deviceId: device,
      exp: expiration
    },
    secret: Environment.Config.jwt_secret
  })
  return signature
}
