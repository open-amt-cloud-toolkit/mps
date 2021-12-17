import { createSpyObj } from '../../../test/helper/jest'
import { devices } from '../../../server/mpsserver'
import { ConnectedDevice } from '../../../amt/ConnectedDevice'
import { cancel } from './cancel'
import { cancelOptInResponse } from '../../../test/helper/wsmanResponses'

describe('cancel user consent code', () => {
  let resSpy
  let req
  let cancelUserConsetCodeSpy
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    cancelUserConsetCodeSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'cancelUserConsentCode')
  })

  it('should cancel user conset code', async () => {
    const result = {
      Header: cancelOptInResponse.Envelope.Header,
      Body: cancelOptInResponse.Envelope.Body.CancelOptIn_OUTPUT
    }
    cancelUserConsetCodeSpy.mockResolvedValueOnce(cancelOptInResponse)
    await cancel(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(result)
  })
  it('should get an error with status code 400, when failed to cancel user consent code', async () => {
    cancelUserConsetCodeSpy.mockResolvedValueOnce(null)
    await cancel(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Failed to cancel user consent code for guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    cancelUserConsetCodeSpy.mockImplementation(() => {
      throw new Error()
    })
    await cancel(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Failed to cancel user consent code.' })
  })
})
