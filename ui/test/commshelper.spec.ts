/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { Communicator } from"./helper/testcommunicator"
import { AmtDesktop } from"./helper/testdesktop"
import { CommsHelper } from"../core/Utilities/CommsHelper"

describe("Test CommsHelper", () => {

    it('Test sendRefresh for focusMode == 0', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        desktop.holding = false;
        Communicator.sentData = '';
        desktop.focusMode = 0;
        desktop.rwidth = 80;
        desktop.rheight = 60;

        // Test sendRefresh
        CommsHelper.sendRefresh(desktop, comm);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(3);
        expect(Communicator.sentData.charCodeAt(1)).toBe(1);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(0);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0);
        expect(Communicator.sentData.charCodeAt(7)).toBe(80);
        expect(Communicator.sentData.charCodeAt(8)).toBe(0);
        expect(Communicator.sentData.charCodeAt(9)).toBe(60);
    });

    it('Test sendRefresh for focusMode > 0', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        desktop.holding = false;
        Communicator.sentData = '';
        desktop.focusMode = 1;
        desktop.rwidth = 120;
        desktop.rheight = 60;
        desktop.oldMouseX = 155;
        desktop.oldMouseY = 215;
        desktop.lastMouseX = 152;
        desktop.lastMouseY = 222;

        // Test sendRefresh
        CommsHelper.sendRefresh(desktop, comm);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(3);
        expect(Communicator.sentData.charCodeAt(1)).toBe(1);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(151);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(214);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0);
        expect(Communicator.sentData.charCodeAt(7)).toBe(5);
        expect(Communicator.sentData.charCodeAt(8)).toBe(0);
        expect(Communicator.sentData.charCodeAt(9)).toBe(9);
        expect(desktop.oldMouseX).toBe(152);
        expect(desktop.oldMouseY).toBe(222);
    });

    it('Test sendRefresh for parent.holding == true', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        desktop.holding = true;
        Communicator.sentData = 'Test';
        desktop.focusMode = 1;
        desktop.rwidth = 120;
        desktop.rheight = 60;
        desktop.oldMouseX = 155;
        desktop.oldMouseY = 215;
        desktop.lastMouseX = 152;
        desktop.lastMouseY = 222;

        // Test sendRefresh
        CommsHelper.sendRefresh(desktop, comm);

        // Output
        expect(Communicator.sentData).toBe('Test');
    });

    it('Test sendKey', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        desktop.holding = true;
        Communicator.sentData = '';
        var k = 20;
        var d = 50;

        // Test sendKey
        CommsHelper.sendKey(comm, k, d);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(4);
        expect(Communicator.sentData.charCodeAt(1)).toBe(50);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(0);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0);
        expect(Communicator.sentData.charCodeAt(7)).toBe(20);
    });

    it('Test sendKey with Object', () => {

        // Input
        var comm = new Communicator();
        Communicator.sentData = '';
        var k = [[30, 40], [50, 60]];
        var d = 50;

        // Test sendKey
        CommsHelper.sendKey(comm, k, d);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(4);
        expect(Communicator.sentData.charCodeAt(1)).toBe(40);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(0);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0);
        expect(Communicator.sentData.charCodeAt(7)).toBe(30);

        expect(Communicator.sentData.charCodeAt(8)).toBe(4);
        expect(Communicator.sentData.charCodeAt(9)).toBe(60);
        expect(Communicator.sentData.charCodeAt(10)).toBe(0);
        expect(Communicator.sentData.charCodeAt(11)).toBe(0);
        expect(Communicator.sentData.charCodeAt(12)).toBe(0);
        expect(Communicator.sentData.charCodeAt(13)).toBe(0);
        expect(Communicator.sentData.charCodeAt(14)).toBe(0);
        expect(Communicator.sentData.charCodeAt(15)).toBe(50);
    });

    it('Test sendKvmData with parent.onKvmDataAck as true', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        desktop.onKvmDataAck = true;
        Communicator.sentData = '';
        var x = 'ab';
        desktop.onKvmDataPending = new Array();

        // Test sendKvmData
        CommsHelper.sendKvmData(desktop, comm, x);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(6);
        expect(Communicator.sentData.charCodeAt(1)).toBe(0);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(0);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0);
        expect(Communicator.sentData.charCodeAt(7)).toBe(18);
        expect(Communicator.sentData.includes('ab',8)).toBe(true);
    });

    it('Test sendKvmData with parent.onKvmDataAck as false', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        desktop.onKvmDataAck = false;
        Communicator.sentData = '';
        var x = 'ab';
        desktop.onKvmDataPending = new Array();

        // Test sendKvmData
        CommsHelper.sendKvmData(desktop, comm, x);

        // Output
        expect(desktop.onKvmDataPending).toContain('ab');
    });

    it('Test sendKeepAlive', () => {

        // Input
        var comm = new Communicator();
        var desktop = new AmtDesktop();
        Communicator.sentData = '';
        desktop.lastKeepAlive = Date.now() - 5001;

        // Test sendKeepAlive
        CommsHelper.sendKeepAlive(desktop, comm);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(6);
        expect(Communicator.sentData.charCodeAt(1)).toBe(0);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(0);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0);
        expect(Communicator.sentData.charCodeAt(7)).toBe(16);
        expect(Communicator.sentData.includes('\0KvmDataChannel\0',8)).toBe(true);
    });

    it('Test sendCtrlAltDelMsg', () => {

        // Input
        var comm = new Communicator();
        Communicator.sentData = '';

        // Test sendCtrlAltDelMsg
        CommsHelper.sendCtrlAltDelMsg(comm);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(4);
        expect(Communicator.sentData.charCodeAt(1)).toBe(1);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(0);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(7)).toBe(0xE3);

        expect(Communicator.sentData.charCodeAt(8)).toBe(4);
        expect(Communicator.sentData.charCodeAt(9)).toBe(1);
        expect(Communicator.sentData.charCodeAt(10)).toBe(0);
        expect(Communicator.sentData.charCodeAt(11)).toBe(0);
        expect(Communicator.sentData.charCodeAt(12)).toBe(0);
        expect(Communicator.sentData.charCodeAt(13)).toBe(0);
        expect(Communicator.sentData.charCodeAt(14)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(15)).toBe(0xE9);

        expect(Communicator.sentData.charCodeAt(16)).toBe(4);
        expect(Communicator.sentData.charCodeAt(17)).toBe(1);
        expect(Communicator.sentData.charCodeAt(18)).toBe(0);
        expect(Communicator.sentData.charCodeAt(19)).toBe(0);
        expect(Communicator.sentData.charCodeAt(20)).toBe(0);
        expect(Communicator.sentData.charCodeAt(21)).toBe(0);
        expect(Communicator.sentData.charCodeAt(22)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(23)).toBe(0xFF);

        expect(Communicator.sentData.charCodeAt(24)).toBe(4);
        expect(Communicator.sentData.charCodeAt(25)).toBe(0);
        expect(Communicator.sentData.charCodeAt(26)).toBe(0);
        expect(Communicator.sentData.charCodeAt(27)).toBe(0);
        expect(Communicator.sentData.charCodeAt(28)).toBe(0);
        expect(Communicator.sentData.charCodeAt(29)).toBe(0);
        expect(Communicator.sentData.charCodeAt(30)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(31)).toBe(0xFF);

        expect(Communicator.sentData.charCodeAt(32)).toBe(4);
        expect(Communicator.sentData.charCodeAt(33)).toBe(0);
        expect(Communicator.sentData.charCodeAt(34)).toBe(0);
        expect(Communicator.sentData.charCodeAt(35)).toBe(0);
        expect(Communicator.sentData.charCodeAt(36)).toBe(0);
        expect(Communicator.sentData.charCodeAt(37)).toBe(0);
        expect(Communicator.sentData.charCodeAt(38)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(39)).toBe(0xE9);

        expect(Communicator.sentData.charCodeAt(40)).toBe(4);
        expect(Communicator.sentData.charCodeAt(41)).toBe(0);
        expect(Communicator.sentData.charCodeAt(42)).toBe(0);
        expect(Communicator.sentData.charCodeAt(43)).toBe(0);
        expect(Communicator.sentData.charCodeAt(44)).toBe(0);
        expect(Communicator.sentData.charCodeAt(45)).toBe(0);
        expect(Communicator.sentData.charCodeAt(46)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(47)).toBe(0xE3);
    });


    it('Test sendCad', () => {

        // Input
        var comm = new Communicator();
        Communicator.sentData = '';

        // Test sendCad
        CommsHelper.sendCad(comm);

        // Output
        expect(Communicator.sentData.charCodeAt(0)).toBe(4);
        expect(Communicator.sentData.charCodeAt(1)).toBe(1);
        expect(Communicator.sentData.charCodeAt(2)).toBe(0);
        expect(Communicator.sentData.charCodeAt(3)).toBe(0);
        expect(Communicator.sentData.charCodeAt(4)).toBe(0);
        expect(Communicator.sentData.charCodeAt(5)).toBe(0);
        expect(Communicator.sentData.charCodeAt(6)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(7)).toBe(0xE3);

        expect(Communicator.sentData.charCodeAt(8)).toBe(4);
        expect(Communicator.sentData.charCodeAt(9)).toBe(1);
        expect(Communicator.sentData.charCodeAt(10)).toBe(0);
        expect(Communicator.sentData.charCodeAt(11)).toBe(0);
        expect(Communicator.sentData.charCodeAt(12)).toBe(0);
        expect(Communicator.sentData.charCodeAt(13)).toBe(0);
        expect(Communicator.sentData.charCodeAt(14)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(15)).toBe(0xE9);

        expect(Communicator.sentData.charCodeAt(16)).toBe(4);
        expect(Communicator.sentData.charCodeAt(17)).toBe(1);
        expect(Communicator.sentData.charCodeAt(18)).toBe(0);
        expect(Communicator.sentData.charCodeAt(19)).toBe(0);
        expect(Communicator.sentData.charCodeAt(20)).toBe(0);
        expect(Communicator.sentData.charCodeAt(21)).toBe(0);
        expect(Communicator.sentData.charCodeAt(22)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(23)).toBe(0xFF);

        expect(Communicator.sentData.charCodeAt(24)).toBe(4);
        expect(Communicator.sentData.charCodeAt(25)).toBe(0);
        expect(Communicator.sentData.charCodeAt(26)).toBe(0);
        expect(Communicator.sentData.charCodeAt(27)).toBe(0);
        expect(Communicator.sentData.charCodeAt(28)).toBe(0);
        expect(Communicator.sentData.charCodeAt(29)).toBe(0);
        expect(Communicator.sentData.charCodeAt(30)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(31)).toBe(0xFF);

        expect(Communicator.sentData.charCodeAt(32)).toBe(4);
        expect(Communicator.sentData.charCodeAt(33)).toBe(0);
        expect(Communicator.sentData.charCodeAt(34)).toBe(0);
        expect(Communicator.sentData.charCodeAt(35)).toBe(0);
        expect(Communicator.sentData.charCodeAt(36)).toBe(0);
        expect(Communicator.sentData.charCodeAt(37)).toBe(0);
        expect(Communicator.sentData.charCodeAt(38)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(39)).toBe(0xE9);

        expect(Communicator.sentData.charCodeAt(40)).toBe(4);
        expect(Communicator.sentData.charCodeAt(41)).toBe(0);
        expect(Communicator.sentData.charCodeAt(42)).toBe(0);
        expect(Communicator.sentData.charCodeAt(43)).toBe(0);
        expect(Communicator.sentData.charCodeAt(44)).toBe(0);
        expect(Communicator.sentData.charCodeAt(45)).toBe(0);
        expect(Communicator.sentData.charCodeAt(46)).toBe(0xFF);
        expect(Communicator.sentData.charCodeAt(47)).toBe(0xE3);
    });
});