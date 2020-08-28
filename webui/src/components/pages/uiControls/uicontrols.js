/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import React from 'react';
import { AuditLog, KVM, Sol, MpsProvider } from 'mps-ui-toolkit';
import Config from 'app.config';
import {mpsConstants} from 'utilities'

export class UiControl extends React.Component {
    render() {
        const { match: { params } } = this.props;
        const data = {
            mpsKey: Config.mpsApiKey
        }
        return params.ui === mpsConstants.auditlog ? <MpsProvider data={data}><AuditLog deviceId={params.guid} mpsServer={Config.mpsServer} /></MpsProvider>:
            params.ui === mpsConstants.kvm ? <MpsProvider data={data}><KVM deviceId={params.guid} mpsServer={Config.mpsServer + '/relay'} mouseDebounceTime={200} canvasHeight={"100%"} canvasWidth={"100%"} autoConnect={false} /></MpsProvider> : params.ui === mpsConstants.sol ? <MpsProvider data={data}><Sol deviceId={params.guid} mpsServer={Config.mpsServer} /></MpsProvider> : ''
    }
}