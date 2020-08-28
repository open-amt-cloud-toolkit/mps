/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import Config from 'app.config'
import { PageContent, AjaxError, Grid, Cell } from 'components/shared';

import './dashboard.scss';

export class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    this.props.fetchDevices();
    this.connectionStatusControl();
  }

  connectionStatusControl = () => {
    let protocol = window.location.protocol === "https:" ? "https" : "http";
    let retry_timer = 0;
    let updateConnectionSocket = new WebSocket(window.location.protocol.replace(protocol, "wss") + "//" + Config.mpsServer + "/notifications/control.ashx")
    updateConnectionSocket.onopen = () => {
      if (retry_timer !== 0) {
        clearInterval(retry_timer);
        retry_timer = 0;
      }
    }

    updateConnectionSocket.onclose = () => {
      retry_timer = setInterval(() => {
        // updateConnectionSocket.onopen = null
        // updateConnectionSocket.onmessage = null
        // updateConnectionSocket.onclose = null;
        updateConnectionSocket = null;
        this.connectionStatusControl();
      }, 5000);
    }

    updateConnectionSocket.onmessage = () => {
      setTimeout(() => { this.props.fetchDevices() }, 200);
    }
  }

  navigateUser = filterString => {
    this.props.history.push({
      pathname: '/mps/devices',
      filter: filterString
    })
  }

  render() {
    const { connected, disconnected, error, t } = this.props;
    const totalDevices = (connected + disconnected)|| 0;
    return (
      <React.Fragment>
        <PageContent className='dashboard-page-container' key="page-content">
          <h1 style={{ display: 'block', textAlign: 'center' }}>{t('dashboard.header')} </h1>
          {error && <AjaxError error={error} t={t} />}
          {/* {!error &&
            <PropertyGrid>
              <PropertyGridHeader>
                <PropertyRow>
                  <PropertyCell className='col-3'>
                    <span>{t('landing.deviceDetails')}</span>
                  </PropertyCell>
                  <PropertyCell className='col-3'>
                    <span>{t('landing.count')}</span>
                  </PropertyCell>
                </PropertyRow>

              </PropertyGridHeader>
              <PropertyGridBody>
                <PropertyRow className='property-row'>
                  <PropertyCell className='col-3'>
                    <span>{t('landing.totalDevices')} </span>
                  </PropertyCell>
                  <PropertyCell className='col-3'>
                    <a style={{ cursor: 'pointer' }} onClick={e => this.navigateUser()}><b> {totalDevices}</b> </a>
                  </PropertyCell>
                </PropertyRow >
                <PropertyRow className='property-row'>
                  <PropertyCell className='col-3'>
                    <span> {t('landing.connectedDevices')} </span>
                  </PropertyCell>
                  <PropertyCell className='col-3'>
                    <a style={{ cursor: 'pointer' }} onClick={e => this.navigateUser('connected')}><b> {connected}</b> </a>
                  </PropertyCell>
                </PropertyRow>
                <PropertyRow className='property-row'>
                  <PropertyCell className='col-3'>
                    <span>{t('landing.disconnectedDevices')}</span>
                  </PropertyCell>
                  <PropertyCell className='col-3'>
                    <a style={{ cursor: 'pointer' }} onClick={e => this.navigateUser('disconnected')}> <b>{disconnected}</b></a>
                  </PropertyCell>
                </PropertyRow>
              </PropertyGridBody>
            </PropertyGrid>
          } */}

          <Grid>
            <Cell className='col-2'>
              <div className={`stat-cell total ${totalDevices === connected ? 'allConnected': 'fewConnected'}`} id="total" onClick={e => this.navigateUser()}>
                <div className='stat-text'>{t('dashboard.totalDevices')} </div>
                <div className='stat-value'><b> {totalDevices}</b></div>
              </div>
              <div className='stat-cell connected' id="connected" onClick={e => this.navigateUser('connected')}>
                <div className='stat-text' > {t('dashboard.connectedDevices')} </div>
                <div className='stat-value'><b> {connected}</b></div>
              </div>
              <div className='stat-cell disconnected' id="disconnected" onClick={e => this.navigateUser('disconnected')}>
                <div className='stat-text' >{t('dashboard.disconnectedDevices')}</div>
                <div className='stat-value'><b>{disconnected}</b></div>
              </div>
            </Cell>
          </Grid>
        </PageContent>
      </React.Fragment>)
  }
}
