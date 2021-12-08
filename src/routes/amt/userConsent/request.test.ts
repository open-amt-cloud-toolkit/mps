import { createSpyObj } from '../../../test/helper/jest'
import { devices } from '../../../server/mpsserver'
import { ConnectedDevice } from '../../../amt/ConnectedDevice'
import { request } from './request'
import { startOptInResponse } from '../../../test/helper/wsmanResponses'

describe('request user consent code', () => {
  let resSpy
  let req
  let requestUserConsetCodeSpy
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    requestUserConsetCodeSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'requestUserConsetCode')
  })

  it('should cancel user conset code', async () => {
    const result = {
      Header: startOptInResponse.Envelope.Header,
      Body: startOptInResponse.Envelope.Body.StartOptIn_OUTPUT
    }
    requestUserConsetCodeSpy.mockResolvedValueOnce(startOptInResponse)
    await request(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(result)
  })
  it('should get an error with status code 400, when failed to request user consent code', async () => {
    requestUserConsetCodeSpy.mockResolvedValueOnce(null)
    await request(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Failed to request user consent code for guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    requestUserConsetCodeSpy.mockImplementation(() => {
      throw new Error()
    })
    await request(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Failed to request user consent code.' })
  })
})
