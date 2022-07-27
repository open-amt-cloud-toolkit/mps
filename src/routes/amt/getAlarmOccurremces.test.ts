/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as alarms from './getAlarmOccurrences'
import { createSpyObj } from '../../test/helper/jest'
import { alarmClockOccurrences, alarmClockNoOccurrences, alarmClockManyOccurrences } from '../../test/helper/wsmanResponses'
import { DeviceAction } from '../../amt/DeviceAction'
import { CIRAHandler } from '../../amt/CIRAHandler'
import { HttpHandler } from '../../amt/HttpHandler'
import { messages } from '../../logging'

describe('Alarm Clock Occurrences', () => {
  let resSpy
  let req
  const getSpy = jest.spyOn(alarms, 'get')
  let AlarmClockOccurrenceSpy

  beforeEach(() => {
    const handler = new CIRAHandler(new HttpHandler(), 'admin', 'P@ssw0rd')
    const device = new DeviceAction(handler, null)
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' }, deviceAction: device }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    AlarmClockOccurrenceSpy = jest.spyOn(device, 'getAlarmClockOccurrences')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get a single alarm clock occurrence', async () => {
    const expectedResult =
      [alarmClockOccurrences.Envelope.Body.PullResponse.Items.IPS_AlarmClockOccurrence]

    AlarmClockOccurrenceSpy.mockResolvedValueOnce(alarmClockOccurrences.Envelope)

    await alarms.getAlarmOccurrences(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(expectedResult)
  })

  it('should get many alarm clock occurrences', async () => {
    const expectedResult = alarmClockManyOccurrences.Envelope.Body.PullResponse.Items.IPS_AlarmClockOccurrence

    AlarmClockOccurrenceSpy.mockResolvedValueOnce(alarmClockManyOccurrences.Envelope)

    await alarms.getAlarmOccurrences(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(expectedResult)
  })

  it('should get empty array if no alarm clock occurrences', async () => {
    const expectedResult = []

    AlarmClockOccurrenceSpy.mockResolvedValueOnce(alarmClockNoOccurrences.Envelope)

    await alarms.getAlarmOccurrences(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(expectedResult)
  })

  it('should handle error 400', async () => {
    AlarmClockOccurrenceSpy.mockResolvedValueOnce(null)

    await alarms.getAlarmOccurrences(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: `${messages.ALARM_OCCURRENCES_GET_REQUEST_FAILED} for guid : 4c4c4544-004b-4210-8033-b6c04f504633.` })
  })
  it('should handle error 500', async () => {
    getSpy.mockImplementation(() => {
      throw new Error()
    })
    await alarms.getAlarmOccurrences(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: messages.ALARM_OCCURRENCES_EXCEPTION })
  })
})
