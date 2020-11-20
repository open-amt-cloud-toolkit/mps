/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import React from 'react';
import { CiraEditor, RpsProvider } from 'mps-ui-toolkit'
import Config from 'app.config'

export class CiraConfigs extends React.Component {
    render() {
        const data = {
            rpsKey: Config.rpsApiKey
        }
        return(<RpsProvider data={data}>
               <CiraEditor rpsServer={Config.serviceUrls.rps} />
               </RpsProvider>
        )
    }
}