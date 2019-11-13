/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as React from 'react';
import {IHeaderProps, Header} from '../reactjs/components/header'
import {shallow} from 'enzyme'

describe('Testing Header',()=>{
  it('Test render() in Header',()=>{
    // Initialization of IHeaderProps
    let headerprops : IHeaderProps= {
        kvmstate: 1, 
        handleConnectClick: (testFunc2),
        changeDesktopSettings: (testFunc3),
        getConnectState: (testFunc1)     
    };

    const he = shallow(<Header {...headerprops}  />);
    let myInstance = he.instance() as Header;
    
    // Output    
    expect(he.find('ConnectButton').prop('handleConnectClick')).toBe(testFunc2);
    expect(he.find('ConnectButton').prop('kvmstate')).toBe(1);
    expect(he.find('DesktopSettings').prop('changeDesktopSettings')).toBe(testFunc3);
    expect(he.find('DesktopSettings').prop('getConnectState')).toBe(testFunc1);
    var ret = expect(he).toMatchSnapshot();
    console.log(he.debug());
    console.log(he.props());
  });
});

function testFunc1(): number{
  return 1;
}

class TestClass
{
  encoding: number;
}

var value1 = 0;

function testFunc2(v: TestClass): void{
  value1 = v.encoding;
}

function testFunc3(v: TestClass): void{
  value1 = v.encoding;  
}
  


