// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './styles/btn.scss';

export const Btn = ({ children, className, primary, icon, iconName, iconColor, iconSize, isDisplay, label, ...btnProps }) =>  <React.Fragment>
  {isDisplay && iconName && <button key={label} type="button" className={joinClasses('icon-btn', className)} {...btnProps} ><FontAwesomeIcon title={label} icon={iconName} color={iconColor} size={iconSize} /></button>}
  {isDisplay === false && iconName !== 'desktop' && iconName !== 'terminal' && <button key={label} type="button" className={joinClasses('icon-btn', className)} {...btnProps} >
    <FontAwesomeIcon title={label} icon={iconName} color={iconColor} size={iconSize} />   </button>}
  {children && <button type="button" {...btnProps} className={joinClasses('btn', className, primary ? 'btn-primary' : 'btn-secondary')}><div className="btn-text">{children}</div></button>}
</React.Fragment>

Btn.propTypes = {
  className: PropTypes.string,
  primary: PropTypes.bool,
  svg: PropTypes.string
};
