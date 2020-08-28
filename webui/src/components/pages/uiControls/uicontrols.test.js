/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { UiControl } from './uicontrols';

describe('UiControl Component', () => {

    it('Renders KVM without crashing', () => {

        const fakeProps = {
            match: {
                params: {
                    ui: 'KVM',
                    guid: '777cae70-2c7b-4954-b867-54b2038d3e74' 
                }
            },
            mpsServer: "localhost:9300",
            t: () => { },
        };

        const wrapper = shallow(
            <UiControl {...fakeProps} />
        );
    });
    it('Renders sol without crashing', () => {
        const fakeProps = {
            match: {
                params: {
                    ui: 'sol',
                    guid: '777cae70-2c7b-4954-b867-54b2038d3e74'
                }
            },
            mpsServer: "localhost:9300",
            t: () => { },
        };

        const wrapper = shallow(
            <UiControl {...fakeProps} />
        );
    });
    it('Renders auditlog without crashing', () => {

        const fakeProps = {
            match: {
                params: {
                    ui: 'auditlog',
                    guid: '777cae70-2c7b-4954-b867-54b2038d3e74'
                    }
            },
            mpsServer: "localhost:9300",
            t: () => { },
        };

        const wrapper = shallow(
            <UiControl {...fakeProps} />
        );
    });
});
