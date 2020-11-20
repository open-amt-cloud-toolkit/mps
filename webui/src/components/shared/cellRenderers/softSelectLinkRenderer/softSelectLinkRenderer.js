// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from "react";

import { isFunc } from 'utilities';

import '../cellRenderer.scss';

export class SoftSelectLinkRenderer extends Component {

  onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // const { context, rowIndex } = this.props;
    const { context, data } = this.props;
    context.onSoftSelectChange(data.id);
  };

  render() {
    const { value, context } = this.props;
    return (
      isFunc(context.onSoftSelectChange)
        ? <a href="" className="soft-select-link-cell" onClick={this.onClick}>{ value }</a>
        : value
    );
  }
}
