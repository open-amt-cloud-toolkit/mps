import jws from 'jws'
export async function login (req, res): Promise<void> {
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    // todo: implement a more advanced authentication system and RBAC
    if (username === req.mpsService.config.web_admin_user && password === req.mpsService.config.web_admin_password) {
      const expirationhours = Number(req.mpsService.config.jwt_expiration)
      const expiration = Date.now() + (1000 * 60 * 60 * expirationhours)
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
}
