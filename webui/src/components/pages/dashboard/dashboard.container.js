// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Dashboard } from './dashboard'
import { epics as deviceEpics, getDevices, getConnectedDevicesCount, getDisconnectedDevicesCount, getDevicesError } from 'store/reducers/deviceReducer'
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
  devices: getDevices(state),
  connected: getConnectedDevicesCount(state),
  disconnected: getDisconnectedDevicesCount(state),
  error: getDevicesError(state)
});
const mapDispatchToProps = dispatch => ({
  fetchDevices: () => dispatch(deviceEpics.actions.fetchDevices())

});

//export const DashboardContainer = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
export const DashboardContainer = compose(withTranslation(), withRouter,connect(mapStateToProps, mapDispatchToProps))(Dashboard)
