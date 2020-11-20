// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React, { Component } from 'react';
import { isFunc } from 'utilities';
import { Redirect } from 'react-router-dom';

export class ProtectedImpl extends Component {

  render() {
    const { component, isRpsEnabled, isLoggedIn } = this.props;
    const currentURL = window.location.href
    const isMpsRoute = currentURL.includes('/#/mps/');
    const Component = component;
    return <>{ ((isRpsEnabled | isMpsRoute) && isLoggedIn) ? <Component /> : !isLoggedIn ? <Redirect to='/login' />:<Redirect to='/landing' />}</>
  }
};
