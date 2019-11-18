/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as React from 'react';
import {ConnectButton, ConnectProps} from '../reactjs/components/connectbutton'
import {shallow} from 'enzyme'

describe('Test ConnectButton',()=>{

  it('Test render() in ConnectButton with kvmstate == 1',()=>{
    // Initialization of ConnectProps
    let connectbuttonprops : ConnectProps= {
      kvmstate: (1),
      handleConnectClick: (event: React.MouseEvent) => {}        
    };

    const cb = shallow(<ConnectButton {...connectbuttonprops}  />);
    
    // Output
    expect(cb.prop('onClick')).toBe(connectbuttonprops.handleConnectClick);
    expect(cb.prop('children')).toBe('Connecting');
    expect(cb).toMatchSnapshot();
    console.log(cb.debug());
    console.log(cb.props());
  });

  it('Test render() in ConnectButton with kvmstate == 2',()=>{
    // Initialization of ConnectProps
    let connectbuttonprops : ConnectProps= {
      kvmstate: (2),
      handleConnectClick: (event: React.MouseEvent) => {}        
    };

    const cb = shallow(<ConnectButton {...connectbuttonprops}  />);
    
    // Output
    expect(cb.prop('onClick')).toBe(connectbuttonprops.handleConnectClick);
    expect(cb.prop('children')).toBe('Disconnect');
    expect(cb).toMatchSnapshot();
    console.log(cb.debug());
    console.log(cb.props());
  });

  it('Test render() in ConnectButton with kvmstate == 0',()=>{
    // Initialization of ConnectProps
    let connectbuttonprops : ConnectProps= {
      kvmstate: (0),
      handleConnectClick: (event: React.MouseEvent) => {}        
    };

    const cb = shallow(<ConnectButton {...connectbuttonprops}  />);
    
    // Output
    expect(cb.prop('onClick')).toBe(connectbuttonprops.handleConnectClick);
    expect(cb.prop('children')).toBe('Connect');
    expect(cb).toMatchSnapshot();
    console.log(cb.debug());
    console.log(cb.props());
  });
});

  


