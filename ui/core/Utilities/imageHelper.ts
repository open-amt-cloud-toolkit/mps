/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import { Desktop } from "../Desktop";

/**
 * Provides helper functions to handle image pixel data.
 */
export class ImageHelper {
  /**
   * puts image on canvas using the parent canvas ctx.
   * @param parent parent desktop with CTX for canvas
   * @param x x loc
   * @param y y loc
   */
  static putImage(parent: Desktop, x: number, y: number) {

    if (parent.holding == true) return;

    var xx = ImageHelper.arotX(parent, x, y);
    y = ImageHelper.arotY(parent, x, y);
    x = xx;
    parent.canvasCtx.putImageData(parent.spare, x, y);
  }
  /**
   * 
   * @param parent parent desktop
   * @param value pixel value at ptr
   * @param ptr ptr into the image pixel data
   */
  static setPixel(parent: Desktop, value: any, ptr: number) {
    var pp = ptr * 4;


    if (parent.rotation > 0) {
      if (parent.rotation == 1) {
        var x = ptr % parent.sparew;
        var y = Math.floor(ptr / parent.sparew);
        ptr = (x * parent.sparew2) + (parent.sparew2 - 1 - y);
        pp = ptr * 4;
      }
      else if (parent.rotation == 2) { pp = (parent.sparew * parent.spareh * 4) - 4 - pp; }
      else if (parent.rotation == 3) {
        var x = ptr % parent.sparew;
        var y = Math.floor(ptr / parent.sparew);
        ptr = ((parent.sparew2 - 1 - x) * parent.sparew2) + (y);
        pp = ptr * 4;
      }
    }

    if (parent.bpp == 1) {
      // Set 8bit color RGB332
      parent.spare.data[pp++] = value & 224;
      parent.spare.data[pp++] = (value & 28) << 3;
      parent.spare.data[pp++] = ImageHelper.fixColor((value & 3) << 6);
    } else {
      // Set 16bit color RGB565
      parent.spare.data[pp++] = (value >> 8) & 248;
      parent.spare.data[pp++] = (value >> 3) & 252;
      parent.spare.data[pp++] = (value & 31) << 3;
    }
    parent.spare.data[pp] = 0xFF; // Set alpha channel to opaque.
  }


  static arotX(parent: Desktop, x: number, y: number): number {
    if (parent.rotation == 0) return x;
    if (parent.rotation == 1) return parent.canvasCtx.canvas.width - parent.sparew2 - y;
    if (parent.rotation == 2) return parent.canvasCtx.canvas.width - parent.sparew2 - x;
    if (parent.rotation == 3) return y;
    return 0;
  }

  static arotY(parent: Desktop, x: number, y: number): number {
    if (parent.rotation == 0) return y;
    if (parent.rotation == 1) return x;
    if (parent.rotation == 2) return parent.canvasCtx.canvas.height - parent.spareh2 - y;
    if (parent.rotation == 3) return parent.canvasCtx.canvas.height - parent.spareh - x;
    return 0;
  }

  static crotX(parent: Desktop, x: number, y: number): number {
    if (parent.rotation == 0) return x;
    if (parent.rotation == 1) return y;
    if (parent.rotation == 2) return parent.canvasCtx.canvas.width - x;
    if (parent.rotation == 3) return parent.canvasCtx.canvas.height - y;
    return 0;
  }

  static crotY(parent: Desktop, x: number, y: number): number {
    if (parent.rotation == 0) return y;
    if (parent.rotation == 1) return parent.canvasCtx.canvas.width - x;
    if (parent.rotation == 2) return parent.canvasCtx.canvas.height - y;
    if (parent.rotation == 3) return x;
    return 0;
  }

  static rotX(parent: Desktop, x: number, y: number): number {
    if (parent.rotation == 0) return x;
    if (parent.rotation == 1) return x;
    if (parent.rotation == 2) return x - parent.canvasCtx.canvas.width;
    if (parent.rotation == 3) return x - parent.canvasCtx.canvas.height;
    return 0;
  }

  static rotY(parent: Desktop, x: number, y: number): number {
    if (parent.rotation == 0) return y;
    if (parent.rotation == 1) return y - parent.canvasCtx.canvas.width;
    if (parent.rotation == 2) return y - parent.canvasCtx.canvas.height;
    if (parent.rotation == 3) return y;
    return 0;
  }

  static setRotation(parent: Desktop, x: number) : boolean {
    while (x < 0) { x += 4; }
    let newrotation = x % 4;
    //console.log('hard-rot: ' + newrotation);

    if (parent.holding == true) { parent.rotation = newrotation; return; }

    if (newrotation == parent.rotation) return true;
    let rw = parent.canvasCtx.canvas.width;
    let rh = parent.canvasCtx.canvas.height;
    if (parent.rotation == 1 || parent.rotation == 3) { rw = parent.canvasCtx.canvas.height; rh = parent.canvasCtx.canvas.width; }

    // Copy the canvas, put it back in the correct direction
    if (parent.tcanvas == null) parent.tcanvas = document.createElement('canvas');
    let tcanvasctx = parent.tcanvas.getContext('2d');
    tcanvasctx.setTransform(1, 0, 0, 1, 0, 0);
    tcanvasctx.canvas.width = rw;
    tcanvasctx.canvas.height = rh;
    tcanvasctx.rotate((parent.rotation * -90) * Math.PI / 180);
    if (parent.rotation == 0) tcanvasctx.drawImage(parent.canvasCtx.canvas, 0, 0);
    if (parent.rotation == 1) tcanvasctx.drawImage(parent.canvasCtx.canvas, -parent.canvasCtx.canvas.width, 0);
    if (parent.rotation == 2) tcanvasctx.drawImage(parent.canvasCtx.canvas, -parent.canvasCtx.canvas.width, -parent.canvasCtx.canvas.height);
    if (parent.rotation == 3) tcanvasctx.drawImage(parent.canvasCtx.canvas, 0, -parent.canvasCtx.canvas.height);

    // Change the size and orientation and copy the canvas back into the rotation
    if (parent.rotation == 0 || parent.rotation == 2) { parent.canvasCtx.canvas.height = rw; parent.canvasCtx.canvas.width = rh; }
    if (parent.rotation == 1 || parent.rotation == 3) { parent.canvasCtx.canvas.height = rh; parent.canvasCtx.canvas.width = rw; }
    parent.canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
    parent.canvasCtx.rotate((newrotation * 90) * Math.PI / 180);
    parent.rotation = newrotation;
    parent.canvasCtx.drawImage(parent.tcanvas, ImageHelper.rotX(parent, 0, 0), ImageHelper.rotY(parent, 0, 0));

    parent.width = parent.canvasCtx.canvas.width;
    parent.height = parent.canvasCtx.canvas.height;
    if (parent.onScreenResize != null) parent.onScreenResize(parent.width, parent.height, parent.canvasId);
    return true;
  }

  static fixColor(c: number): number {
    return (c > 127) ? (c + 32) : c;
  }

}