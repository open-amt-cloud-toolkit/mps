import { version } from './getVersion'
import { createSpyObj } from '../../test/helper/jest'
import { devices } from '../../server/mpsserver'
import { ConnectedDevice } from '../../amt/ConnectedDevice'

const versionResponse = {
  CIM_SoftwareIdentity: {
    responses: [{
      InstanceID: 'Flash',
      IsEntity: 'true',
      VersionString: '15.0.23'
    }, {
      InstanceID: 'Netstack',
      IsEntity: 'true',
      VersionString: '15.0.23'
    }, {
      InstanceID: 'AMTApps',
      IsEntity: 'true',
      VersionString: '15.0.23'
    }, {
      InstanceID: 'AMT',
      IsEntity: 'true',
      VersionString: '15.0.23'
    }, {
      InstanceID: 'Sku',
      IsEntity: 'true',
      VersionString: '16392'
    }, {
      InstanceID: 'VendorID',
      IsEntity: 'true',
      VersionString: '8086'
    }, {
      InstanceID: 'Build Number',
      IsEntity: 'true',
      VersionString: '1706'
    }, {
      InstanceID: 'Recovery Version',
      IsEntity: 'true',
      VersionString: '15.0.23'
    }, {
      InstanceID: 'Recovery Build Num',
      IsEntity: 'true',
      VersionString: '1706'
    }, {
      InstanceID: 'Legacy Mode',
      IsEntity: 'true',
      VersionString: 'False'
    }, {
      InstanceID: 'AMT FW Core Version',
      IsEntity: 'true',
      VersionString: '15.0.23'
    }],
    status: 200
  },
  AMT_SetupAndConfigurationService: {
    response: {
      CreationClassName: 'AMT_SetupAndConfigurationService',
      ElementName: 'Intel(r) AMT Setup and Configuration Service',
      EnabledState: '5',
      Name: 'Intel(r) AMT Setup and Configuration Service',
      PasswordModel: '1',
      ProvisioningMode: '1',
      ProvisioningServerOTP: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      ProvisioningState: '2',
      RequestedState: '12',
      SystemCreationClassName: 'CIM_ComputerSystem',
      SystemName: 'Intel(r) AMT',
      ZeroTouchConfigurationEnabled: 'true'
    },
    responses: {
      Header: {
        To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
        RelatesTo: '2',
        Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
        MessageID: 'uuid:00000000-8086-8086-8086-000000000003',
        ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService'
      },
      Body: {
        CreationClassName: 'AMT_SetupAndConfigurationService',
        ElementName: 'Intel(r) AMT Setup and Configuration Service',
        EnabledState: '5',
        Name: 'Intel(r) AMT Setup and Configuration Service',
        PasswordModel: '1',
        ProvisioningMode: '1',
        ProvisioningServerOTP: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        ProvisioningState: '2',
        RequestedState: '12',
        SystemCreationClassName: 'CIM_ComputerSystem',
        SystemName: 'Intel(r) AMT',
        ZeroTouchConfigurationEnabled: 'true'
      }
    },
    status: 200
  }
}

describe('version', () => {
  let resSpy
  let req
  let versionSpy
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    versionSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getVersion')
  })

  it('should get version', async () => {
    versionSpy.mockResolvedValueOnce(versionResponse)
    await version(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(versionResponse)
  })
  it('should get an error with status code 400, when get version is null', async () => {
    versionSpy.mockResolvedValueOnce(null)
    await version(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Request failed during AMTVersion BatchEnum Exec for guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    versionSpy.mockImplementation(() => {
      throw new Error()
    })
    await version(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Request failed during AMTVersion BatchEnum Exec.' })
  })
})
