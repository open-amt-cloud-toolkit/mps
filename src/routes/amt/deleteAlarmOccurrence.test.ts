/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as deleteAlarm from './deleteAlarmOccurrence'
import { createSpyObj } from '../../test/helper/jest'
import { deleteAlarmClockOccurrence, deleteAlarmClockOccurrenceNotFound } from '../../test/helper/wsmanResponses'
import { DeviceAction } from '../../amt/DeviceAction'
import { CIRAHandler } from '../../amt/CIRAHandler'
import { HttpHandler } from '../../amt/HttpHandler'
import { messages } from '../../logging'

describe('Delete Alarm Clock Occurrence', () => {
  let resSpy
  let req
  let badReq
  const deleteSpy = jest.spyOn(deleteAlarm, 'deleteAlarm')
  let AlarmClockOccurrenceSpy

  beforeEach(() => {
    const handler = new CIRAHandler(new HttpHandler(), 'admin', 'P@ssw0rd')
    const device = new DeviceAction(handler, null)
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' }, body: { Name: 'Alarm Instance Name' }, deviceAction: device }
    badReq = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' }, deviceAction: device }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    AlarmClockOccurrenceSpy = jest.spyOn(device, 'deleteAlarmClockOccurrence')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should delete an alarm clock occurrence', async () => {
    const expectedResult = {
      status: 'SUCCESS'
    }

    AlarmClockOccurrenceSpy.mockResolvedValueOnce(deleteAlarmClockOccurrence.Envelope)

    await deleteAlarm.deleteAlarmOccurrence(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(expectedResult)
  })
  it('should handle error 400', async () => {
    AlarmClockOccurrenceSpy.mockResolvedValueOnce(null)

    await deleteAlarm.deleteAlarmOccurrence(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: `${messages.ALARM_OCCURRENCES_DELETE_REQUEST_FAILED} for guid : 4c4c4544-004b-4210-8033-b6c04f504633.` })
  })
  it('should require Name in the request', async () => {
    await deleteAlarm.deleteAlarmOccurrence(badReq, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: `${messages.ALARM_OCCURRENCES_INVALID_REQUEST} for guid : 4c4c4544-004b-4210-8033-b6c04f504633.` })
  })
  it('should handle error 404', async () => {
    AlarmClockOccurrenceSpy.mockResolvedValueOnce(deleteAlarmClockOccurrenceNotFound.Envelope)

    await deleteAlarm.deleteAlarmOccurrence(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(404)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Alarm instance not found', errorDescription: `${messages.ALARM_OCCURRENCES_DELETE_REQUEST_FAILED} for guid : 4c4c4544-004b-4210-8033-b6c04f504633.` })
  })
  it('should handle error 500', async () => {
    deleteSpy.mockImplementation(() => {
      throw new Error()
    })
    await deleteAlarm.deleteAlarmOccurrence(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: messages.ALARM_OCCURRENCES_EXCEPTION })
  })
})
