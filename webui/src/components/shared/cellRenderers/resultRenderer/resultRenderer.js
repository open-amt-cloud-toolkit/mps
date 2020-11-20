// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import React from 'react'

import { Svg } from 'components/shared/svg/svg'
import { svgs } from 'utilities'

import '../cellRenderer.scss'

export const ResultRenderer = ({ value, context: { t } }) => {
  const cellClasses = `pcs-renderer-cell ${value ? 'highlight' : ''}`
  console.log(value)
  return (
    <div className={cellClasses}>
      { value ? null : <Svg path={svgs.disabled} className='pcs-renderer-icon' /> }
      <div className='pcs-renderer-text'>
        { value.statusCode === '200' ? t('devices.grid.resultSuccess') : value === 'inprogress' ? t('devices.grid.Inprogress') : t('devices.grid.resultFailure') }
      </div>
    </div>
  )
}

export const ResultMessageRenderer = ({ value, context: { t } }) => {
  const cellClasses = `pcs-renderer-cell ${value ? 'highlight' : ''}`
  console.log(value)
  return (
    <div className={cellClasses}>

      <div className='pcs-renderer-text'>
        { value.statusCode === '400' ? value.message : '' }
      </div>
    </div>
  )
}

export const ResultPercentageRenderer = ({ value }) => {
  const cellClasses = `pcs-renderer-cell ${value ? 'highlight' : ''}`
  console.log(value)
  return (
    <div className={cellClasses}>
      <div className='pcs-renderer-text'>
        { (value || '0') + '%' }
      </div>
    </div>
  )
}
