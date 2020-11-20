/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';
import { Devices } from './devices';
import { DeviceActions } from './flyouts/deviceActionsFlyout';
import { options } from './flyouts/options';

const fakeProps = {
    sendPowerAction: (params) => { },
    setselectedDevies: (params) => { },
    selectedDevices: [],
    location: {},
    mpsServer: "localhost:9300",
    t: () => { },
    powerActionStatus: []
};

describe('Devices Component', () => {
    it('Renders without crashing', () => {

        const wrapper = shallow(
            <Devices {...fakeProps} />
        );
    });
    it('test getSelectedDevices() in devices page', () => {
        var expectedObj = [{
            host: "777cae70-2c7b-4954-b867-54b2038d3e74",
            amtuser: "admin",
            mpsuser: "xenial",
            icon: 1,
            conn: 1,
            name: "NewNUC2"

        }]
        const wrapper = shallow(<Devices  {...fakeProps} />)
        wrapper.setState({
            selectedDevices: expectedObj
        })
        expect(wrapper.state('selectedDevices').length).toBe(1)
    });

    it('test getOpenFlyout() in devices page', () => {
        const wrapper = shallow(<Devices  {...fakeProps} />)
        wrapper.setState({
            openFlyout: 'open'
        })
        expect(wrapper.state('openFlyout')).toEqual('open');
    });

    it('test closeFlyout() in devices page', () => {
        const wrapper = shallow(<Devices {...fakeProps} />)
        expect(wrapper.state('openFlyout')).toEqual('');
    });

    it('test methods in devices page', () => {
        const wrapper = shallow(<Devices {...fakeProps} />)
        var expectedObj = [{
            host: "777cae70-2c7b-4954-b867-54b2038d3e74",
            amtuser: "admin",
            mpsuser: "xenial",
            icon: 1,
            conn: 1,
            name: "NewNUC2"

        }]
        wrapper.setState({
            selectedDevices: expectedObj
        })
        expect(typeof wrapper.instance().getSelectedDevices).toBe('function');
        expect(typeof wrapper.instance().closeFlyout).toBe('function');
        expect(typeof wrapper.instance().handleSelectedAction).toBe('function');
        expect(typeof wrapper.instance().handleSelectItem).toBe('function');
        expect(typeof wrapper.instance().getOpenFlyout).toBe('function');
        expect(typeof wrapper.state('selectedDevices')).toBe('object');
        expect(typeof wrapper.state('openFlyout')).toBe('string');
    });

    it('render flyout component without crashing', () => {
        const props = {
            ...fakeProps,
            options
        }
        const wrapper = shallow(<DeviceActions {...props} />)
    })
     it('test selected action', () => {
        const props = {
            ...fakeProps,
            options
        }
        const wrapper = shallow(<DeviceActions {...props} />)
        wrapper.setState({
            selectedAction: 'Power Cycle'
        })
        expect(wrapper.state('selectedAction')).toEqual('Power Cycle')
    })

});
