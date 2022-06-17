/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { powerState } from './getPowerState'
import { createSpyObj } from '../../test/helper/jest'
import { serviceAvailableToElement } from '../../test/helper/wsmanResponses'
import { CIRAHandler } from '../../amt/CIRAHandler'
import { DeviceAction } from '../../amt/DeviceAction'
import { HttpHandler } from '../../amt/HttpHandler'
import { messages } from '../../logging'

describe('power state', () => {
  let resSpy
  let req
  let powerStateSpy
  beforeEach(() => {
    const handler = new CIRAHandler(new HttpHandler(), 'admin', 'P@ssw0rd')
    const device = new DeviceAction(handler, null)
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = {
      params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' },
      deviceAction: device
    }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    powerStateSpy = jest.spyOn(device, 'getPowerState')
  })

  it('should get power state', async () => {
    powerStateSpy.mockResolvedValueOnce(serviceAvailableToElement.Envelope.Body)
    await powerState(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.send).toHaveBeenCalledWith({ powerstate: '4' })
  })
  it('should get an error with status code 400, when get power state is null', async () => {
    powerStateSpy.mockResolvedValueOnce(null)
    await powerState(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: `${messages.POWER_STATE_REQUEST_FAILED} for guid : 4c4c4544-004b-4210-8033-b6c04f504633.` })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    powerStateSpy.mockImplementation(() => {
      throw new Error()
    })
    await powerState(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: messages.POWER_STATE_EXCEPTION })
  })
})
