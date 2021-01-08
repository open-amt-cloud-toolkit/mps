// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
// App Components
import Main from './main/main';
import NavigationContainer from 'components/app/navigation/navigationContainer';
import Header from 'components/app/header/header';
import { Protected } from '../shared'
// Page Components
import {
  PageNotFoundContainer as PageNotFound,
  LoginContainer as LoginPage,
  DashboardContainer as DashboardPage,
  DevicesContainer as DevicesPage,
  UiControlsContainer as UiControlsPage,
  LandingContainer as LandingPage,
  CiraConfigsContainer as CiraConfigsPage,
  ProfilesContainer as ProfilesPage,
  DomainsContainer as DomainsPage,
  NetworkConfigsContainer as NetworksPage
} from '../pages';

import './app.scss';

//font-awesome icons library creation
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';


//adds all the solid-svg icons into the library to prevent eplicit imports
const iconList = Object
  .keys(Icons)
  .filter(key => key !== "fas" && key !== "prefix")
  .map(icon => Icons[icon])
library.add(...iconList)



/** The navigation tab configurations */
const dashboardTab = { to: '/mps/dashboard', svg: '', labelId: 'Dashboard' };
const devicesTab = { to: '/mps/devices', svg: '', labelId: 'Devices' };
const profilesTab = { to: '/rps/profiles', svg: '', labelId: 'Profiles' }
const ciraConfigsTab = { to: '/rps/ciraConfigs', svg: '', labelId: 'CIRA Configs' };
const domainsTab = { to: '/rps/domains', svg: '', labelId: 'Domains' };
const networksTab = { to: '/rps/networkconfigs', svg: '', labelId: 'Network Configs'}
const tabConfigsMPS = [dashboardTab, devicesTab];
const tabConfigsRPS = [profilesTab, networksTab,  ciraConfigsTab, domainsTab];
/** The base component for the app */
class App extends Component {

  componentDidMount() {
    const { history, registerRouteEvent } = this.props;
    // Initialize listener to inject the route change event into the epic action stream
    history.listen(({ pathname }) => registerRouteEvent(pathname));
  }

  render() {
    const { isLoggedIn, t, theme, logout, history, isRps } = this.props;
    return (
      <div className={`app-container theme-${theme}`}>
        <div className="app">
          {!isLoggedIn && <Redirect exact from='/' to='/login' />}
          {(isLoggedIn && isRps === 'MPS') && <NavigationContainer tabs={tabConfigsMPS} t={t} />}
          {(isLoggedIn && isRps === 'RPS') && <NavigationContainer tabs={tabConfigsRPS} t={t} />}
          <Main>
            {isLoggedIn && <Header logout={logout} t={t} history={history} />}
            <Switch>
              <Redirect exact from="/" to='/login' />
              <Route exact path="/login" component={LoginPage} />
              <Protected exact path='/mps/dashboard' component={DashboardPage} />
              <Protected exact path='/mps/devices' component={DevicesPage} />
              <Protected exact path='/rps/profiles' component={ProfilesPage} />
              <Protected exact path='/rps/ciraconfigs' component={CiraConfigsPage} />
              <Protected exact path='/rps/domains' component={DomainsPage} />
              <Protected exact path='/rps/networkconfigs' component={NetworksPage} />
              <Route exact path='/:ui/:guid' component={UiControlsPage} />
              <Route exact path='/landing' component={LandingPage} />

              <Route component={PageNotFound} />
            </Switch>

          </Main>
        </div>
      </div>
    );
  }

}

export default App;
