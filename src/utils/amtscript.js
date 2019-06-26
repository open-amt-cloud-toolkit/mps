/**
* @fileoverview Script Compiler / Decompiler / Runner
* @author Ylian Saint-Hilaire
* @copyright Intel Corporation 2018
* @license Apache-2.0
* @version v0.1.0e
*/

module.exports.CreateAmtScriptEngine = function () {
    var o = {};

    // Core functions
    script_functionTable1 = ['nop', 'jump', 'set', 'print', 'dialog', 'getitem', 'substr', 'indexof', 'split', 'join', 'length', 'jsonparse', 'jsonstr', 'add', 'substract', 'parseint', 'wsbatchenum', 'wsput', 'wscreate', 'wsdelete', 'wsexec', 'scriptspeed', 'wssubscribe', 'wsunsubscribe', 'readchar', 'signwithdummyca'];

    // functions of type ARG1 = func(ARG2, ARG3, ARG4, ARG5, ARG6)
    script_functionTable2 = ['encodeuri', 'decodeuri', 'passwordcheck', 'atob', 'btoa', 'hex2str', 'str2hex', 'random', 'md5', 'maketoarray', 'readshort', 'readshortx', 'readint', 'readsint', 'readintx', 'shorttostr', 'shorttostrx', 'inttostr', 'inttostrx'];

    // functions of type ARG1 = func(ARG2, ARG3, ARG4, ARG5, ARG6)
    //script_functionTableX2 = [encodeURI, decodeURI, passwordcheck, window.atob.bind(window), window.btoa.bind(window), hex2rstr, rstr2hex, random, rstr_md5, MakeToArray, ReadShort, ReadShortX, ReadInt, ReadSInt, ReadIntX, ShortToStr, ShortToStrX, IntToStr, IntToStrX];

    // Optional functions of type ARG1 = func(ARG2, ARG3, ARG4, ARG5, ARG6)
    script_functionTable3 = ['pullsystemstatus', 'pulleventlog', 'pullauditlog', 'pullcertificates', 'pullwatchdog', 'pullsystemdefense', 'pullhardware', 'pulluserinfo', 'pullremoteaccess', 'highlightblock', 'disconnect', 'getsidstring', 'getsidbytearray'];

    ReadShort = function (v, p) { return (v.charCodeAt(p) << 8) + v.charCodeAt(p + 1); }
    ReadShortX = function (v, p) { return (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p); }
    ReadInt = function (v, p) { return (v.charCodeAt(p) * 0x1000000) + (v.charCodeAt(p + 1) << 16) + (v.charCodeAt(p + 2) << 8) + v.charCodeAt(p + 3); } // We use "*0x1000000" instead of "<<24" because the shift converts the number to signed int32.
    ReadIntX = function (v, p) { return (v.charCodeAt(p + 3) * 0x1000000) + (v.charCodeAt(p + 2) << 16) + (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p); }
    ShortToStr = function (v) { return String.fromCharCode((v >> 8) & 0xFF, v & 0xFF); }
    ShortToStrX = function (v) { return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF); }
    IntToStr = function (v) { return String.fromCharCode((v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF); }
    IntToStrX = function (v) { return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >> 24) & 0xFF); }

    // Argument types: 0 = Variable, 1 = String, 2 = Integer, 3 = Label
    o.script_compile = function(script, onmsg) {
        var r = '', scriptlines = script.split('\n'), labels = {}, labelswap = [], swaps = [];
        // Go thru each script line and encode it
        for (var i in scriptlines) {
            var scriptline = scriptlines[i];
            if (scriptline.startsWith('##SWAP ')) { var x = scriptline.split(' '); if (x.length == 3) { swaps[x[1]] = x[2]; } } // Add a swap instance
            if (scriptline[0] == '#' || scriptline.length == 0) continue; // Skip comments & blank lines
            for (var x in swaps) { scriptline = scriptline.split(x).join(swaps[x]); } // Apply all swaps
            var keywords = scriptline.match(/"[^"]*"|[^\s"]+/g);
            if ((keywords == null) || (keywords.length == 0)) continue; // Skip blank lines
            if (scriptline[0] == ':') { labels[keywords[0].toUpperCase()] = r.length; continue; } // Mark a label position
            var funcIndex = script_functionTable1.indexOf(keywords[0].toLowerCase());
            if (funcIndex == -1) { funcIndex = script_functionTable2.indexOf(keywords[0].toLowerCase()); if (funcIndex >= 0) funcIndex += 10000; }
            if (funcIndex == -1) { funcIndex = script_functionTable3.indexOf(keywords[0].toLowerCase()); if (funcIndex >= 0) funcIndex += 20000; } // Optional methods
            if (funcIndex == -1) { if (onmsg) { onmsg("Unabled to compile, unknown command: " + keywords[0]); } return ''; }
            // Encode CommandId, CmdSize, ArgCount, Arg1Len, Arg1, Arg2Len, Arg2...
            var cmd = ShortToStr(keywords.length - 1);
            for (var j in keywords) {
                if (j == 0) continue;
                if (keywords[j][0] == ':') {
                    labelswap.push([keywords[j], r.length + cmd.length + 7]); // Add a label swap
                    cmd += ShortToStr(5) + String.fromCharCode(3) + IntToStr(0xFFFFFFFF); // Put an empty label
                } else {
                    var argint = parseInt(keywords[j]);
                    if (argint == keywords[j]) {
                        cmd += ShortToStr(5) + String.fromCharCode(2) + IntToStr(argint);
                    } else {
                        if (keywords[j][0] == '"' && keywords[j][keywords[j].length - 1] == '"') {
                            cmd += ShortToStr(keywords[j].length - 1) + String.fromCharCode(1) + keywords[j].substring(1, keywords[j].length - 1);
                        } else {
                            cmd += ShortToStr(keywords[j].length + 1) + String.fromCharCode(0) + keywords[j];
                        }
                    }
                }
            }
            cmd = ShortToStr(funcIndex) + ShortToStr(cmd.length + 4) + cmd;
            r += cmd;
        }
        // Perform all the needed label swaps
        for (i in labelswap) {
            var label = labelswap[i][0].toUpperCase(), position = labelswap[i][1], target = labels[label];
            if (target == undefined) { if (onmsg) { onmsg("Unabled to compile, unknown label: " + label); } return ''; }
            r = r.substr(0, position) + IntToStr(target) + r.substr(position + 4);
        }
        return IntToStr(0x247D2945) + ShortToStr(1) + r;
    }

    // Decompile the script, intended for debugging only
    o.script_decompile = function(binary, onecmd) {
        var r = '', ptr = 6, labelcount = 0, labels = {};
        if (onecmd >= 0) {
            ptr = onecmd; // If we are decompiling just one command, set the ptr to that command.
        } else {
            if (binary.length < 6) { return '# Invalid script length'; }
            var magic = ReadInt(binary, 0);
            var version = ReadShort(binary, 4);
            if (magic != 0x247D2945) { return '# Invalid binary script: ' + magic; }
            if (version != 1) { return '# Invalid script version'; }
        }
        // Loop on each command, moving forward by the command length each time.
        while (ptr < binary.length) {
            var cmdid = ReadShort(binary, ptr);
            var cmdlen = ReadShort(binary, ptr + 2);
            var argcount = ReadShort(binary, ptr + 4);
            var argptr = ptr + 6;
            var argstr = '';
            if (!(onecmd >= 0)) r += ":label" + (ptr - 6) + "\n";
            // Loop on each argument, moving forward by the argument length each time
            for (var i = 0; i < argcount; i++) {
                var arglen = ReadShort(binary, argptr);
                var argval = binary.substring(argptr + 2, argptr + 2 + arglen);
                var argtyp = argval.charCodeAt(0);
                if (argtyp == 0) { argstr += ' ' + argval.substring(1); } // Variable
                else if (argtyp == 1) { argstr += ' \"' + argval.substring(1) + '\"'; } // String
                else if (argtyp == 2) { argstr += ' ' + ReadInt(argval, 1); } // Integer
                else if (argtyp == 3) { // Label
                    var target = ReadInt(argval, 1);
                    var label = labels[target];
                    if (!label) { label = ":label" + target; labels[label] = target; }
                    argstr += ' ' + label;
                }
                argptr += (2 + arglen);
            }
            // Go in the script function table to decode the function
            if (cmdid < 10000) {
                r += script_functionTable1[cmdid] + argstr + "\n";
            } else {
                if (cmdid >= 20000) {
                    r += script_functionTable3[cmdid - 20000] + argstr + "\n"; // Optional methods
                } else {
                    r += script_functionTable2[cmdid - 10000] + argstr + "\n";
                }
            }
            ptr += cmdlen;
            if (onecmd >= 0) return r; // If we are decompiling just one command, exit now
        }
        // Remove all unused labels
        var scriptlines = r.split('\n');
        r = '';
        for (var i in scriptlines) {
            var line = scriptlines[i];
            if (line[0] != ':') { r += line + '\n'; } else { if (labels[line]) { r += line + '\n'; } }
        }
        return r;
    }

    // Convert the list of blocks into a script that can be compiled
    o.script_blocksToScript = function (script_BuildingBlocks, script_BlockScript) {
        var script = '';
        if (script_BuildingBlocks) {
            if (script_BuildingBlocks['_start']) { script += '##### Starting Block #####\r\n' + script_BuildingBlocks['_start']['code'] + '\r\n\r\n'; }
            for (var i in script_BlockScript) {
                var code = script_BlockScript[i]['code'];
                code = code.split("%%%~%%%").join(i);
                for (var j in script_BlockScript[i]['vars']) { code = code.split("%%%" + j + "%%%").join(script_BlockScript[i]['vars'][j]['value']); }
                script += '##### Block: ' + script_BlockScript[i]['name'] + ' #####\r\nHighlightBlock __t ' + i + '\r\n' + code + '\r\n\r\n';
            }
            if (script_BuildingBlocks['_end']) { script += '##### Ending Block #####\r\n' + script_BuildingBlocks['_end']['code'] + '\r\nHighlightBlock\r\n'; }
        }
        return script;
    }

    return o;
}