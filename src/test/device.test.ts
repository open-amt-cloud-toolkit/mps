import { DeviceTable } from '../data/postgres/tables/device'
import { Device } from '../models/models'
import PostgresDb from '../data/postgres'
import { MPSValidationError } from '../utils/MPSValidationError'


const db: PostgresDb = new PostgresDb('postgresql://postgresadmin:admin123@localhost:5432/mpsdb?sslmode=no-verify')
const deviceTable: DeviceTable = new DeviceTable(db)

afterEach(() => {
  jest.clearAllMocks()
})

test('should get a count of zero when no devices', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [{total_count: 0}], command: '', fields: null, rowCount: 0, oid: 0 })
  const count: number = await deviceTable.getCount()
  expect(count).toBe(0)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    SELECT count(*) OVER() AS total_count 
    FROM devices
    WHERE tenantid = $1`,[''])
})

test('should get a count of one when tenantId and device exist', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [{total_count: 1}], command: '', fields: null, rowCount: 0, oid: 0 })
  const count: number = await deviceTable.getCount('tenantId')
  expect(count).toBe(1)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    SELECT count(*) OVER() AS total_count 
    FROM devices
    WHERE tenantid = $1`,['tenantId'])
})

test('should get an empty array when no devices', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
  const device: Device[] = await deviceTable.get()
  expect(device.length).toBe(0)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    SELECT 
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId"
    FROM devices
    WHERE tenantid = $3 
    ORDER BY guid 
    LIMIT $1 OFFSET $2`, [25, 0, ''])
})

test('Should get an array of one when a device exist', async () => {
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 0, oid: 0 })
  const devices: Device[] = await deviceTable.get(25, 0, 'tenantId')
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    SELECT 
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId"
    FROM devices
    WHERE tenantid = $3 
    ORDER BY guid 
    LIMIT $1 OFFSET $2`, [25, 0, 'tenantId'])
  expect(devices.length).toBe(1)
  expect(devices[0]).toBe(device)
})

test('Should get null when no device exist', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
  const device: Device = await deviceTable.getByName('4c4c4544-004b-4210-8033-b6c04f504633')
  expect(device).toBe(null)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    SELECT
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId"
    FROM devices 
    WHERE guid = $1 and tenantid = $2`, ['4c4c4544-004b-4210-8033-b6c04f504633', ''])
})


test('should get a device when exist', async () => {
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 1, oid: 0 })
  const result: Device = await deviceTable.getByName('4c4c4544-004b-4210-8033-b6c04f504633', 'tenantId')
  expect(result).toBe(device)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    SELECT
      guid as "guid",
      hostname as "hostname",
      tags as "tags",
      mpsinstance as "mpsInstance",
      connectionstatus as "connectionStatus",
      mpsusername as "mpsusername",
      tenantid as "tenantId"
    FROM devices 
    WHERE guid = $1 and tenantid = $2`, ['4c4c4544-004b-4210-8033-b6c04f504633', 'tenantId'])
})

test('should get an empty array when no devices, AND method and default values', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
  const devices: Device[] = await deviceTable.getByTags(['acm','ccm'], 'AND')
  expect(devices.length).toBe(0)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
      SELECT 
        guid as "guid",
        hostname as "hostname",
        tags as "tags",
        mpsinstance as "mpsInstance",
        connectionstatus as "connectionStatus",
        mpsusername as "mpsusername",
        tenantid as "tenantId" 
      FROM devices 
      WHERE tags @> $1 and tenantId = $4
      ORDER BY guid 
      LIMIT $2 OFFSET $3`, [['acm','ccm'], 25, 0, ''])
})


test('should get a device when tenantId, skip, top, OR method, device guid matches', async () => {
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: ['acm'],
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 1, oid: 0 })
  const devices: Device[] = await deviceTable.getByTags(['acm','ccm'], 'OR', 25, 0, 'tenantId')
  expect(devices.length).toBe(1)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
      SELECT 
        guid as "guid",
        hostname as "hostname",
        tags as "tags",
        mpsinstance as "mpsInstance",
        connectionstatus as "connectionStatus",
        mpsusername as "mpsusername",
        tenantid as "tenantId" 
      FROM devices 
      WHERE tags && $1 and tenantId = $4
      ORDER BY guid 
      LIMIT $2 OFFSET $3`, [['acm','ccm'], 25, 0, 'tenantId'])
})

test('should get an array of tag names when tags exist ', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: ['acm','ccm'], command: '', fields: null, rowCount: 1, oid: 0 })
  const tag = await deviceTable.getDistinctTags('4')
  expect(query).toBeCalledTimes(1);
  expect(query).toBeCalledWith(`
    SELECT DISTINCT unnest(tags) as tag 
    FROM Devices
    WHERE tenantid = $1`,['4'])
  expect(tag.length).toBe(2)
})

test('should get an empty array when no tags exist', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
  const tag = await deviceTable.getDistinctTags()
  expect(query).toBeCalledTimes(1);
  expect(query).toBeCalledWith(`
    SELECT DISTINCT unnest(tags) as tag 
    FROM Devices
    WHERE tenantid = $1`,[''])
  expect(tag.length).toBe(0)
  expect(tag).toEqual([])
})

