/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

class TestKeyBoardEvent implements KeyboardEvent
{
    altKey: boolean;    char: string;
    charCode: number;
    code: string;
    ctrlKey: boolean;
    isComposing: boolean;
    key: string;
    keyCode: number;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    getModifierState(keyArg: string): boolean {
        return false;
    }
    DOM_KEY_LOCATION_LEFT: number;
    DOM_KEY_LOCATION_NUMPAD: number;
    DOM_KEY_LOCATION_RIGHT: number;
    DOM_KEY_LOCATION_STANDARD: number;
    detail: number;
    view: Window;
    which: number;
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

export { TestKeyBoardEvent }