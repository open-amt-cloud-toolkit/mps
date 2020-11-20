/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { CiraConfigs } from './ciraconfigs'

describe('Test ciraconfigs page', () => {
    it('should render the component without crashing', () => {
        const wrapper = shallow(<CiraConfigs />);
        expect(typeof wrapper).toBe("object")
    })
})