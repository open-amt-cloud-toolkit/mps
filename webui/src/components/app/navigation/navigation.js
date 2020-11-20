// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// import { Svg, Btn } from "components/shared";
import {  Btn } from "components/shared";
import { withRouter } from "react-router-dom";

import "./navigation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/** A window size less than this will automatically collapse the left nav */
const minExpandedNavWindowWidth = 800;

/**
 * A presentational component for nav item svgs
 *
 * @param {ReactSVGProps} props see https://www.npmjs.com/package/react-svg
 */
// const NavIcon = (props) => <Svg {...props} className="nav-item-icon" />;

/** A presentational component navigation tab links */
const TabLink = (props) => (
  <NavLink to={props.to} className="nav-item" activeClassName="active">
    {/* <NavIcon path={props.svg} /> */}
    <div className="nav-item-text">{props.t(props.labelId)}</div>
  </NavLink>
);

/** The navigation component for the left navigation */
class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      lastWidth: window.innerWidth,
      prevPath: [],
    };
  }

  componentDidMount() {
    // Collapse the nav if the window width is too small
    window.addEventListener("resize", this.collapseNav);
  }

  componentWillReceiveProps(nextprops) {
    let action = this.props.location.pathname.split("/");
    if (
      nextprops.location !== this.props.location &&
      action.length === 3 &&
      this.state.prevPath.length < 10 &&
      (action[1] === "KVM" || action[1] === "sol" || action[1] === "auditlog")
    ) {
      let options = [
        ...this.state.prevPath,
        {
          iconName:
            action[1] === "KVM"
              ? "desktop"
              : action[1] === "sol"
              ? "terminal"
              : action[1] === "auditlog"
              ? "list"
              : "",
          iconColor:
            action[1] === "KVM"
              ? "#8034eb"
              : action[1] === "sol"
              ? "#ffffff"
              : action[1] === "auditlog"
              ? "#fcdf6e"
              : "",
          iconSize: "sm",
          action: action[1],
          label: action[1],
          uuid: action[2],
        },
      ];
      let uniqueValues = options.filter(
        (v, i, a) =>
          a.findIndex((t) => t.action === v.action && t.uuid === v.uuid) === i
      );
       this.setState({ prevPath: uniqueValues });
    }
  }

  handleCloseControl = (action, uuid) => {
    const filterControls = this.state.prevPath.filter(
      (control) => `${control.action}-${control.uuid}` !== `${action}-${uuid}`
    );
     this.setState({
      prevPath: filterControls,
    });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.collapseNav);
  }

  collapseNav = () => {
    if (
      window.innerWidth < minExpandedNavWindowWidth &&
      window.innerWidth < this.state.lastWidth && // When the window is shrinking
      !this.state.collapsed
    ) {
      this.setState({ collapsed: true, lastWidth: window.innerWidth });
    } else {
      this.setState({ lastWidth: window.innerWidth });
    }
  };

  toggleExpanded = (event) => {
    this.setState({ collapsed: !this.state.collapsed }, () =>
      window.dispatchEvent(new Event("resize"))
    );
  };

  handleRedirectControl = (action, uuid) =>
    this.props.history.push(`/${action}/${uuid}`);

  navigateToHome = () => this.props.history.push("/landing");

  render() {
    const isExpanded = !this.state.collapsed;
    // const { name, logo, isDefaultLogo, t, getLogoPending, tabs } = this.props;
    const { t,tabs } = this.props;
    const currentTab = this.props.location.pathname.split("/");
    return (
      <React.Fragment>
        <nav className={`app-nav ${isExpanded && "expanded"}`}>
          <div className="nav-item company">
            <FontAwesomeIcon
              icon="home"
              size="2x"
              onClick={this.navigateToHome}
            />
            {/* {
              getLogoPending
                ? <Indicator size="medium" />
                : isDefaultLogo
                  ? <NavIcon path={logo} />
                  : <div className="nav-item-icon">
                    <img src={logo} alt="Logo" />
                  </div>
            }
            {!getLogoPending && <div className="nav-item-text" onClick={this.navigateToHome}>Home</div>} */}
          </div>
          {tabs.map((tabProps, i) => (
            <TabLink {...tabProps} t={t} key={i} />
          ))}
          {this.state.prevPath.length ? (
            <React.Fragment>
              <div className="tab-separator"></div>
              <div className="separator-header">Open Tabs</div>
              {this.state.prevPath.map(({ label, action, uuid, ...option }) => (
                <div
                  className="open-windows"
                  key={`${action} - ${uuid}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.handleRedirectControl(action, uuid);
                  }}
                  title={`${action} - ${uuid}`}
                >
                  {!(
                    `${currentTab[1]}/${currentTab[2]}` === `${action}/${uuid}`
                  ) && (
                    <div
                      id="closeicon"
                      style={{
                        position: "absolute",
                        right: "16px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleCloseControl(action, uuid);
                      }}
                    >
                      <FontAwesomeIcon
                        icon="times-circle"
                        size="sm"
                        color={"#e65d4e"}
                      />
                    </div>
                  )}

                  <Btn
                    {...option}
                    isDisplay={true}
                    className={"leftnavpadding"}
                  />
                  {`  ${action} / ${uuid}`}
                </div>
              ))}
            </React.Fragment>
          ) : (
            ""
          )}
        </nav>
      </React.Fragment>
    );
  }
}

export default withRouter(Navigation);
