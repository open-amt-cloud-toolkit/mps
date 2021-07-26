/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { logger as log } from '../utils/logger'
import { PostgresDb } from '.'
import { IDeviceDb } from '../interfaces/IDeviceDb'
import { Environment } from '../utils/Environment'
import { Device } from '../models/models'
import { mapToDevice } from './mapToDevice'
import { MPSValidationError } from '../utils/MPSValidationError'
import { DEFAULT_SKIP, DEFAULT_TOP } from '../utils/constants'

export class DeviceDb implements IDeviceDb {
  db: PostgresDb
  constructor (db?: PostgresDb) {
    this.db = db ?? new PostgresDb(Environment.Config.connection_string)
  }

  async getCount (): Promise<number> {
    const result = await this.db.query('SELECT count(*) OVER() AS total_count FROM devices', [])
    let count = 0
    if (result != null) {
      count = Number(result?.rows[0]?.total_count)
    }
    return count
  }

  /**
   * @description Get all devices from DB
   * @returns {Device[]} returns an array of objects
   */
  async get (top: number = DEFAULT_TOP, skip: number = DEFAULT_SKIP): Promise<Device[]> {
    const results = await this.db.query('SELECT * FROM devices ORDER BY guid LIMIT $1 OFFSET $2', [top, skip])
    return results.rows.map(p => {
      const result = mapToDevice(p)
      return result
    })
  }

  /**
   * @description Get a device from DB by guid
   * @param {string} guid
   * @returns {Device} Device object
   */
  async getById (guid: string): Promise<Device> {
    const results = await this.db.query('SELECT * FROM devices WHERE guid = $1', [guid])
    let domain: Device = null
    if (results.rowCount > 0) {
      domain = mapToDevice(results.rows[0])
    }
    return domain
  }

  async getByTags (tags: string[], method: string, top: number = DEFAULT_TOP, skip: number = DEFAULT_SKIP): Promise<Device[]> {
    let results
    if (method === 'AND') {
      results = await this.db.query('SELECT * FROM devices WHERE tags @> $1 ORDER BY guid LIMIT $2 OFFSET $3', [tags, top, skip])
    } else { // assume OR
      results = await this.db.query('SELECT * FROM devices WHERE tags && $1 ORDER BY guid LIMIT $2 OFFSET $3', [tags, top, skip])
    }
    return results.rows.map(p => {
      const result = mapToDevice(p)
      return result
    })
  }

  async getDistinctTags (): Promise<string[]> {
    const results = await this.db.query('SELECT DISTINCT unnest(tags) as tag FROM Devices')
    return results.rows.map(p => {
      return p.tag
    })
  }

  /**
   * @description Insert a device into DB
   * @param {Device} device
   * @returns {boolean} Return true on successful insertion
   */
  async insert (device: Device): Promise<Device> {
    try {
      const results = await this.db.query('INSERT INTO devices(guid, hostname, tags, mpsinstance, connectionstatus, mpsusername) values($1, $2, ARRAY(SELECT json_array_elements_text($3)), $4, $5, $6)',
        [
          device.guid,
          device.hostname,
          JSON.stringify(device.tags),
          device.mpsInstance,
          device.connectionStatus,
          device.mpsusername
        ])
      if (results.rowCount > 0) {
        return await this.getById(device.guid)
      }
      return null
    } catch (error) {
      log.error(`Failed to insert: ${device.guid}`, error)
      if (error.code === '23505') { // Unique key violation
        throw new MPSValidationError(`Device ID: ${device.guid} already exists`, 400, 'Unique key violation')
      }
      throw new MPSValidationError(`Failed to insert device: ${device.guid}, error: ${error}`, 500)
    }
  }

  /**
  * @description Update into DB
  * @param {Device} deviceMetadata object
  * @returns {boolean} Return true on successful update
  */
  async update (device: Device): Promise <Device> {
    try {
      const results = await this.db.query('UPDATE devices SET tags=$2, hostname=$3, mpsinstance=$4, connectionstatus=$5, mpsusername=$6 WHERE guid=$1',
        [
          device.guid,
          device.tags,
          device.hostname,
          device.mpsInstance,
          device.connectionStatus,
          device.mpsusername
        ])
      if (results.rowCount > 0) {
        return await this.getById(device.guid)
      }
      throw new MPSValidationError(`Failed to update device: ${device.guid}`, 400)
    } catch (error) {
      log.error(`Failed to update: ${device.guid}`, error)
      throw new MPSValidationError(`Failed to update device: ${device.guid}, error: ${error}`, 500)
    }
  }

  /**
  * @description Clear the mpsInstance for associated devices before process exit
  * @param {string} mpsInstance
  * @returns {void}
  */
  clearInstanceStatus (mpsInstance: string): void {
    try {
      const results = this.db.query('UPDATE devices SET mpsinstance=$2, connectionstatus=$3 WHERE mpsinstance=$1',
        [
          mpsInstance,
          null,
          false
        ])
      log.debug('Clean DB instance before exit', results)
    } catch (error) {
      log.error('Failed to update DB:', error)
    }
  }

  /**
  * @description Delete from DB by name
  * @param {string} guid
  * @returns {boolean} Return true on successful deletion
  */
  async delete (guid): Promise<boolean> {
    const results = await this.db.query('DELETE FROM devices WHERE guid = $1', [guid])
    if (results.rowCount > 0) {
      return true
    }
    return false
  }
}
