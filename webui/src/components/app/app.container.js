// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import {
  epics as appEpics,
  getTheme, getRpsStatus
} from 'store/reducers/appReducer';
import {
  epics as authEpics, getLoggedInStatus
} from 'store/reducers/authReducer'
import App from './app';

const mapStateToProps = state => ({
  theme: getTheme(state),
  isLoggedIn: getLoggedInStatus(state) || JSON.parse(window.sessionStorage.getItem('loggedIn')),
  isRps: getRpsStatus(state) || window.sessionStorage.getItem('isRps')
});

// Wrap with the router and wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  registerRouteEvent: pathname => dispatch(appEpics.actions.detectRouteChange(pathname)),
  logout: () => dispatch(authEpics.actions.logout())
});

const AppContainer = withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(App)));

export default AppContainer
