// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Crumb = ({ children }) => <div className="crumb">{ children }</div>

const DashboardCrumbs = ({ t }) => <Crumb>{t('tabs.dashboard')}</Crumb>;
const DevicesCrumbs = ({ t }) => <Crumb>{t('tabs.devices')}</Crumb>;

export const Breadcrumbs = ({ t }) => (
  <Switch>
    <Route exact path={'/dashboard'} render={props => <DashboardCrumbs {...props} t={t} />} />
    <Route exact path={'/devices'} render={props => <DevicesCrumbs {...props} t={t} />} />
  </Switch>
);
