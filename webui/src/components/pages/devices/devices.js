/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { DeviceGrid, MpsProvider } from 'mps-ui-toolkit';
import { options, selectOptions } from './flyouts/options';
import { FlyoutContainer } from './flyouts/deviceActionsFlyout.container';
import Config from 'app.config';
import { mpsConstants } from 'utilities'

export class Devices extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedDevices: '',
            openFlyout: ''
        }
    }
    getSelectedDevices = (selectedDevices) => {
        this.props.setselectedDevies(selectedDevices)
        this.setState({ selectedDevices: selectedDevices }, () => {
            this.setState({
                openFlyout: this.state.selectedDevices && this.state.selectedDevices.length ? 'open' : ''
            })
        })
    }

    closeFlyout = () => this.setState({ openFlyout: '' })

    handleSelectedAction = (item) => {
        const payload = {
            guid: this.state.selectedDevices[0].host,
            action: item.action
        }
        if (item.action === mpsConstants.kvm || item.action === mpsConstants.sol) {
            this.props.history.push(`/${payload.action}/${payload.guid}`, payload)
        } else {
            this.state.selectedDevices.forEach(selectedDevice => {
                this.props.sendPowerAction({ guid: selectedDevice.host, action: item.action });
            })
        }
    }

    handleSelectItem = (item) => {
        const payload = {
            guid: this.state.selectedDevices[0].host,
            action: item.action
        }
        if (item.action === mpsConstants.auditlog) {
            this.props.history.push(`/${payload.action}/${payload.guid}`, payload)

        } else {
            this.props.sendPowerAction(payload)
        }
    }

    getOpenFlyout = () => {
        switch (this.state.openFlyout) {
            case 'open':
                const flyoutProps = {
                    options,
                    selectOptions,
                    handleSelectedAction: this.handleSelectedAction,
                    handleSelectItem: this.handleSelectItem,
                    onClose: this.closeFlyout,
                    selectedDevices: this.state.selectedDevices,
                    className: 'rightnavpadding'
                }
                return <FlyoutContainer {...flyoutProps} />;
            default:
                return null;
        }
    }
    render() {
        const data = {
            mpsKey: Config.mpsApiKey
        }
        return (
            <React.Fragment>
                <MpsProvider data={data}>
                    <DeviceGrid mpsServer={Config.mpsServer} getSelectedDevices={(items) => this.getSelectedDevices(items)} filter={this.props.location.filter} selectedDevices={this.props.selectedDevices} />
                </MpsProvider>
                {this.getOpenFlyout()}
            </React.Fragment>
        )
    }
}