import * as React from 'react'
import { EncodingOptions } from './encodingoptions'

export interface IDesktopSettings {
  changeDesktopSettings: (settings: any) => void
  getConnectState: () => number
}

export class DesktopSettings extends React.Component<IDesktopSettings> {
  desktopsettings = {
    encoding: 1
  };

  constructor(props: IDesktopSettings) {
    super(props);
    this.changeEncoding = this.changeEncoding.bind(this);
  }

  changeEncoding(encoding: number) {
    this.desktopsettings.encoding = encoding;
    this.props.changeDesktopSettings(this.desktopsettings);
  }

  render() {
    return (
      <EncodingOptions changeEncoding={this.changeEncoding} getConnectState={this.props.getConnectState}/>
    )
  }
}