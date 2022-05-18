import { validationResult } from 'express-validator'
import jws from 'jws'
import { Request, Response } from 'express'
import { logger } from '../../logging/logger'
import { Environment } from '../../utils/Environment'
import { messages } from '../../logging'

export async function login (req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  // todo: implement a more advanced authentication system and RBAC
  if (!Environment.Config.web_auth_enabled) {
    res.status(405).send({ message: messages.AUTH_DISABLED })
    return
  }
  const username: string = req.body.username
  const password: string = req.body.password
  if (username.toLowerCase() === Environment.Config.web_admin_user.toLowerCase() && password === Environment.Config.web_admin_password) {
    const expirationMinutes = Number(Environment.Config.jwt_expiration)
    const expiration = Math.floor((Date.now() + (1000 * 60 * expirationMinutes)) / 1000)
    const signature = jws.sign({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: {
        tenantId: '',
        iss: Environment.Config.jwt_issuer,
        exp: expiration
      },
      secret: Environment.Config.jwt_secret
    })
    res.status(200).send({ token: signature })
  } else {
    logger.silly(`${messages.LOGIN_FAILED}, username: ${username}`)
    res.status(401).send({ message: messages.LOGIN_FAILED })
  }
}
