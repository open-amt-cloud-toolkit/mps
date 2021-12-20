import { version } from './getVersion'
import { createSpyObj } from '../../test/helper/jest'
import { devices } from '../../server/mpsserver'
import { ConnectedDevice } from '../../amt/ConnectedDevice'
import { setupAndConfigurationServiceResponse, softwareIdentityResponse, versionResponse } from '../../test/helper/wsmanResponses'

describe('version', () => {
  let resSpy
  let req
  let setupAndConfigurationServiceSpy: jest.SpyInstance
  let softwareIdentitySpy: jest.SpyInstance
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    softwareIdentitySpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getSoftwareIdentity')
    setupAndConfigurationServiceSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getSetupAndConfigurationService')
  })

  it('should get version', async () => {
    softwareIdentitySpy.mockResolvedValueOnce(softwareIdentityResponse)
    setupAndConfigurationServiceSpy.mockResolvedValueOnce(setupAndConfigurationServiceResponse)
    await version(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(versionResponse)
  })
  it('should get an error with status code 400, when get version is null', async () => {
    softwareIdentitySpy.mockResolvedValueOnce(null)
    setupAndConfigurationServiceSpy.mockResolvedValueOnce(setupAndConfigurationServiceResponse)
    await version(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Request failed during AMTVersion BatchEnum Exec for guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    softwareIdentitySpy.mockImplementation(() => {
      throw new Error()
    })
    await version(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Request failed during AMTVersion BatchEnum Exec.' })
  })
})
