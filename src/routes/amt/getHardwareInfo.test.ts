import * as hw from './getHardwareInfo'
import { createSpyObj } from '../../test/helper/jest'
import { devices } from '../../server/mpsserver'
import { ConnectedDevice } from '../../amt/ConnectedDevice'
import { biosElement, card, chassis, chip, computerSystemPackage, mediaAccessDevice, physicalMemory, physicalPackage, processor, systemPackaging } from '../../test/helper/wsmanResponses'

describe('Hardware information', () => {
  let resSpy
  let req
  const getSpy = jest.spyOn(hw, 'get')
  let ComputerSystemPackageSpy, ChassisSpy, CardSpy, BIOSElementSpy, ProcessorSpy
  let PhysicalMemorySpy, MediaAccessDeviceSpy, PhysicalPackageSpy, SystemPackagingSpy, ChipSpy

  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    ComputerSystemPackageSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getComputerSystemPackage')
    ChassisSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getChassis')
    CardSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getCard')
    BIOSElementSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getBIOSElement')
    ProcessorSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getProcessor')
    PhysicalMemorySpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getPhysicalMemory')
    MediaAccessDeviceSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getMediaAccessDevice')
    PhysicalPackageSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getPhysicalPackage')
    SystemPackagingSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getSystemPackaging')
    ChipSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getChip')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get hardware information', async () => {
    ComputerSystemPackageSpy.mockResolvedValueOnce(computerSystemPackage.Envelope)
    ChassisSpy.mockResolvedValueOnce(chassis.Envelope)
    CardSpy.mockResolvedValueOnce(card.Envelope)
    BIOSElementSpy.mockResolvedValueOnce(biosElement.Envelope)
    ProcessorSpy.mockResolvedValueOnce(processor.Envelope)
    PhysicalMemorySpy.mockResolvedValueOnce(physicalMemory.Envelope)
    MediaAccessDeviceSpy.mockResolvedValueOnce(mediaAccessDevice.Envelope)
    PhysicalPackageSpy.mockResolvedValueOnce(physicalPackage.Envelope)
    SystemPackagingSpy.mockResolvedValueOnce(systemPackaging.Envelope)
    ChipSpy.mockResolvedValueOnce(chip.Envelope)
    await hw.hardwareInfo(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
  })
  it('should handle error 400', async () => {
    ComputerSystemPackageSpy.mockResolvedValueOnce(null)
    ChassisSpy.mockResolvedValueOnce(null)
    CardSpy.mockResolvedValueOnce(null)
    BIOSElementSpy.mockResolvedValueOnce(null)
    ProcessorSpy.mockResolvedValueOnce(null)
    PhysicalMemorySpy.mockResolvedValueOnce(null)
    MediaAccessDeviceSpy.mockResolvedValueOnce(null)
    PhysicalPackageSpy.mockResolvedValueOnce(null)
    SystemPackagingSpy.mockResolvedValueOnce(null)
    ChipSpy.mockResolvedValueOnce(null)
    await hw.hardwareInfo(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Request failed during AMTHardware Information BatchEnum Exec for guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should handle error 500', async () => {
    getSpy.mockImplementation(() => {
      throw new Error()
    })
    await hw.hardwareInfo(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Request failed during AMTHardware Information.' })
  })
})
