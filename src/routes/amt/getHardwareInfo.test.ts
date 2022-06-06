/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as hw from './getHardwareInfo'
import { createSpyObj } from '../../test/helper/jest'
import { biosElement, card, chassis, chip, computerSystemPackage, mediaAccessDevice, physicalMemory, physicalPackage, processor, systemPackaging } from '../../test/helper/wsmanResponses'
import { DeviceAction } from '../../amt/DeviceAction'
import { CIRAHandler } from '../../amt/CIRAHandler'
import { HttpHandler } from '../../amt/HttpHandler'
import { messages } from '../../logging'

describe('Hardware information', () => {
  let resSpy
  let req
  const getSpy = jest.spyOn(hw, 'get')
  let ComputerSystemPackageSpy, ChassisSpy, CardSpy, BIOSElementSpy, ProcessorSpy
  let PhysicalMemorySpy, MediaAccessDeviceSpy, PhysicalPackageSpy, SystemPackagingSpy, ChipSpy

  beforeEach(() => {
    const handler = new CIRAHandler(new HttpHandler(), 'admin', 'P@ssw0rd')
    const device = new DeviceAction(handler, null)
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' }, deviceAction: device }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    ComputerSystemPackageSpy = jest.spyOn(device, 'getComputerSystemPackage')
    ChassisSpy = jest.spyOn(device, 'getChassis')
    CardSpy = jest.spyOn(device, 'getCard')
    BIOSElementSpy = jest.spyOn(device, 'getBIOSElement')
    ProcessorSpy = jest.spyOn(device, 'getProcessor')
    PhysicalMemorySpy = jest.spyOn(device, 'getPhysicalMemory')
    MediaAccessDeviceSpy = jest.spyOn(device, 'getMediaAccessDevice')
    PhysicalPackageSpy = jest.spyOn(device, 'getPhysicalPackage')
    SystemPackagingSpy = jest.spyOn(device, 'getSystemPackaging')
    ChipSpy = jest.spyOn(device, 'getChip')
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
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: `${messages.HARDWARE_INFORMATION_REQUEST_FAILED} for guid : 4c4c4544-004b-4210-8033-b6c04f504633.` })
  })
  it('should handle error 500', async () => {
    getSpy.mockImplementation(() => {
      throw new Error()
    })
    await hw.hardwareInfo(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: messages.HARDWARE_INFORMATION_EXCEPTION })
  })
})
