/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import React from 'react';
import { DomainEditor, RpsProvider } from 'mps-ui-toolkit';
import Config from 'app.config'

export class Domains extends React.Component {
    render() {
        const data = {
            rpsKey: Config.rpsApiKey
        }
        return(
            <RpsProvider data={data}><DomainEditor rpsServer={Config.serviceUrls.rps}/></RpsProvider>
        )
    }
}