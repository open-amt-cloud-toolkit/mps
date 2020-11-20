/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import './grid.scss';

export const FlyoutCell = ({ className, children }) => (
  <div className={className}>
    <div className="grid-cell-contents">
      { children }
    </div>
  </div>
);
