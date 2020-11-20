// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { Svg } from 'components/shared/svg/svg';
import { svgs } from 'utilities';

import '../cellRenderer.scss';

export const ConnectionStatusRenderer = ({ value , context: { t } }) => {
  const cellClasses = `pcs-renderer-cell ${value === t('devices.grid.connected') ? 'highlight' : ''}`;
  return (
    <div className={cellClasses}>
      { value === t('devices.grid.connected')? null : <Svg path={svgs.disabled} className="pcs-renderer-icon" /> }
      <div className="pcs-renderer-text">
        { value === t('devices.grid.connected')? t('devices.grid.connected') : t('devices.grid.offline') }
      </div>
    </div>
  );
}

export const StatusValueGetter = ( params ) => {
    if ((params.data.tags || {}).connected !== undefined) {
      return params.data.tags.connected === 'y' ? 'Connected': 'Offline';
    } else return 'Offline';
}

export const JobDeviceStatusValueGetter = ( params ) => {
    if ((params.data || {}).isConnected !== undefined) {
      return params.data.isConnected ? 'Connected': 'Offline';
    } else return 'Offline';
}
