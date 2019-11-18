/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import * as React from 'react';
require("./purecanvas.scss");

export interface PureCanvasProps {
  contextRef: (ctx: CanvasRenderingContext2D) => void
  mouseDown: (event: React.MouseEvent) => void
  mouseUp: (event: React.MouseEvent) => void
  mouseMove: (event: React.MouseEvent) => void
  mouseWheel: (event: React.MouseEvent) => void
  canvasHeight: string
  canvasWidth: string
}

export class PureCanvas extends React.Component<PureCanvasProps, {}> {
  constructor(props: PureCanvasProps) {
    super(props);
  }
  
  shouldComponentUpdate() 
  { 
    return false; 
  }
  
  render() {
    
    let canvasAttributes : React.CanvasHTMLAttributes<HTMLCanvasElement> = {
      width:"400",
      height:"600",
      onContextMenu: (e) => {e.preventDefault(); return false;},
      onMouseDown: this.props.mouseDown,
      onMouseUp: this.props.mouseUp,
      onMouseMove: this.props.mouseMove,
      onWheel: this.props.mouseWheel
    }
    return (
        <canvas {...canvasAttributes} className="canvas" ref={c => c ? this.props.contextRef(c.getContext('2d')) : null}/> 
    )
  }
}

