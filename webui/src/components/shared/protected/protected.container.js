// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { connect } from 'react-redux';
import { getRpsEnabledStatus } from 'store/reducers/appReducer';
import { getLoggedInStatus } from 'store/reducers/authReducer';
import { ProtectedImpl } from './protected.impl';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
  isRpsEnabled: getRpsEnabledStatus(state),
  isLoggedIn: getLoggedInStatus(state) || JSON.parse(window.sessionStorage.getItem('loggedIn'))
});

export const Protected = compose(withTranslation(), withRouter,connect(mapStateToProps, null))(ProtectedImpl);
