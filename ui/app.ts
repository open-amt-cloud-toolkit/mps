import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ui from './reactjs/components/KVM'

const e = React.createElement;
const domContainer = document.querySelector('#kvm');
ReactDOM.render(e(ui.KVM), domContainer);