import { validationResult } from 'express-validator'
import jws from 'jws'
import { Request, Response } from 'express'
import { logger as log } from '../../utils/logger'
import { Environment } from '../../utils/Environment'

export async function login (req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  const username: string = req.body.username
  const password: string = req.body.password
  // todo: implement a more advanced authentication system and RBAC
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
    log.silly(`Incorrect Username and/or Password!, username: ${username}`)
    res.status(401).send({ message: 'Incorrect Username and/or Password!' })
  }
}
