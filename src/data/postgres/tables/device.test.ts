/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { DeviceTable } from './device'
import { type Device } from '../../../models/models'
import PostgresDb from '..'
import { MPSValidationError } from '../../../utils/MPSValidationError'

describe('device tests', () => {
  let db: PostgresDb
  let deviceTable: DeviceTable
  let querySpy: jest.SpyInstance
  beforeEach(() => {
    db = new PostgresDb('')
    deviceTable = new DeviceTable(db)
    querySpy = jest.spyOn(deviceTable.db, 'query')
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should get a count of zero when no devices', async () => {
    querySpy.mockResolvedValueOnce({ rows: [{ total_count: 0 }], command: '', fields: null, rowCount: 0, oid: 0 })
    const count: number = await deviceTable.getCount()
    expect(count).toBe(0)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT count(*) OVER() AS total_count 
    FROM devices
    WHERE tenantid = $1`, [''])
  })

  test('should get a count of one when tenantId and device exist', async () => {
    querySpy.mockResolvedValueOnce({ rows: [{ total_count: 1 }], command: '', fields: null, rowCount: 0, oid: 0 })
    const count: number = await deviceTable.getCount('tenantId')
    expect(count).toBe(1)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT count(*) OVER() AS total_count 
    FROM devices
    WHERE tenantid = $1`, ['tenantId'])
  })

  test('should get an empty array when no devices', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const device: Device[] = await deviceTable.get()
    expect(device.length).toBe(0)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT 
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId",
      friendlyname as "friendlyName",
      dnssuffix as "dnsSuffix"
    FROM devices
    WHERE tenantid = $3 
    ORDER BY guid 
    LIMIT $1 OFFSET $2`, [25, 0, ''])
  })

  test('Should get an array of one when a device exist', async () => {
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null
    }
    querySpy.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 0, oid: 0 })
    const devices: Device[] = await deviceTable.get(25, 0, 'tenantId')
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT 
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId",
      friendlyname as "friendlyName",
      dnssuffix as "dnsSuffix"
    FROM devices
    WHERE tenantid = $3 
    ORDER BY guid 
    LIMIT $1 OFFSET $2`, [25, 0, 'tenantId'])
    expect(devices.length).toBe(1)
    expect(devices[0]).toBe(device)
  })

  test('Should get null when called with Id and no device exist', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const device: Device = await deviceTable.getById('4c4c4544-004b-4210-8033-b6c04f504633')
    expect(device).toBe(null)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`SELECT
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId",
      friendlyname as "friendlyName",
      dnssuffix as "dnsSuffix"
      FROM devices 
      WHERE guid = $1`, ['4c4c4544-004b-4210-8033-b6c04f504633'])
  })

  test('should get count of connected devices when exists', async () => {
    querySpy.mockResolvedValueOnce({ rows: [{ connected_count: 10 }], command: '', fields: null, rowCount: 0, oid: 0 })
    const connectedCount = await deviceTable.getConnectedDevices()
    expect(querySpy).toBeCalledWith(`
      SELECT count(*) OVER() AS connected_count 
      FROM devices
      WHERE tenantid = $1 and connectionstatus = true`, [''])
    expect(querySpy).toBeCalledTimes(1)
    expect(connectedCount).toBe(10)
  })

  test('should get ZERO connected devices when non connected', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const connectedCount = await deviceTable.getConnectedDevices()
    expect(querySpy).toBeCalledWith(`
      SELECT count(*) OVER() AS connected_count 
      FROM devices
      WHERE tenantid = $1 and connectionstatus = true`, [''])
    expect(querySpy).toBeCalledTimes(1)
    expect(connectedCount).toBe(0)
  })

  test('should get a device by guid when exist', async () => {
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null
    }
    querySpy.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 1, oid: 0 })
    const result: Device = await deviceTable.getById('4c4c4544-004b-4210-8033-b6c04f504633', 'tenantId')
    expect(result).toBe(device)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`SELECT
    guid as "guid",
    hostname as "hostname",
    tags as "tags",
    mpsinstance as "mpsInstance",
    connectionstatus as "connectionStatus",
    mpsusername as "mpsusername",
    tenantid as "tenantId",
    friendlyname as "friendlyName",
    dnssuffix as "dnsSuffix"
    FROM devices 
    WHERE guid = $1 and tenantid = $2`, ['4c4c4544-004b-4210-8033-b6c04f504633', 'tenantId'])
  })

  test('should get a device by hostname when exist', async () => {
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null
    }
    querySpy.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 1, oid: 0 })
    const result: Device[] = await deviceTable.getByHostname('hostname', 'tenantId')
    expect(result[0]).toBe(device)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId",
      friendlyname as "friendlyName",
      dnssuffix as "dnsSuffix"
    FROM devices 
    WHERE hostname = $1 and tenantid = $2`, ['hostname', 'tenantId'])
  })

  test('Should get null when called with hostname and no device exist', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const devices: Device[] = await deviceTable.getByHostname('hostname')
    expect(devices.length).toBe(0)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId",
      friendlyname as "friendlyName",
      dnssuffix as "dnsSuffix"
    FROM devices 
    WHERE hostname = $1 and tenantid = $2`, ['hostname', ''])
  })

  test('should get an empty array when no devices, AND method and default values', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const devices: Device[] = await deviceTable.getByTags(['acm', 'ccm'], 'AND')
    expect(devices.length).toBe(0)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
      SELECT 
        guid as "guid",
        hostname as "hostname",
        tags as "tags",
        mpsinstance as "mpsInstance",
        connectionstatus as "connectionStatus",
        mpsusername as "mpsusername",
        tenantid as "tenantId",
        friendlyname as "friendlyName",
        dnssuffix as "dnsSuffix"
      FROM devices 
      WHERE tags @> $1 and tenantId = $4
      ORDER BY guid 
      LIMIT $2 OFFSET $3`, [['acm', 'ccm'], 25, 0, ''])
  })

  test('should get a device when tenantId, skip, top, OR method, device guid matches', async () => {
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: ['acm'],
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null
    }
    querySpy.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 1, oid: 0 })
    const devices: Device[] = await deviceTable.getByTags(['acm', 'ccm'], 'OR', 25, 0, 'tenantId')
    expect(devices.length).toBe(1)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
      SELECT 
        guid as "guid",
        hostname as "hostname",
        tags as "tags",
        mpsinstance as "mpsInstance",
        connectionstatus as "connectionStatus",
        mpsusername as "mpsusername",
        tenantid as "tenantId",
        friendlyname as "friendlyName",
        dnssuffix as "dnsSuffix"
      FROM devices 
      WHERE tags && $1 and tenantId = $4
      ORDER BY guid 
      LIMIT $2 OFFSET $3`, [['acm', 'ccm'], 25, 0, 'tenantId'])
  })

  test('should get an array of tag names when tags exist ', async () => {
    querySpy.mockResolvedValueOnce({ rows: ['acm', 'ccm'], command: '', fields: null, rowCount: 1, oid: 0 })
    const tag = await deviceTable.getDistinctTags('4')
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT DISTINCT unnest(tags) as tag 
    FROM Devices
    WHERE tenantid = $1`, ['4'])
    expect(tag.length).toBe(2)
  })

  test('should get an empty array when no tags exist', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const tag = await deviceTable.getDistinctTags()
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    SELECT DISTINCT unnest(tags) as tag 
    FROM Devices
    WHERE tenantid = $1`, [''])
    expect(tag.length).toBe(0)
    expect(tag).toEqual([])
  })

  test('should return device when successfully inserted', async () => {
    const getById = jest.spyOn(deviceTable, 'getById')
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null,
      friendlyName: null,
      dnsSuffix: null
    }
    querySpy.mockResolvedValueOnce({ rows: [{ device }], command: '', fields: null, rowCount: 1, oid: 0 })
    getById.mockResolvedValueOnce(device)
    const result = await deviceTable.insert(device)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
      INSERT INTO devices(guid, hostname, tags, mpsinstance, connectionstatus, mpsusername, tenantid, friendlyname, dnssuffix) 
      values($1, $2, ARRAY(SELECT json_array_elements_text($3)), $4, $5, $6, $7, $8, $9)`,
    [
      device.guid,
      device.hostname,
      JSON.stringify(device.tags),
      device.mpsInstance,
      device.connectionStatus,
      device.mpsusername,
      device.tenantId,
      device.friendlyName,
      device.dnsSuffix
    ])
    expect(getById).toBeCalledTimes(1)
    expect(result).toBe(device)
  })

  test('should get null when device not inserted and no exception', async () => {
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null,
      friendlyName: null,
      dnsSuffix: null
    }
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const result = await deviceTable.insert(device)
    expect(result).toBe(null)
  })

  test('should get an exception when device fails to insert', async () => {
    let mpsError = null
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null,
      friendlyName: null,
      dnsSuffix: null
    }
    querySpy.mockRejectedValueOnce(() => {
      throw new Error()
    })
    try {
      await deviceTable.insert(device)
    } catch (error) {
      mpsError = error
    }
    expect(mpsError).toBeInstanceOf(MPSValidationError)
  })

  test('should throw unique key violation exception when a device already exist', async () => {
    let mpsError = null
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null,
      friendlyName: null,
      dnsSuffix: null
    }
    querySpy.mockRejectedValueOnce({ code: '23505' })
    try {
      await deviceTable.insert(device)
    } catch (error) {
      mpsError = error
    }
    expect(mpsError).toBeInstanceOf(MPSValidationError)
  })

  test('should get a device when device updates with change', async () => {
    const getById = jest.spyOn(deviceTable, 'getById')
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null,
      friendlyName: null,
      dnsSuffix: null
    }
    querySpy.mockResolvedValueOnce({ rows: [{ device }], command: '', fields: null, rowCount: 1, oid: 0 })
    getById.mockResolvedValueOnce(device)
    const result = await deviceTable.update(device)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
      UPDATE devices 
      SET tags=$2, hostname=$3, mpsinstance=$4, connectionstatus=$5, mpsusername=$6, friendlyname=$8, dnssuffix=$9
      WHERE guid=$1 and tenantid = $7`,
    [
      device.guid,
      device.tags,
      device.hostname,
      device.mpsInstance,
      device.connectionStatus,
      device.mpsusername,
      device.tenantId,
      device.friendlyName,
      device.dnsSuffix
    ])
    expect(getById).toBeCalledTimes(1)
    expect(result).toBe(device)
  })

  test('should throw 400 exception when fails to update device', async () => {
    let mpsError = null
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null,
      friendlyName: null,
      dnsSuffix: null
    }
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    try {
      await deviceTable.update(device)
    } catch (error) {
      mpsError = error
    }
    expect(mpsError).toBeInstanceOf(MPSValidationError)
  })

  test('should throw an exception when fails to update device', async () => {
    let mpsError = null
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null,
      friendlyName: null,
      dnsSuffix: null
    }
    querySpy.mockRejectedValueOnce(() => {
      throw new Error()
    })
    try {
      await deviceTable.update(device)
    } catch (error) {
      mpsError = error
    }
    expect(mpsError).toBeInstanceOf(MPSValidationError)
  })

  test('should get true when device connection status update', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 1, oid: 0 })
    const result = await deviceTable.clearInstanceStatus('localhost', '4')
    expect(result).toBe(true)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
      UPDATE devices 
      SET mpsinstance=$2, connectionstatus=$3 
      WHERE mpsinstance=$1 and tenantId = $4`,
    [
      'localhost',
      null,
      false,
      '4'
    ])
  })

  test('should get false when update to connection status fails', async () => {
    querySpy.mockRejectedValueOnce(() => {
      throw new Error()
    })
    const result = await deviceTable.clearInstanceStatus('localhost')
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
      UPDATE devices 
      SET mpsinstance=$2, connectionstatus=$3 
      WHERE mpsinstance=$1 and tenantId = $4`,
    [
      'localhost',
      null,
      false,
      ''
    ])
    expect(result).toBe(false)
  })

  test('Should get false when no device deleted', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
    const isDeleted: boolean = await deviceTable.delete('4c4c4544-004b-4210-8033-b6c04f504633')
    expect(isDeleted).toBe(false)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    DELETE FROM devices 
    WHERE guid = $1 and tenantid = $2`, ['4c4c4544-004b-4210-8033-b6c04f504633', ''])
  })

  test('Should get true when device deleted', async () => {
    querySpy.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 1, oid: 0 })
    const isDeleted: boolean = await deviceTable.delete('4c4c4544-004b-4210-8033-b6c04f504633', '4')
    expect(isDeleted).toBe(true)
    expect(querySpy).toBeCalledTimes(1)
    expect(querySpy).toBeCalledWith(`
    DELETE FROM devices 
    WHERE guid = $1 and tenantid = $2`, ['4c4c4544-004b-4210-8033-b6c04f504633', '4'])
  })
})
