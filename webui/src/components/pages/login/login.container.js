/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {Login} from './login';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom'
import {epics as authEpics, getLoggedInStatus, getLoginError } from 'store/reducers/authReducer'


const mapStateToProps = state => ({
  isLoggedIn: getLoggedInStatus(state) || JSON.parse(window.sessionStorage.getItem('loggedIn')),
  error: getLoginError(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  userLogin: formValues => dispatch(authEpics.actions.userLogin(formValues))
});

export const LoginContainer = compose(withTranslation(), withRouter, connect(mapStateToProps, mapDispatchToProps))(Login);
