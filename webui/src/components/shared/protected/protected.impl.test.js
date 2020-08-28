/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { ProtectedImpl } from './protected.impl'
import { Profiles } from '../../pages/profiles/profiles'

describe('Test Protected component', () => {
    it('should render the component without crashing', () => {
        const wrapper = shallow(<ProtectedImpl />);
        expect(wrapper.find('Redirect')).toHaveLength(1)
    })

    it('should render the RPS component when rps flag is enabled', () => {
        const protectedProps = {
            isRpsEnabled: true,
            isLoggedIn: true,
            component: Profiles
        }
        const wrapper = shallow(<ProtectedImpl {...protectedProps} />);
        expect(wrapper.find('Profiles')).toHaveLength(1)
    })
})