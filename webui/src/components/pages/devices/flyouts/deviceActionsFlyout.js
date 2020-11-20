/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { Flyout, FlyoutHeader, FlyoutContent, FlyoutCloseBtn, FlyoutTitle, Grid, Btn } from 'components/shared';

import './deviceActions.scss'
import Dropdown from 'components/shared/forms/dropdown';
import { FlyoutCell } from 'components/shared/grid/flyoutCell';
import { ToastContainer, toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'react-toastify/dist/ReactToastify.css';

export class DeviceActions extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      selectedAction: ''
    }
  }

  componentWillReceiveProps(prevState) {
    if (prevState.powerActionStatus.length > 0) {
      this.props.clearToastMessages()
    }
  }

 showNotification = (action) => {
    if (action !== 'KVM' || action !== "SOL" || action !== "Audit Log")
      this.setState({ selectedAction: action });
  }

  render() {
    const { className, onClose, handleSelectedAction, handleSelectItem, options, selectOptions, selectedDevices, powerActionStatus } = this.props;
    const isDisplay = selectedDevices && selectedDevices.length === 1
    return <React.Fragment>
      <Flyout className='device-actions'>
        <FlyoutHeader>
          <FlyoutTitle>Device Actions</FlyoutTitle>
          <FlyoutCloseBtn onClose={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          <Grid>
            {options.map(({ label, action, ...option }) => <FlyoutCell className="col-4" key={action}> <Btn {...option} label={label} action={action} onClick={() => {
              handleSelectedAction({ label, action });
              this.showNotification(label)
            }} isDisplay={isDisplay} className={className} /> <div style={{ fontSize: '10px', textAlign: "center" }}> {isDisplaylable(isDisplay, label) && label}</div></FlyoutCell>)}
            {isDisplay && <FlyoutCell className="col-4">
              <Dropdown options={selectOptions} handleSelectedItem={(item) => {
                handleSelectItem(item)
                this.showNotification(item.label)
              }} />
            </FlyoutCell>}
          </Grid>
          <ToastContainer position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover >
            {powerActionStatus.map((item) => item.title === "ERROR" ? toast.error(<ToastMessage {...item} />) : item.title === "SUCCESS" ? toast.success(<ToastMessage {...item} />) : toast.warning(<ToastMessage {...item} />))}
          </ToastContainer>
        </FlyoutContent>
      </Flyout>
    </React.Fragment>
  }
}

const isDisplaylable = (isDisplay, label) => isDisplay ? true : !isDisplay && label !== "KVM" && label !== "SOL" ? true : false;
const ToastMessage = ({ description, icon }) => <div><FontAwesomeIcon icon={icon} size="lg" /> {description}</div>