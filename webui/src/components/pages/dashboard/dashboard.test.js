/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { Dashboard } from './dashboard'

global.WebSocket = jest.fn();
const dashboardProps = {
    devices: () => { },
    connected: 0,
    disconnected: 3,
    error: () => { },
    logout: () => { },
    fetchDevices: () => { },
    t: () => { },
    history: { push: jest.fn()}
}
describe('Landing component', () => {
    it('should load the component without crashing', () => {
        const wrapper = shallow(<Dashboard {...dashboardProps} />)
    })

    it('should call the navigate user on click of device counts', ()=> {
        const wrapper = shallow(<Dashboard {...dashboardProps}/>)
        const navigateUserSpy = jest.spyOn(wrapper.instance(), 'navigateUser')
        const totalDeviceCount = wrapper.find('#total');
        totalDeviceCount.simulate('click')

        expect(navigateUserSpy).toHaveBeenCalled()

        const connectedDeviceCount = wrapper.find('#connected');
        connectedDeviceCount.simulate('click')
        expect(navigateUserSpy).toHaveBeenCalled()

        const disconnectedDeviceCount = wrapper.find('#disconnected');
        disconnectedDeviceCount.simulate('click')
        expect(navigateUserSpy).toHaveBeenCalled()
    })
})