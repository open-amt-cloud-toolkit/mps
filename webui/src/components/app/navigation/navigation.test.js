/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';
import Navigation from './navigation';
import { Expect } from 'rxjs-marbles';

const fakeProps = {
    t: () => { },
    tabs: [],
    isDefaultLogo: true,
    logo: "/static/media/contoso.831a7bd7.svg",
    location: {
        pathname: '/landing'
    }
}

describe('navigation component', () => {
    it('Rendering without crashing', () => {
        const wrapper = shallow(<Navigation {...fakeProps} />)
    })
    it('click on close icon', () => {
        const fakeClickFunction = jest.fn();
        const wrapper = shallow(<Navigation.WrappedComponent {...fakeProps} onClick={fakeClickFunction} />)
        wrapper.setState({
            prevPath: [{
                iconName: 'desktop',
                iconColor: '#8034eb',
                iconSize: 'sm',
                action: "KVM",
                label: "KVM",
                uuid: "777cae70-2c7b-4954-b867-54b2038d3e74",
            }]
        })

        wrapper.find("#closeicon").simulate("click", { stopPropagation: () => { } })

        expect(fakeClickFunction.mock.calls.length).toEqual(0)
    })
})

