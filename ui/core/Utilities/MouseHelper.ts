/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/
import { ICommunicator } from "../ICommunicator";
import { Desktop } from "../Desktop";
import { TypeConverter } from "../converter";
import { ImageHelper } from "./imageHelper";

/**
 * Mousehelper provides helper functions for handling mouse events. mouseup, mousedown, mousemove
 */
export class MouseHelper {
  parent: Desktop
  comm: ICommunicator
  MouseInputGrab: boolean
  lastEvent: any
  debounceTime: number
  mouseClickCompleted: boolean
  constructor(parent: Desktop, comm: ICommunicator, debounceTime: number) {
    this.parent = parent
    this.comm = comm
    this.debounceTime = debounceTime
    this.mouseClickCompleted = true
    this.lastEvent = null
  }

  GrabMouseInput() {
    if (this.MouseInputGrab == true) return;
    let c = this.parent.canvasCtx.canvas;
    // c.onmouseup = this.mouseup;
    // c.onmousedown = this.mousedown;
    // c.onmousemove = this.mousemove;
    //if (navigator.userAgent.match(/mozilla/i)) c.DOMMouseScroll = obj.xxDOMMouseScroll; else c.onmousewheel = obj.xxMouseWheel;
    this.MouseInputGrab = true;
  }

  UnGrabMouseInput() {
    if (this.MouseInputGrab == false) return;
    var c = this.parent.canvasCtx.canvas;
    c.onmousemove = null;
    c.onmouseup = null;
    c.onmousedown = null;
    //if (navigator.userAgent.match(/mozilla/i)) c.DOMMouseScroll = null; else c.onmousewheel = null;
    this.MouseInputGrab = false;
  }

  mousedown(e: React.MouseEvent) {
    this.parent.buttonmask |= (1 << e.button);
    return this.mousemove(e);
  }
  mouseup(e: React.MouseEvent) {
    this.parent.buttonmask &= (0xFFFF - (1 << e.button));
    return this.mousemove(e);
  }
  mousemove(e: React.MouseEvent) {
    if (this.parent.state != 4) return true;
    let pos = this.getPositionOfControl(this.parent.canvasControl);
    this.parent.lastMouseX = (e.pageX - pos[0]) * (this.parent.canvasControl.height / this.parent.canvasControl.offsetHeight);
    this.parent.lastMouseY = ((e.pageY - pos[1] + (this.parent.scrolldiv ? this.parent.scrolldiv.scrollTop : 0)) * (this.parent.canvasControl.width / this.parent.canvasControl.offsetWidth));


    if (this.parent.noMouseRotate != true) {
      this.parent.lastMouseX2 = ImageHelper.crotX(this.parent, this.parent.lastMouseX, this.parent.lastMouseY);
      this.parent.lastMouseY = ImageHelper.crotY(this.parent, this.parent.lastMouseX, this.parent.lastMouseY);
      this.parent.lastMouseX = this.parent.lastMouseX2;
    }

    this.comm.send(String.fromCharCode(5, this.parent.buttonmask) + TypeConverter.ShortToStr(this.parent.lastMouseX) + TypeConverter.ShortToStr(this.parent.lastMouseY));


    // Update focus area if we are in focus mode
    this.parent.setDeskFocus('DeskFocus', this.parent.focusMode);
    if (this.parent.focusMode != 0) {
      let x = Math.min(this.parent.lastMouseX, this.parent.canvasControl.width - this.parent.focusMode),
        y = Math.min(this.parent.lastMouseY, this.parent.canvasControl.height - this.parent.focusMode),
        df = this.parent.focusMode * 2,
        c = this.parent.canvasControl,
        qx = c.offsetHeight / this.parent.canvasControl.height,
        qy = c.offsetWidth / this.parent.canvasControl.width,
        q = this.parent.getDeskFocus('DeskFocus'),
        ppos = this.getPositionOfControl(this.parent.canvasControl.parentElement);
      q.left = (Math.max(((x - this.parent.focusMode) * qx), 0) + (pos[0] - ppos[0])) + 'px';
      q.top = (Math.max(((y - this.parent.focusMode) * qy), 0) + (pos[1] - ppos[1])) + 'px';
      q.width = ((df * qx) - 6) + 'px';
      q.height = ((df * qx) - 6) + 'px';
    }

    return this.haltEvent(e);
  }
  haltEvent(e: any) 
  { 
    if (e.preventDefault) 
      e.preventDefault(); 
    if (e.stopPropagation) 
      e.stopPropagation(); 
    return false; 
  }
  getPositionOfControl(c: HTMLElement) {
    let Position = Array(2);
    Position[0] = Position[1] = 0;
    let control: HTMLElement = c
    while (control) {
      Position[0] += control.offsetLeft;
      Position[1] += control.offsetTop;
      control = <HTMLElement>control.offsetParent;
    }
    return Position;
  }

}