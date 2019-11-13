/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { Desktop } from "../Desktop";
import { TypeConverter } from "../converter"
import { ICommunicator } from "../ICommunicator"
export class CommsHelper {

  static sendRefresh(parent: Desktop, comm: ICommunicator) {
    if (parent.holding == true) return;

    if (parent.focusMode > 0) {
      // Request only pixels around the last mouse position
      var df = parent.focusMode * 2;
      comm.send(String.fromCharCode(3, 1) +
        TypeConverter.ShortToStr(Math.max(Math.min(parent.oldMouseX, parent.lastMouseX) - parent.focusMode, 0)) +
        TypeConverter.ShortToStr(Math.max(Math.min(parent.oldMouseY, parent.lastMouseY) - parent.focusMode, 0)) +
        TypeConverter.ShortToStr(df + Math.abs(parent.oldMouseX - parent.lastMouseX)) +
        TypeConverter.ShortToStr(df + Math.abs(parent.oldMouseY - parent.lastMouseY))); // FramebufferUpdateRequest
      parent.oldMouseX = parent.lastMouseX;
      parent.oldMouseY = parent.lastMouseY;
    } else {
      // Request the entire screen
      comm.send(String.fromCharCode(3, 1, 0, 0, 0, 0) +
        TypeConverter.ShortToStr(parent.rwidth) +
        TypeConverter.ShortToStr(parent.rheight)); // FramebufferUpdateRequest

    }
  }
  static sendKey(comm: ICommunicator, k: any, d: number) {
    if (typeof k == 'object') { for (var i in k) { CommsHelper.sendKey(comm, k[i][0], k[i][1]); } }
    else { comm.send(String.fromCharCode(4, d, 0, 0) + TypeConverter.IntToStr(k)); }
  }

  static sendKvmData(parent: Desktop, comm: ICommunicator, x: any) {
    if (parent.onKvmDataAck !== true) {
      parent.onKvmDataPending.push(x);
    } else {
      if (parent.urlvars && parent.urlvars['kvmdatatrace']) { console.log('KVM-Send(' + x.length + '): ' + x); }
      x = '\0KvmDataChannel\0' + x;
      comm.send(String.fromCharCode(6, 0, 0, 0) + TypeConverter.IntToStr(x.length) + x);
      parent.onKvmDataAck = false;
    }
  }

  static sendKeepAlive(parent: Desktop, comm: ICommunicator) {
    if (parent.lastKeepAlive < Date.now() - 5000) {
      parent.lastKeepAlive = Date.now();
      comm.send(String.fromCharCode(6, 0, 0, 0) + TypeConverter.IntToStr(16) + '\0KvmDataChannel\0');
    }
  }
  static sendCtrlAltDelMsg(comm: ICommunicator) {
    CommsHelper.sendCad(comm)
  }
  static sendCad(comm: ICommunicator) {
    CommsHelper.sendKey(comm, 0xFFE3, 1); // Control
    CommsHelper.sendKey(comm, 0xFFE9, 1); // Alt
    CommsHelper.sendKey(comm, 0xFFFF, 1); // Delete
    CommsHelper.sendKey(comm, 0xFFFF, 0); // Delete
    CommsHelper.sendKey(comm, 0xFFE9, 0); // Alt
    CommsHelper.sendKey(comm, 0xFFE3, 0); // Control
  }
}