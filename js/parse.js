"use strict";

const fs = require('fs');
const iconv = require('iconv-lite');

module.exports = function (filename) {
    filename = filename.replace(/\\/g, '/');
    const buffer = fs.readFileSync('public/' + filename);
    const text = iconv.decode(buffer, "shift-jis");
    const bms = {
        game: 0,
        player: 1,
        genre: "",
        title: "",
        artist: "",
        subtitle: "",
        stagefile: "",
        playlevel: 0,
        total: 0,
        noteCnt: 0,
        rank: 2,
        wavV: {},
        bmpV: {},
        signatures: {},
        notes: [],
        speedcore: [],
    };
    if (filename.match(/^.*\.pms$/i)) {
        bms.game = 1;
    }
    let lnobj = [];
    const bpmV = {};
    const stopV = {};
    const wavProc = [".wav", ".mp3", ".ogg", ".webm", ".flac"];
    const bmpProc = [".png", ".jpg", ".mp4", ".webm"];
    let randomGenerated = 0;
    const ifStack = [false];
    const bgms = [];
    const bmps = [];
    let startBPM = 130;
    const speedcore = [];
    const notes = [];
    const longs = [];
    const miscs = [];
    text.split(/\r?\n/g).forEach(line => {
        const skipped = ifStack[ifStack.length - 1];
        matchCascade(line).when(/^#RANDOM (\d+)$/i, match => {
            if (skipped) {
                return;
            }
            randomGenerated = Math.floor(Math.random() * parseInt(match[1])) + 1;
        }).when(/^#IF (\d+)$/i, match => {
            if (skipped) {
                return;
            }
            ifStack.push(randomGenerated != parseInt(match[1]));
        }).when(/^#ELSE$/i, () => {
            ifStack.push(!ifStack.pop());
        }).when(/^#ENDIF$/i, () => {
            ifStack.pop();
        }).when(/^#LNOBJ ([0-9A-Z]{2})$/i, match => {
            if (skipped) {
                return;
            }
            lnobj.push(match[1]);
        }).when(/^#PLAYER (\d)$/i, match => {
            if (skipped) {
                return;
            }
            bms.player = parseInt(match[1]);
        }).when(/^#PLAYLEVEL (\d+)$/i, match => {
            if (skipped) {
                return;
            }
            bms.playlevel = parseInt(match[1]);
        }).when(/^#RANK (\d+)$/i, match => {
            if (skipped) {
                return;
            }
            bms.rank = parseInt(match[1]);
        }).when(/^#TOTAL (\d+(\.\d+)?(E\+\d+)?)$/i, match => {
            if (skipped) {
                return;
            }
            bms.total = parseInt(match[1]);
        }).when(/^#GENRE (.*)$/i, match => {
            if (skipped) {
                return;
            }
            bms.genre = match[1];
        }).when(/^#TITLE (.*)$/i, match => {
            if (skipped) {
                return;
            }
            matchCascade(match[1]).when(/^(.*)\s*-(.*)-$/, match => {
                bms.title = match[1];
                bms.subtitle = "[" + match[2] + "]";
            }).when(/^(.*)\s*～(.*)～$/, match => {
                bms.title = match[1];
                bms.subtitle = "[" + match[2] + "]";
            }).when(/^(.*)\s*\[(.*)\]$/, match => {
                bms.title = match[1];
                bms.subtitle = "[" + match[2] + "]";
            }).when(/^(.*)\s*\((.*)\)$/, match => {
                bms.title = match[1];
                bms.subtitle = "[" + match[2] + "]";
            }).when(/^(.*)\s*\<(.*)\>$/, match => {
                bms.title = match[1];
                bms.subtitle = "[" + match[2] + "]";
            }).else(() => {
                bms.title = match[1];
            });
        }).when(/^#ARTIST (.*)$/i, match => {
            if (skipped) {
                return;
            }
            bms.artist = match[1];
        }).when(/^#SUBTITLE (.*)$/i, match => {
            if (skipped) {
                return;
            }
            bms.subtitle = match[1];
        }).when(/^#STAGEFILE (.*)$/i, match => {
            if (skipped) {
                return;
            }
            let path = filename.substring(0, filename.lastIndexOf('/') + 1).concat(match[1]);
            if (!bmpProc.includes(path.substring(0, path.lastIndexOf('.'))) || !fs.existsSync('public/' + path)) {
                path = bmpProc.map(ext => path.substring(0, path.lastIndexOf('.')) + ext).filter(path => fs.existsSync('public/' + path))[0];
            }
            if (path) {
                bms.stagefile = encodeURIComponent(path).replace(/%2F/ig, '/');
            }
        }).when(/^#WAV([0-9A-Z]{2}) (.*)$/i, match => {
            if (skipped) {
                return;
            }
            let path = filename.substring(0, filename.lastIndexOf('/') + 1).concat(match[2]);
            if (!wavProc.includes(path.substring(0, path.lastIndexOf('.'))) || !fs.existsSync('public/' + path)) {
                path = wavProc.map(ext => path.substring(0, path.lastIndexOf('.')) + ext).filter(path => fs.existsSync('public/' + path))[0];
            }
            if (path) {
                bms.wavV[match[1]] = encodeURIComponent(path).replace(/%2F/ig, '/');
            }
        }).when(/^#BMP([0-9A-Z]{2}) (.*)$/i, match => {
            if (skipped) {
                return;
            }
            let path = filename.substring(0, filename.lastIndexOf('/') + 1).concat(match[2]);
            if (!bmpProc.includes(path.substring(0, path.lastIndexOf('.'))) || !fs.existsSync('public/' + path)) {
                path = bmpProc.map(ext => path.substring(0, path.lastIndexOf('.')) + ext).filter(path => fs.existsSync('public/' + path))[0];
            }
            if (path) {
                bms.bmpV[match[1]] = encodeURIComponent(path).replace(/%2F/ig, '/');
            }
        }).when(/^#BPM (\d+(\.\d+)?(E\+\d+)?)$/i, match => {
            if (skipped) {
                return;
            }
            startBPM = parseFloat(match[1]);
        }).when(/^#BPM([0-9A-Z]{2}) (\d+(\.\d+)?(E\+\d+)?)$/i, match => {
            if (skipped) {
                return;
            }
            bpmV[match[1]] = parseFloat(match[2]);
        }).when(/^#STOP([0-9A-Z]{2}) (\d+)$/i, match => {
            if (skipped) {
                return;
            }
            stopV[match[1]] = parseInt(match[2]) / 192;
        }).when(/^#(\d{3})02:(\d+(\.\d+)?(E\+\d+)?)$/i, match => {
            if (skipped) {
                return;
            }
            bms.signatures[parseInt(match[1])] = parseFloat(match[2]);
        }).when(/^#(\d{3})([0-9A-Z]{2}):([0-9A-Z]+)$/i, match => {
            if (skipped) {
                return;
            }
            const measure = parseInt(match[1]);
            const length = Math.floor(match[3].length / 2);
            for (let i = 0; i < length; i++) {
                const fraction = measure + i / length;
                const key = match[3].substring(i * 2, i * 2 + 2);
                if (key == '00') {
                    continue;
                }
                switch (match[2][0]) {
                    case '0':
                        switch (match[2][1]) {
                            case '1':
                                bgms.push({ fraction, key });
                                break;
                            case '3':
                                speedcore.push({ fraction, type: 'bpm', bpm: parseInt(key, 16) });
                                break;
                            case '4':
                                bmps.push({ fraction, key, layer: 0 });
                                break;
                            case '6':
                                bmps.push({ fraction, key, layer: -1 });
                                break;
                            case '7':
                                bmps.push({ fraction, key, layer: 1 });
                                break;
                            case '8':
                                speedcore.push({ fraction, type: 'bpm', bpm: bpmV[key] });
                                break;
                            case '9':
                                speedcore.push({ fraction, type: 'stp', stop: stopV[key] });
                                break;
                        }
                        break;
                    case '1':
                    case '2':
                        notes.push({ fraction, line: match[2], key });
                        break;
                    case '3':
                    case '4':
                        miscs.push({ fraction, type: 'inv', line: match[2][0] - 2 + match[2][1], key });
                        break;
                    case '5':
                    case '6':
                        longs.push({ fraction, line: match[2][0] - 4 + match[2][1], key });
                        break;
                    case 'D':
                    case 'E':
                        miscs.push({ fraction, type: 'bom', line: String.fromCharCode(match[2][0].charCodeAt() - 19) + match[2][1], key });
                        break;
                }
            }
        });
    });
    bms.speedcore = speedcore.sort((a, b) => a.fraction - b.fraction).reduce((speedcore, core) => {
        const last = speedcore.at(-1);
        const pos = f2p(bms.signatures, core.fraction);
        const time = last.time + (last.bpm > 0 ? (pos - last.pos) * 60 / last.bpm : 0);
        switch (core.type) {
            case 'bpm':
                return [...speedcore, { pos, time, bpm: core.bpm, inclusive: true }];
            case 'stp':
                return [...speedcore, { pos, time, bpm: 0, inclusive: true }, { pos, time: time + (last.bpm > 0 ? core.stop * 240 / last.bpm : 0), bpm: last.bpm, inclusive: false }];
        }
    }, [{ pos: 0, time: 0, bpm: startBPM, inclusive: true }]);
    bms.notes = [
        ...bgms.map(bgm => {
            const pos = f2p(bms.signatures, bgm.fraction);
            const core = bms.speedcore.filter(core => core.pos < pos || core.inclusive && core.pos <= pos).at(-1) || bms.speedcore[0];
            const time = core.time + (core.bpm > 0 ? (pos - core.pos) * 60 / core.bpm : 0);
            return { pos, time, type: 'bgm', key: bgm.key };
        }),
        ...bmps.map(bmp => {
            const pos = f2p(bms.signatures, bmp.fraction);
            const core = bms.speedcore.filter(core => core.pos < pos || core.inclusive && core.pos <= pos).at(-1) || bms.speedcore[0];
            const time = core.time + (core.bpm > 0 ? (pos - core.pos) * 60 / core.bpm : 0);
            return { pos, time, type: 'bmp', key: bmp.key, layer: bmp.layer };
        }),
        ...miscs.map(misc => {
            const pos = f2p(bms.signatures, misc.fraction);
            const core = bms.speedcore.filter(core => core.pos < pos || core.inclusive && core.pos <= pos).at(-1) || bms.speedcore[0];
            const time = core.time + (core.bpm > 0 ? (pos - core.pos) * 60 / core.bpm : 0);
            return { pos, time, type: misc.type, line: misc.line, key: misc.key };
        }),
        ...notes.sort((a, b) => a.fraction - b.fraction).map(note => {
            const pos = f2p(bms.signatures, note.fraction);
            const core = bms.speedcore.filter(core => core.pos < pos || core.inclusive && core.pos <= pos).at(-1) || bms.speedcore[0];
            const time = core.time + (core.bpm > 0 ? (pos - core.pos) * 60 / core.bpm : 0);
            return { pos, time, type: 'not', line: note.line, key: note.key, end: lnobj.includes(note.key) };
        }),
        ...longs.sort((a, b) => a.fraction - b.fraction).reduce((longs, long) => {
            const pos = f2p(bms.signatures, long.fraction);
            const core = bms.speedcore.filter(core => core.pos < pos || core.inclusive && core.pos <= pos).at(-1) || bms.speedcore[0];
            const time = core.time + (core.bpm > 0 ? (pos - core.pos) * 60 / core.bpm : 0);
            const last = longs.filter(n => n.line == long.line).at(-1);
            if (last) {
                return [...longs, { pos, time, type: 'not', line: long.line, key: long.key, end: !last.end }];
            } else {
                return [...longs, { pos, time, type: 'not', line: long.line, key: long.key, end: false }];
            }
        }, []),
    ].sort((a, b) => a.pos - b.pos);
    bms.noteCnt = bms.notes.filter(note => note.type == 'not').length;
    return bms;
}

function matchCascade(text) {
    var matched = false;
    return {
        when: function (pattern, callback) {
            if (matched) {
                return this;
            }
            var match = text.match(pattern);
            if (match) {
                matched = true;
                callback(match);
            }
            return this;
        },
        else: function (callback) {
            if (matched) {
                return this;
            }
            callback();
        }
    }
}

function f2p(signatures, f) {
    const measure = Math.floor(f);
    return [...new Array(measure).keys()].reduce((p, m) => p + (signatures[m] || 1), (f - measure) * (signatures[measure] || 1)) * 4;
}