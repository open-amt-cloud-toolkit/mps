/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { DeviceActions } from './deviceActionsFlyout';
import { getPowerActionStatus, getDisaplayMesage, redux as appRedux } from 'store/reducers/deviceReducer'


const mapStateToProps = (state) => ({
    powerActionStatus: getPowerActionStatus(state),
        isDisplayMessage: getDisaplayMesage(state)
});

const mapDispatchToProps = (dispatch) => ({
    setDisplayMessage: () => dispatch(appRedux.actions.setDisplayMessage()),
    clearToastMessages:()=>dispatch(appRedux.actions.clearToastMessages())
})

export const FlyoutContainer = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DeviceActions));
