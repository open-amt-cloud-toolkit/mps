/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

 import { IRLEDecoder } from '../IRLEDecoder'
import { Desktop } from '../Desktop';
import { ImageHelper } from '../Utilities/imageHelper';
class RLEDecoder implements IRLEDecoder {
  parent: Desktop
  constructor(parent: Desktop) {
    this.parent = parent
  }
  Decode(data: string, ptr: number, x: number, y: number, width: number, height: number, s: number, datalen: number) {
    let subencoding = data.charCodeAt(ptr++), 
      index, 
      v, 
      runlengthdecode, 
      palette : any = {}, 
      rlecount = 0, 
      runlength = 0, 
      i;
    // this.parent.Debug("RECT RLE (" + (datalen - 5) + ", " + subencoding + "):" + rstr2hex(data.substring(21, 21 + (datalen - 5))));
    if (subencoding == 0) {
      // RAW encoding
      this.parent.logger.verbose('Raw encoding')
      for (i = 0; i < s; i++) { ImageHelper.setPixel(this.parent, data.charCodeAt(ptr++) + ((this.parent.bpp == 2) ? (data.charCodeAt(ptr++) << 8) : 0), i); }
      ImageHelper.putImage(this.parent, x, y);
    }
    else if (subencoding == 1) {
      // Solid color tile
      v = data.charCodeAt(ptr++) + ((this.parent.bpp == 2) ? (data.charCodeAt(ptr++) << 8) : 0);
      this.parent.canvasCtx.fillStyle = 'rgb(' + ((this.parent.bpp == 1) ? ((v & 224) + ',' + ((v & 28) << 3) + ',' + ImageHelper.fixColor((v & 3) << 6)) : (((v >> 8) & 248) + ',' + ((v >> 3) & 252) + ',' + ((v & 31) << 3))) + ')';

      this.parent.logger.verbose('fillstyle: ' + this.parent.canvasCtx.fillStyle)
      let xx = ImageHelper.rotX(this.parent, x, y);
      y = ImageHelper.rotY(this.parent, x, y);
      x = xx;

      this.parent.canvasCtx.fillRect(x, y, width, height);
    }
    else if (subencoding > 1 && subencoding < 17) { // Packed palette encoded tile
      // Read the palette
      this.parent.logger.verbose('Read the packed palette')
      let br = 4, bm = 15; // br is BitRead and bm is BitMask. By adjusting these two we can support all the variations in this encoding.
      for (i = 0; i < subencoding; i++) { palette[i] = data.charCodeAt(ptr++) + ((this.parent.bpp == 2) ? (data.charCodeAt(ptr++) << 8) : 0); }

      // Compute bits to read & bit mark
      if (subencoding == 2) { br = 1; bm = 1; } else if (subencoding <= 4) { br = 2; bm = 3; }

      // Display all the bits
      while (rlecount < s && ptr < data.length) { v = data.charCodeAt(ptr++); for (i = (8 - br); i >= 0; i -= br) { ImageHelper.setPixel(this.parent, palette[(v >> i) & bm], rlecount++); } }
      ImageHelper.putImage(this.parent, x, y);
    }
    else if (subencoding == 128) { // RLE encoded tile
      this.parent.logger.verbose('RLE encoded tile')
      while (rlecount < s && ptr < data.length) {
        // Get the run color
        v = data.charCodeAt(ptr++) + ((this.parent.bpp == 2) ? (data.charCodeAt(ptr++) << 8) : 0);

        // Decode the run length. This is the fastest and most compact way I found to do this.
        runlength = 1; do { runlength += (runlengthdecode = data.charCodeAt(ptr++)); } while (runlengthdecode == 255);

        // Draw a run
        while (--runlength >= 0) { ImageHelper.setPixel(this.parent, v, rlecount++); }
      }
      ImageHelper.putImage(this.parent, x, y);
    }
    else if (subencoding > 129) { // Palette RLE encoded tile
      this.parent.logger.verbose('Read the RLE palette')
      // Read the palette
      for (i = 0; i < (subencoding - 128); i++) { palette[i] = data.charCodeAt(ptr++) + ((this.parent.bpp == 2) ? (data.charCodeAt(ptr++) << 8) : 0); }
      this.parent.logger.verbose('Decode RLE on palette')
      // Decode RLE  on palette
      while (rlecount < s && ptr < data.length) {
        // Setup the run, get the color index and get the color from the palette.
        runlength = 1; index = data.charCodeAt(ptr++); v = palette[index % 128];

        // If the index starts with high order bit 1, this is a run and decode the run length.
        if (index > 127) { do { runlength += (runlengthdecode = data.charCodeAt(ptr++)); } while (runlengthdecode == 255); }

        // Draw a run
        while (--runlength >= 0) { ImageHelper.setPixel(this.parent, v, rlecount++); }
      }
      ImageHelper.putImage(this.parent, x, y);
    }
  }
}

export { RLEDecoder }