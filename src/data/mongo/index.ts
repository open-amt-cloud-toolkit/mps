/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { MongoClient, type Db } from 'mongodb'
import { type IDB } from '../../interfaces/IDb'
import { type IDeviceTable } from '../../interfaces/IDeviceTable'
import { MongoDeviceTable } from './collections/device'
import { logger } from '../../logging'

export default class MongoDB implements IDB {
  db: Db
  devices: IDeviceTable

  constructor (connectionString: string) {
    MongoClient.connect(connectionString).then(async (client) => {
      // Use or create the 'mpsdb' database
      this.db = client.db('mpsdb')
      this.devices = new MongoDeviceTable(this.db)
      try {
      // Check if 'devices' collection exists, if not create it
        const collections = await this.db.listCollections({ name: 'devices' }).toArray()
        if (collections.length === 0) {
          // Collection doesn't exist, create it
          this.db?.createCollection('devices').then(() => {
            logger.info('Devices collection created successfully.')
          }).catch(err => {
            logger.error('Failed to create devices collection:', err)
          })
        } else {
          logger.info('Devices collection already exists.')
        }
      } catch (err) {
        logger.error('Failed to determine collections:', err)
      }
    }).catch(err => {
      logger.error('MongoDB connection failed:', err)
      throw err // rethrow error to be caught by the caller
    })
  }

  // this funciton conforms to the interface of IDB, but is only used for ensuring the database is up and running.
  async query (text: string, params?: any): Promise<boolean> {
    try {
      // Attempt to get the database stats as a health check
      if (this.db == null) { return false }
      const stats = await this.db.stats()
      return stats.ok === 1 // If "ok" field is 1, the server is up and working properly.
    } catch (err) {
      // Log the error for debugging purposes
      console.error('Database health check failed:', err)
      return false
    }
  }
}
