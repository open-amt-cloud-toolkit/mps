/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
// import { IDbCreator } from './interfaces/IDbCreator'
// import { IDomainsDb } from './interfaces/IDomainsDb'
import { mapToMetadata } from './mapToMetadata'
// import { DUPLICATE_DOMAIN_FAILED, API_UNEXPECTED_EXCEPTION } from '../utils/constants'
// import { AMTDomain } from '../models/Rcs'
// import { RPSError } from '../utils/RPSError'
import { logger as log } from '../utils/logger'
import { DeviceMetadata } from '../models'
import { PostgresDb } from '.'
import { IMetadataDb } from '../interfaces/IDeviceDb'
import { Environment } from '../utils/Environment'

export class MetadataDb implements IMetadataDb {
  db: PostgresDb
  constructor (db?: PostgresDb) {
    this.db = db ?? new PostgresDb(Environment.Config.connection_string)
  }

  /**
   * @description Get all from DB
   * @returns {DeviceMetadata[]} returns an array of objects
   */
  async get (): Promise<DeviceMetadata[]> {
    const results = await this.db.query('SELECT * FROM devices')
    return results.rows.map(p => {
      const result = mapToMetadata(p)
      return result
    })
  }

  async getDistinctTags (): Promise<string[]> {
    const results = await this.db.query('SELECT DISTINCT unnest(tags) as tag FROM Devices')
    return results.rows.map(p => {
      return p.tag
    })
  }

  async getByTags (tags: string[], method: string): Promise<DeviceMetadata[]> {
    let results
    if (method === 'AND') {
      results = await this.db.query('SELECT * FROM devices WHERE tags @> $1', [tags])
    } else { // assume OR
      results = await this.db.query('SELECT * FROM devices WHERE tags && $1', [tags])
    }
    return results.rows.map(p => {
      const result = mapToMetadata(p)
      return result
    })
  }

  /**
   * @description Get from DB by name
   * @param {string} guid
   * @returns {DeviceMetadata} Domain object
   */
  async getById (guid: string): Promise<DeviceMetadata> {
    const results = await this.db.query('SELECT * FROM devices WHERE guid = $1', [guid])
    let domain: DeviceMetadata = null
    if (results.rowCount > 0) {
      domain = mapToMetadata(results.rows[0])
    }
    return domain
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

  /**
   * @description Insert into DB
   * @param {DeviceMetadata} amtDomain
   * @returns {boolean} Return true on successful insertion
   */
  async insert (deviceMetadata: DeviceMetadata): Promise<DeviceMetadata> {
    try {
      const results = await this.db.query('INSERT INTO devices(guid, hostname, tags) values($1, $2, ARRAY(SELECT json_array_elements_text($3)))',
        [
          deviceMetadata.guid,
          deviceMetadata.hostname,
          JSON.stringify(deviceMetadata.tags)
        ])
      if (results.rowCount > 0) {
        return await this.getById(deviceMetadata.guid)
      }
      return null
    } catch (error) {
      log.error(`Failed to insert: ${deviceMetadata.guid}`, error)
      throw new Error(error)
    //   if (error.code === '23505') { // Unique key violation
    //     throw new RPSError(DUPLICATE_DOMAIN_FAILED(deviceMetadata.profileName), 'Unique key violation')
    //   }
    //   throw new RPSError(API_UNEXPECTED_EXCEPTION(deviceMetadata.profileName))
    }
  }

  /**
   * @description Update into DB
   * @param {DeviceMetadata} deviceMetadata object
   * @returns {boolean} Return true on successful update
   */
  async update (deviceMetadata: DeviceMetadata): Promise <DeviceMetadata> {
    try {
      const results = await this.db.query('UPDATE devices SET hostname=$2, tags=$3 WHERE guid=$1',
        [
          deviceMetadata.guid,
          deviceMetadata.hostname,
          deviceMetadata.tags
        ])
      if (results.rowCount > 0) {
        const metadata = await this.getById(deviceMetadata.guid)
        return metadata
      }
      return null
    } catch (error) {
      log.error(`Failed to update: ${deviceMetadata.guid}`, error)
    //   if (error.code === '23505') { // Unique key violation
    //     throw new RPSError(DUPLICATE_DOMAIN_FAILED(deviceMetadata.profileName), 'Unique key violation')
    //   }
    //   throw new RPSError(API_UNEXPECTED_EXCEPTION(deviceMetadata.profileName))
    }
  }
}
