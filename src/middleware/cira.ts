import { Request, Response } from 'express'
import { ErrorResponse } from '../utils/amtHelper'
import { amtPort } from '../utils/constants'
import { MqttProvider } from '../utils/mqttProvider'

const ciraMiddleware = async (req: Request, res: Response, next): Promise<void> => {
  const guid = req.params.guid
  const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]

  if (ciraconn?.readyState === 'open') {
    const cred = await req.mpsService.secrets.getAMTCredentials(guid)
    req.amtStack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
    next()
  } else {
    MqttProvider.publishEvent('fail', ['CIRA_Connection'], 'Device Not Found', guid)
    res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
  }
}
export default ciraMiddleware
