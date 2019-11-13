/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/
import { AMTKeyCodeConverter } from "./AMTKeyCodeConverter";
import { ICommunicator } from "../ICommunicator";
import { CommsHelper } from "./CommsHelper";
import { Desktop } from "../Desktop";

export enum UpDown {
  Up = 0,
  Down = 1
}
/**
 * Provides helper functions to handle keyboard
 */
export class KeyBoardHelper {
  KeyInputGrab : boolean
  Comms: ICommunicator
  parent: Desktop
  constructor(parent: Desktop, comms: ICommunicator) {
    this.Comms = comms;
    this.parent = parent
  }
  /**
   * Starts grabbing keyboard events on the document object
   */
  GrabKeyInput() {
    if (this.KeyInputGrab == true) 
      return;
    document.onkeyup = this.handleKeyUp.bind(this);
    document.onkeydown = this.handleKeyDown.bind(this);
    document.onkeypress = this.handleKeys.bind(this);
    this.KeyInputGrab = true;
  }
  /**
   * releases event handlers used for keyboard event handling
   */
  UnGrabKeyInput() {
    if (this.KeyInputGrab == false) 
      return;
    document.onkeyup = null;
    document.onkeydown = null;
    document.onkeypress = null;
    this.KeyInputGrab = false;
  }
  handleKeys(e: Event) {
    return this.haltEvent(e)
  }
  /**
   * halts default keyboard event  handling. Since the sole purpose of this event is to send it to the remote desktop
   * @param e keyboard event
   */
  haltEvent(e: any) 
  { 
    if (e.preventDefault) 
      e.preventDefault(); 
    if (e.stopPropagation) 
      e.stopPropagation(); 
    return false; 
  }
  handleKeyUp(e: KeyboardEvent) : boolean
  { 
    return this.handleKeyEvent(UpDown.Up, e); 
  }
  handleKeyDown(e: KeyboardEvent) : boolean
  { 
    return this.handleKeyEvent(UpDown.Down, e); 
  }
  handleKeyEvent(d: UpDown, ke: KeyboardEvent): boolean {
    let e: any = ke
    if (!e) { e = window.event; }

    if (e.code) {
      // For new browsers, this mapping is keyboard language independent
      let k = AMTKeyCodeConverter.convertAMTKeyCode(e);
      this.parent.logger.verbose('Key' + d + ": " + k);
      if (k != null) { CommsHelper.sendKey(this.Comms, k, d); }
    } else {
      let k = e.keyCode;
      if (k == 173) k = 189; // '-' key (Firefox)
      if (k == 61) k = 187; // '=' key (Firefox)
      let kk = k;
      if (e.shiftKey == false && k >= 65 && k <= 90) kk = k + 32;
      if (k >= 112 && k <= 124) kk = k + 0xFF4E;
      if (k == 8) kk = 0xff08; // Backspace
      if (k == 9) kk = 0xff09; // Tab
      if (k == 13) kk = 0xff0d; // Return
      if (k == 16) kk = 0xffe1; // Shift (Left)
      if (k == 17) kk = 0xffe3; // Ctrl (Left)
      if (k == 18) kk = 0xffe9; // Alt (Left)
      if (k == 27) kk = 0xff1b; // ESC
      if (k == 33) kk = 0xff55; // PageUp
      if (k == 34) kk = 0xff56; // PageDown
      if (k == 35) kk = 0xff57; // End
      if (k == 36) kk = 0xff50; // Home
      if (k == 37) kk = 0xff51; // Left
      if (k == 38) kk = 0xff52; // Up
      if (k == 39) kk = 0xff53; // Right
      if (k == 40) kk = 0xff54; // Down
      if (k == 45) kk = 0xff63; // Insert
      if (k == 46) kk = 0xffff; // Delete
      if (k >= 96 && k <= 105) kk = k - 48; // Key pad numbers
      if (k == 106) kk = 42; // Pad *
      if (k == 107) kk = 43; // Pad +
      if (k == 109) kk = 45; // Pad -
      if (k == 110) kk = 46; // Pad .
      if (k == 111) kk = 47; // Pad /
      if (k == 186) kk = 59; // ;
      if (k == 187) kk = 61; // =
      if (k == 188) kk = 44; // ,
      if (k == 189) kk = 45; // -
      if (k == 190) kk = 46; // .
      if (k == 191) kk = 47; // /
      if (k == 192) kk = 96; // `
      if (k == 219) kk = 91; // [
      if (k == 220) kk = 92; // \
      if (k == 221) kk = 93; // ]t
      if (k == 222) kk = 39; // '
      this.parent.logger.verbose('Key' + d + ": " + k + " = " + kk);
      CommsHelper.sendKey(this.Comms, kk, d);
    }
    return this.haltEvent(e);
  }
}