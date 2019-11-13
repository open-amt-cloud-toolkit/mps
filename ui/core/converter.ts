/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Vinay G
 **********************************************************************/
export class TypeConverter {

  // Binary encoding and decoding functions
  static ReadShort(v:string, p:number):number {
    // 
    return (v.charCodeAt(p) << 8) + v.charCodeAt(p + 1);
  }

  static ReadShortX(v:string, p:number):number {
    return (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p);
  }

  static ReadInt(v:string, p:number) {
    return (v.charCodeAt(p) * 0x1000000) + (v.charCodeAt(p + 1) << 16) +
           (v.charCodeAt(p + 2) << 8) + v.charCodeAt(p + 3);
  } // We use "*0x1000000" instead of "<<24" because the shift converts the number to signed int32.
  
  static ReadSInt(v:string, p:number):number {
    return (v.charCodeAt(p) << 24) + (v.charCodeAt(p + 1) << 16) +
           (v.charCodeAt(p + 2) << 8) + v.charCodeAt(p + 3);
  }
  
  static ReadIntX(v:string, p:number):number {
    return (v.charCodeAt(p + 3) * 0x1000000) + (v.charCodeAt(p + 2) << 16) +
           (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p);
  }

  static ShortToStr(v:number):string {
    return String.fromCharCode((v >> 8) & 0xFF, v & 0xFF);
  }
  
  static ShortToStrX(v:number):string {
    return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF);
  }
  
  static IntToStr(v:number):string {
    return String.fromCharCode((v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF);
  }
  
  static IntToStrX(v:number):string {
    return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >> 24) & 0xFF);
  }

  static MakeToArray(v:number):number | number[] {
    if (!v || v == null || typeof v == 'object') return v; return [v];
  }

  static SplitArray(v:string):string[] {
    return v.split(',');
  }

  static Clone(v:string):string {
    return JSON.parse(JSON.stringify(v));
  }

  static EscapeHtml(x:string | number | boolean):string | number | boolean {
    if (typeof x == "string") 
       return x.replace(/&/g, '&amp;').replace(/>/g, '&gt;').
              replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    if (typeof x == "boolean") 
       return x;
    if (typeof x == "number") 
       return x;
  }

  // Move an element from one position in an array to a new position
  static ArrayElementMove(arr:number[], from:number, to:number):void {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  };

  // Print object for HTML
  static ObjectToStringEx(x:any, c:number):string {
    var r = "";
    if (x != 0 && (!x || x == null)) return "(Null)";
    if (x instanceof Array) {
      for (var i in x) {
        r += '<br />' + this.gap(c) + "Item #" + i + ": " + this.ObjectToStringEx(x[i], c + 1);
      }
    }
    else if (x instanceof Object) {
      for (var i in x) {
        r += '<br />' + this.gap(c) + i + " = " + this.ObjectToStringEx(x[i], c + 1);
      }
    }
    else {
      r += this.EscapeHtml(x);
    }
    return r;
  }

  // Print object for console
  static ObjectToStringEx2(x:any, c:number):string {
    var r = "";
    if (x != 0 && (!x || x == null))
      return "(Null)";
    if (x instanceof Array) {
      for (var i in x) {
        r += '\r\n' + this.gap2(c) + "Item #" + i + ": " + this.ObjectToStringEx2(x[i], c + 1);
      }
    }
    else if (x instanceof Object) {
      for (var i in x) {
        r += '\r\n' + this.gap2(c) + i + " = " + this.ObjectToStringEx2(x[i], c + 1);
      }
    }
    else {
      r += this.EscapeHtml(x);
    }
    return r;
  }

  // Create an ident gap
  static gap(c:number):string {
    var x = '';
    for (var i = 0; i < (c * 4) ; i++) {
      x += '&nbsp;';
    }
    return x;
  }

  static gap2(c:number):string {
    var x = '';
    for (var i = 0; i < (c * 4) ; i++) {
      x += ' ';
    }
    return x;
  }

  // Print an object in html
  static ObjectToString(x:any):string {
    return this.ObjectToStringEx(x, 0);
  }

  static ObjectToString2(x:any):string {
    return this.ObjectToStringEx2(x, 0);
  }

  // Convert a hex string to a raw string
  static hex2rstr(d:string):string {
    if (typeof d != "string" || d.length == 0)
     return '';
    var r = '', m = ('' + d).match(/../g), t;
    while (t = m.shift())
     r += String.fromCharCode(Number('0x' + t));
    return r;
  }

  // Convert decimal to hex
  static char2hex(i:number):string {
    return (i + 0x100).toString(16).substr(-2).toUpperCase();
  }

  // Convert a raw string to a hex string
  static rstr2hex(input:string):string {
    var r = '', i;
    for (i = 0; i < input.length; i++) {
      r += this.char2hex(input.charCodeAt(i));
    }
    return r;
  }

  // UTF-8 encoding & decoding functions
  static encode_utf8(s:string):string {
    return unescape(encodeURIComponent(s));
  }

  static decode_utf8(s:string):string {
    return decodeURIComponent(escape(s));
  }

  // Convert a string into a blob
  static data2blob(data:string):any {
    var bytes = new Array(data.length);
    for (var i = 0; i < data.length; i++)
     bytes[i] = data.charCodeAt(i);
    var blob = new Blob([new Uint8Array(bytes)]);
    return blob;
  }

  // Generate random numbers
  static random(max:number):number {
    return Math.floor(Math.random() * max);
  }

  // Trademarks
  static trademarks(x:string):string {
    return x.replace(/\(R\)/g, '&reg;').replace(/\(TM\)/g, '&trade;');
  }

}
