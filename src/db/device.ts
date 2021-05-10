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

export class DeviceDb implements IDeviceDb {
  db: PostgresDb
  constructor (db?: PostgresDb) {
    this.db = db ?? new PostgresDb(Environment.Config.connection_string)
  }

  /**
   * @description Get all devices from DB
   * @returns {Device[]} returns an array of objects
   */
  async get (): Promise<Device[]> {
    const results = await this.db.query('SELECT * FROM devices')
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

  async getByTags (tags: string[], method: string): Promise<Device[]> {
    let results
    if (method === 'AND') {
      results = await this.db.query('SELECT * FROM devices WHERE tags @> $1', [tags])
    } else { // assume OR
      results = await this.db.query('SELECT * FROM devices WHERE tags && $1', [tags])
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
      const results = await this.db.query('INSERT INTO devices(guid, hostname, tags, mpsinstance, connectionstatus) values($1, $2, ARRAY(SELECT json_array_elements_text($3)), $4, $5)',
        [
          device.guid,
          device.hostname,
          JSON.stringify(device.tags),
          device.mpsInstance,
          device.connectionStatus
        ])
      if (results.rowCount > 0) {
        return await this.getById(device.guid)
      }
      return null
    } catch (error) {
      log.error(`Failed to insert: ${device.guid}`, error)
      throw new Error(error)
    //   if (error.code === '23505') { // Unique key violation
    //     throw new RPSError(DUPLICATE_DOMAIN_FAILED(deviceMetadata.profileName), 'Unique key violation')
    //   }
    //   throw new RPSError(API_UNEXPECTED_EXCEPTION(deviceMetadata.profileName))
    }
  }

  /**
  * @description Update into DB
  * @param {Device} deviceMetadata object
  * @returns {boolean} Return true on successful update
  */
  async update (device: Device): Promise <Device> {
    try {
      const results = await this.db.query('UPDATE devices SET tags=$2, hostname=$3, mpsinstance=$4, connectionstatus=$5 WHERE guid=$1',
        [
          device.guid,
          device.tags,
          device.hostname,
          device.mpsInstance,
          device.connectionStatus
        ])
      if (results.rowCount > 0) {
        return await this.getById(device.guid)
      }
      return null
    } catch (error) {
      log.error(`Failed to update: ${device.guid}`, error)
    }
  }

  /**
  * @description Clear the mpsInstance for associated devices before process exit
  * @param {string} mpsInstance
  * @returns {void}
  */
  updateByInstance (mpsInstance: string): void {
    try {
      const results = this.db.query('UPDATE devices SET mpsinstance=$2, connectionstatus=$3 WHERE mpsinstance=$1',
        [
          mpsInstance,
          null,
          false
        ])
      log.info('Clean DB instance before exit', results)
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