test('should return device when successfully inserted', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  const getByName = jest.spyOn(deviceTable, "getByName") 
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  query.mockResolvedValueOnce({ rows: [{device}], command: '', fields: null, rowCount: 1, oid: 0 })
  getByName.mockResolvedValueOnce(device)
  const result = await deviceTable.insert(device)
  expect(query).toBeCalledTimes(1);
  expect(query).toBeCalledWith(`
      INSERT INTO devices(guid, hostname, tags, mpsinstance, connectionstatus, mpsusername, tenantid) 
      values($1, $2, ARRAY(SELECT json_array_elements_text($3)), $4, $5, $6, $7)`,
      [
        device.guid,
        device.hostname,
        JSON.stringify(device.tags),
        device.mpsInstance,
        device.connectionStatus,
        device.mpsusername,
        device.tenantId
      ])
  expect(getByName).toBeCalledTimes(1)
  expect(result).toBe(device)
})

test('should get null when device not inserted and no exception', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
  const result = await deviceTable.insert(device)
  expect(result).toBe(null)
})

test('should get an exception when device fails to insert', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  let mpsError = null
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  query.mockRejectedValueOnce(() => {
    throw new Error();
  })
  try {
    await deviceTable.insert(device)
  } catch (error) {
    mpsError = error
  }
  expect(mpsError).toBeInstanceOf(MPSValidationError)
})

test('should throw unique key violation exception when a device already exist', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  let mpsError = null
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  query.mockRejectedValueOnce({code: '23505'})
  try {
    await deviceTable.insert(device)
  } catch (error) {
    mpsError = error
  }
  expect(mpsError).toBeInstanceOf(MPSValidationError)
})

test('should get a device when device updates with change', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  const getByName = jest.spyOn(deviceTable, "getByName") 
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  query.mockResolvedValueOnce({ rows: [{device}], command: '', fields: null, rowCount: 1, oid: 0 })
  getByName.mockResolvedValueOnce(device)
  const result = await deviceTable.update(device)
  expect(query).toBeCalledTimes(1);
  expect(query).toBeCalledWith(`
      UPDATE devices 
      SET tags=$2, hostname=$3, mpsinstance=$4, connectionstatus=$5, mpsusername=$6 
      WHERE guid=$1 and tenantid = $7`,
      [
        device.guid,
        device.tags,
        device.hostname,
        device.mpsInstance,
        device.connectionStatus,
        device.mpsusername,
        device.tenantId
      ])
  expect(getByName).toBeCalledTimes(1)
  expect(result).toBe(device)
})

test('should throw 400 exception when fails to update device', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  let mpsError = null
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
  try {
    await deviceTable.update(device)
  } catch (error) {
    mpsError = error
  }
  expect(mpsError).toBeInstanceOf(MPSValidationError)
})

test('should throw an exception when fails to update device', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  let mpsError = null
  const device = {
    guid : '4c4c4544-004b-4210-8033-b6c04f504633',
    hostname: 'hostname',
    tags: null,
    mpsInstance: 'localhost',
    connectionStatus: false,
    mpsusername: 'admin',
    tenantId: null
  }
  query.mockRejectedValueOnce(() => {
    throw new Error();
  })
  try {
    await deviceTable.update(device)
  } catch (error) {
    mpsError = error
  }
  expect(mpsError).toBeInstanceOf(MPSValidationError)
})

test('should get true when device connection status update', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 1, oid: 0 })
  const result = await deviceTable.clearInstanceStatus('localhost', '4')
  expect(result).toBe(true)
  expect(query).toBeCalledTimes(1);
  expect(query).toBeCalledWith(`
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
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockRejectedValueOnce(() => {
    throw new Error();
  })
  const result = await deviceTable.clearInstanceStatus('localhost')
  expect(query).toBeCalledTimes(1);
  expect(query).toBeCalledWith(`
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
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 0, oid: 0 })
  const isdeleted: boolean = await deviceTable.delete('4c4c4544-004b-4210-8033-b6c04f504633')
  expect(isdeleted).toBe(false)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    DELETE FROM devices 
    WHERE guid = $1 and tenantid = $2`, ['4c4c4544-004b-4210-8033-b6c04f504633',''])
})

test('Should get true when device deleted', async () => {
  const query = jest.spyOn(deviceTable.db, "query")
  query.mockResolvedValueOnce({ rows: [], command: '', fields: null, rowCount: 1, oid: 0 })
  const isdeleted: boolean = await deviceTable.delete('4c4c4544-004b-4210-8033-b6c04f504633', '4')
  expect(isdeleted).toBe(true)
  expect(query).toBeCalledTimes(1)
  expect(query).toBeCalledWith(`
    DELETE FROM devices 
    WHERE guid = $1 and tenantid = $2`, ['4c4c4544-004b-4210-8033-b6c04f504633','4'])
})