/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

class TestMouseEvent implements MouseEvent
{
    altKey: boolean;    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
    x: number;
    y: number;
    getModifierState(keyArg: string): boolean {
        throw new Error("Method not implemented.");
    }
    initMouseEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget): void {
        throw new Error("Method not implemented.");
    }
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
    composedPath(): EventTarget[] {
        return null;
    }
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
    }
    preventDefault(): void {
        TestMouseEvent.preventDefaultvar++;
    }
    stopImmediatePropagation(): void {
    }
    stopPropagation(): void {
        TestMouseEvent.stopPropagationvar++;
    }
    AT_TARGET: number;
    BUBBLING_PHASE: number;
    CAPTURING_PHASE: number;
    NONE: number;
    static preventDefaultvar = 0;
    static stopPropagationvar = 0;

    
}

export { TestMouseEvent }