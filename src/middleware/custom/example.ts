/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export default (req, res, next): any => {
  // Add custom middleware logic here
  // Example use-cases would be handling custom authentication tokens, adding trace IDs, debugging requests, etc...

  // You can access the Database interface by using req.db
  // You can access the secret provide instance by using req.secrets

  // For example setting properties on the secret provider and database implementations:
  // req.secrets.myToken = req.headers['x-header-token']
  // req.db.customProperty = req.headers['x-db-info']

  // For setting the tenantId use req.tenantId
  // req.tenantId = req.headers['x-tenant-id-token'] // pull tenant id from header
  req.tenantId = '' // default blank tenant
  // Be sure to reject requests that do not have access to the tenant
  //   if (req.tenantId === <resource's>.tenantId) {
  //     next()
  //   } else {
  //     res.send(401).end()
  //   }

  // ensure next is called when appropriate, or return an error code using res
  next()
}
