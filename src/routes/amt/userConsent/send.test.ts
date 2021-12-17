import { createSpyObj } from '../../../test/helper/jest'
import { devices } from '../../../server/mpsserver'
import { ConnectedDevice } from '../../../amt/ConnectedDevice'
import { send } from './send'
import { sendOptInCodeResponse } from '../../../test/helper/wsmanResponses'

describe('send user consent code', () => {
  let resSpy
  let req
  let sendUserConsetCodeSpy
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' }, body: { consentCode: 985167 } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    sendUserConsetCodeSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'sendUserConsentCode')
  })

  it('should cancel user conset code', async () => {
    const result = {
      Header: sendOptInCodeResponse.Envelope.Header,
      Body: sendOptInCodeResponse.Envelope.Body.SendOptInCode_OUTPUT
    }
    sendUserConsetCodeSpy.mockResolvedValueOnce(sendOptInCodeResponse)
    await send(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(result)
  })
  it('should get an error with status code 400, when failed to request user consent code', async () => {
    sendUserConsetCodeSpy.mockResolvedValueOnce(null)
    await send(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Failed to send user consent code for guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    sendUserConsetCodeSpy.mockImplementation(() => {
      throw new Error()
    })
    await send(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Failed to send user consent code.' })
  })
})
