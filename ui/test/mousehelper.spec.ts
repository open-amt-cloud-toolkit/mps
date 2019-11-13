/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { MouseHelper } from "../core/Utilities/MouseHelper";

// classes defined for Unit testing
import { AmtDesktop } from "./helper/testdesktop"
import { Communicator } from "./helper/testcommunicator"
import { TestEvent } from "./helper/testEvent"
import { TestMouseEvent } from "./helper/testmouseevent"

describe("Test MouseHelper", () => {

    it('Test GrabMouseInput: MouseInputGrab == false', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        var mousehelper = new MouseHelper(desktop, comm, 0);
        mousehelper.MouseInputGrab = false;
        desktop.canvasCtx.canvas.onmouseup = null;
        desktop.canvasCtx.canvas.onmousedown = null;
        desktop.canvasCtx.canvas.onmousemove = null;

        // Test GrabMouseInput
        mousehelper.GrabMouseInput();

        // Output
        expect(mousehelper.MouseInputGrab).toBe(true);
    });

    it('Test GrabMouseInput: MouseInputGrab == true', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        var mousehelper = new MouseHelper(desktop, comm, 0);
        mousehelper.MouseInputGrab = true;
        desktop.canvasCtx.canvas.onmouseup = null;
        desktop.canvasCtx.canvas.onmousedown = null;
        desktop.canvasCtx.canvas.onmousemove = null;

        // Test GrabMouseInput
        mousehelper.GrabMouseInput();

        // Output
        expect(desktop.canvasCtx.canvas.onmouseup).toBe(null);
        expect(desktop.canvasCtx.canvas.onmousedown).toBe(null);
        expect(desktop.canvasCtx.canvas.onmousemove).toBe(null);
        expect(mousehelper.MouseInputGrab).toBe(true);
    });

    it('Test UnGrabMouseInput: MouseInputGrab == true', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        var mousehelper = new MouseHelper(desktop, comm, 0);
        mousehelper.MouseInputGrab = true;
        desktop.canvasCtx.canvas.onmouseup = mousehelper.mouseup;
        desktop.canvasCtx.canvas.onmousedown = mousehelper.mousedown;
        desktop.canvasCtx.canvas.onmousemove = mousehelper.mousemove;

        // Test UnGrabMouseInput
        mousehelper.UnGrabMouseInput();

        // Output
        expect(desktop.canvasCtx.canvas.onmouseup).toBe(null);
        expect(desktop.canvasCtx.canvas.onmousedown).toBe(null);
        expect(desktop.canvasCtx.canvas.onmousemove).toBe(null);
        expect(mousehelper.MouseInputGrab).toBe(false);
    });

    it('Test UnGrabMouseInput: MouseInputGrab == false', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        var mousehelper = new MouseHelper(desktop, comm, 0);
        mousehelper.MouseInputGrab = false;
        desktop.canvasCtx.canvas.onmouseup = mousehelper.mouseup;
        desktop.canvasCtx.canvas.onmousedown = mousehelper.mousedown;
        desktop.canvasCtx.canvas.onmousemove = mousehelper.mousemove;

        // Test UnGrabMouseInput
        mousehelper.UnGrabMouseInput();

        // Output
        desktop.canvasCtx.canvas.onmouseup = mousehelper.mouseup;
        desktop.canvasCtx.canvas.onmousedown = mousehelper.mousedown;
        desktop.canvasCtx.canvas.onmousemove = mousehelper.mousemove;
        expect(mousehelper.MouseInputGrab).toBe(false);
    });

    it('Test haltEvent', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        var mousehelper = new MouseHelper(desktop, comm, 0);
        var e = new TestMouseEvent();
        mousehelper.MouseInputGrab = false;
        TestMouseEvent.preventDefaultvar = 0;
        TestMouseEvent.stopPropagationvar = 0;

        // Test haltEvent
        mousehelper.haltEvent(e);

        // Output
        expect(TestMouseEvent.preventDefaultvar).toBe(1);
        expect(TestMouseEvent.stopPropagationvar).toBe(1);

    });
});