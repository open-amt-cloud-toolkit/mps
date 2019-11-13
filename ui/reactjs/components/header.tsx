import * as React from 'react'
import { ConnectButton } from './connectbutton'
import { DesktopSettings } from './desktopsettings'
require("./header.scss");

export interface IHeaderProps {
  kvmstate: number
  
  handleConnectClick: (e: any) => void
  changeDesktopSettings: (settings: any) => void
  getConnectState: () => number
}

export class Header extends React.Component<IHeaderProps> {

  constructor(props: IHeaderProps) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <ConnectButton handleConnectClick={this.props.handleConnectClick} kvmstate={this.props.kvmstate} />
        <DesktopSettings changeDesktopSettings={this.props.changeDesktopSettings} getConnectState={this.props.getConnectState}/>
      </div >
    )
  }
}