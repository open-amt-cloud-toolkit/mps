/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Domains } from './domains'

describe('Test Domains page', () => {
    it('should render the component without crashing', () => {
        const wrapper = shallow(<Domains />);
        expect(typeof wrapper).toBe("object")
    })
})