// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React, { Component } from 'react';

import { Breadcrumbs } from './breadcrumbs';
import ProfileImagePath from 'assets/images/profile.png';

import './header.scss';

const profileDropdown = 'profileDropdown';

const parentHasClass = (element, ...searchClasses) => {
  if (
    typeof element.className === 'string' &&
    element.className
      .split(' ')
      .some(classname =>
        searchClasses.some(searchClass => searchClass === classname)
      )
  ) return true;
  return element.parentNode && parentHasClass(element.parentNode, ...searchClasses);
};


/** The header component for the top of the page */
class Header extends Component {

  constructor(props) {
    super(props);

    this.state = { openDropdown: '' };
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleWindowMousedown);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleWindowMousedown);
  }

  handleWindowMousedown = ({ target }) => {
    const isMenuTrigger = parentHasClass(target, 'menu-item', 'menu-trigger');
    if (!isMenuTrigger && this.state.openDropdown) {
      this.setState({ openDropdown: '' });
    }
  }

  logout = () => {
    this.setState({ openDropdown: '' });
    this.props.logout();
  }

  toggleDropdown = (openDropdown) => () => this.setState({ openDropdown });

  render() {
    return (
      <React.Fragment>
      <header className="app-header" role="banner">
        <div className="breadcrumbs">
          <Breadcrumbs t={this.props.t} />
        </div>
        <div className="label">{ this.props.t('header.appName') }</div>
        <div className="items-container">
          <div className="menu-container">
            <button className="item-icon profile menu-trigger" onClick={this.toggleDropdown(profileDropdown)}>
              <img src={ProfileImagePath} alt={ this.props.t('header.profile') } />
            </button>
            {
              this.state.openDropdown === profileDropdown &&
              <div className="menu">
                <button className="menu-item" onClick={this.logout}>{ this.props.t('header.logout') }</button>
              </div>
            }
          </div>
        </div>
      </header>
      </React.Fragment>
    );
  }
};

export default Header;
