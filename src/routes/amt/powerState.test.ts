import { powerState } from './powerState'
import { createSpyObj } from '../../test/helper/jest'
import { devices } from '../../server/mpsserver'
import { ConnectedDevice } from '../../amt/ConnectedDevice'

describe('power state', () => {
  let resSpy
  let req
  let powerStateSpy
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    powerStateSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getPowerState')
  })

  it('should get power state', async () => {
    powerStateSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '1', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000002', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement' }, Body: { PullResponse: { Items: { CIM_AssociatedPowerManagementService: { AvailableRequestedPowerStates: ['8', '2', '5'], PowerState: '4', ServiceProvided: { Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', ReferenceParameters: { ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService', SelectorSet: { Selector: ['CIM_PowerManagementService', 'Intel(r) AMT Power Management Service', 'CIM_ComputerSystem', 'Intel(r) AMT'] } } }, UserOfService: { Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', ReferenceParameters: { ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem', SelectorSet: { Selector: ['CIM_ComputerSystem', 'ManagedSystem'] } } } } }, EndOfSequence: '' } } } })
    await powerState(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.send).toHaveBeenCalledWith({ powerstate: '4' })
  })
  it('should get an error with status code 400, when get power state is null', async () => {
    powerStateSpy.mockResolvedValueOnce(null)
    await powerState(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Request failed during powerstate fetch for guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    powerStateSpy.mockImplementation(() => {
      throw new Error()
    })
    await powerState(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Request failed during powerstate fetch.' })
  })
})
