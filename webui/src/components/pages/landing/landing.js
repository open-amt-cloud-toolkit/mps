/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { Btn } from 'components/shared';
import Config from 'app.config';
import { Redirect } from 'react-router-dom'

import './landing.scss'


export class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    this.props.setRpsStatus('')
  }

  navigateUser = isRps => {
    this.props.setRpsStatus(isRps)
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.isRps !== prevProps.isRps) {
      if (this.props.isRps === 'RPS') {
        this.props.history.push('/rps/profiles');
      } else if (this.props.isRps === 'MPS') {
        this.props.history.push('/mps/dashboard')
      }
    }
  }

  render() {
    const { isLoggedIn, t } = this.props;
    return (
      <React.Fragment>
        {!isLoggedIn && <Redirect to='/login' />}
        <div>
          <Btn className='domain-buttons mps-button' onClick={() => this.navigateUser('MPS')}>{t('landing.mps')}</Btn>

        </div>
        <div> {Config.rpsEnabled && <Btn className='domain-buttons rps-button' onClick={() => this.navigateUser('RPS')}>{t('landing.rps')}</Btn>}</div>
      </React.Fragment>)
  }
}
