/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as React from 'react'
require("./connectbutton.scss")

export interface ConnectProps {
  kvmstate: number
  handleConnectClick: (e: any) => void
}

export class ConnectButton extends React.Component<ConnectProps, {}> {

  constructor(props: ConnectProps) {
    super(props);
  }


  render() {
    return (
      <button className="button" onClick={this.props.handleConnectClick}>
        {this.props.kvmstate == 1 ? 'Connecting' : (this.props.kvmstate == 2 ? 'Disconnect' : 'Connect')}
      </button>
    )
  }
}