/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

class TestEvent implements Event
{
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: EventTarget;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  returnValue: boolean;
  srcElement: EventTarget;
  target: EventTarget;
  timeStamp: number;
  type: string;
  code: string;
  shiftKey: boolean;
  preventDefaultVar: boolean;
  stopPropagationVar: boolean;

  composedPath(): EventTarget[] {
    return null;
  }

  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
  }

  preventDefault(): void {
    this.preventDefaultVar = true;
  }
 
  stopImmediatePropagation(): void {
  }
 
  stopPropagation(): void {
    this.stopPropagationVar = true;
  }
 
  AT_TARGET: number;
  BUBBLING_PHASE: number;
  CAPTURING_PHASE: number;
  NONE: number;
}

export { TestEvent }