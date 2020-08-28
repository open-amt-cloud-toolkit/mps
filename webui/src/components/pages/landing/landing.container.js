// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Landing } from './landing'
import { redux as appRedux, getRpsStatus } from 'store/reducers/appReducer'
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { getLoggedInStatus } from 'store/reducers/authReducer';

const mapStateToProps = state => ({
    isRps: getRpsStatus(state) || window.sessionStorage.getItem('isRps'),
    isLoggedIn: getLoggedInStatus(state) || JSON.parse(window.sessionStorage.getItem('loggedIn'))
});
const mapDispatchToProps = dispatch => ({
    setRpsStatus: isRps => dispatch(appRedux.actions.updateRpsStatus(isRps))
});

export const LandingContainer = compose(withTranslation(), withRouter, connect(mapStateToProps, mapDispatchToProps))(Landing)
