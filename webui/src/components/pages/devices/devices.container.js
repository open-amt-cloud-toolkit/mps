/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Devices } from './devices';
import { epics as deviceEpics, redux as appRedux, getSelectedDevices } from 'store/reducers/deviceReducer';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const mapDispatchToProps = dispatch => ({
    sendPowerAction: requestParams => dispatch(deviceEpics.actions.sendPowerAction(requestParams)),
    setselectedDevies: selectedDevices => dispatch(appRedux.actions.updateSelectedDevices(selectedDevices))
});

const mapStateToProps = state => ({
    selectedDevices: getSelectedDevices(state)
})

//export const DevicesContainer = withTranslation()((withRouter, connect(mapStateToProps, mapDispatchToProps))(Devices));
export const DevicesContainer = compose(withTranslation(), withRouter, connect(mapStateToProps, mapDispatchToProps))(Devices)