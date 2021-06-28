import { validationResult } from 'express-validator'
import jws from 'jws'
import { Request, Response } from 'express'

export async function login (req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  const username = req.body.username
  const password = req.body.password
  // todo: implement a more advanced authentication system and RBAC
  if (username === req.mpsService.config.web_admin_user && password === req.mpsService.config.web_admin_password) {
    const expirationMinutes = Number(req.mpsService.config.jwt_expiration)
    const expiration = Math.floor((Date.now() + (1000 * 60 * expirationMinutes)) / 1000)
    const signature = jws.sign({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: {
        iss: req.mpsService.config.jwt_issuer,
        exp: expiration
      },
      secret: req.mpsService.config.jwt_secret
    })
    res.status(200).send({ token: signature })
  } else {
    res.status(401).send({ message: 'Incorrect Username and/or Password!' })
  }
}
