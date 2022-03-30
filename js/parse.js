const fs = require('fs');

module.exports = function (filename) {
    filename = filename.replace(/\\/g, '/');
    const text = fs.readFileSync('public/' + filename, { encoding: 'utf-8' }).toString();
    const bms = {
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
        wavs: {},
        bmps: {},
        bpm: 130,
        signatures: Array(1000).fill(1),
        notes: [],
    };
    let lntype = 1;
    let lnobj = '00';
    const bpms = {};
    const stops = {};
    const lastObj = {
        '11': '00', '12': '00', '13': '00', '14': '00', '15': '00', '16': '00', '18': '00', '19': '00',
        '21': '00', '22': '00', '23': '00', '24': '00', '25': '00', '26': '00', '28': '00', '29': '00',
    };
    let randomGenerated = 0;
    const ifStack = [false];
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
        }).when(/^#LNTYPE (1|2)$/i, match => {
            if (skipped) {
                return;
            }
            lntype = parseInt(match[1]);
        }).when(/^#LNOBJ ([0-9A-Z]{2})$/i, match => {
            if (skipped) {
                return;
            }
            lntype = 3;
            lnobj = match[1];
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
        }).when(/^#TOTAL (\d+)$/i, match => {
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
            }).when(/^(.*)\s*<(.*)>$/, match => {
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
            bms.stagefile = encodeURI(filename.substring(0, filename.lastIndexOf('/') + 1).concat(match[1]));
        }).when(/^#WAV([0-9A-Z]{2}) (.*)$/i, match => {
            if (skipped) {
                return;
            }
            bms.wavs[match[1]] = encodeURI(filename.substring(0, filename.lastIndexOf('/') + 1).concat(match[2]));
        }).when(/^#BMP([0-9A-Z]{2}) (.*)$/i, match => {
            if (skipped) {
                return;
            }
            bms.bmps[match[1]] = encodeURI(filename.substring(0, filename.lastIndexOf('/') + 1).concat(match[2]));
        }).when(/^#BPM (\d+(\.\d+)?(E\+\d+)?)$/i, match => {
            if (skipped) {
                return;
            }
            bms.bpm = parseFloat(match[1]);
        }).when(/^#BPM([0-9A-Z]{2}) (\d+(\.\d+)?(E\+\d+)?)$/i, match => {
            if (skipped) {
                return;
            }
            bpms[match[1]] = parseFloat(match[2]);
        }).when(/^#STOP([0-9A-Z]{2}) (\d+)$/i, match => {
            if (skipped) {
                return;
            }
            stops[match[1]] = parseInt(match[2]) / 192;
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
            for (let i = 0; i < match[3].length; i += 2) {
                const fraction = i / match[3].length;
                const key = match[3].substring(i, i + 2);
                let lineNum;
                switch (match[2]) {
                    case '01':
                        if (key == '00') {
                            break;
                        }
                        bms.notes.push({ fraction: measure + fraction, type: 0, key: key, time: 0, executed: false });
                        break;
                    case '03':
                        if (key == '00') {
                            break;
                        }
                        bms.notes.push({ fraction: measure + fraction, type: 6, bpm: parseInt(key, 16), time: 0, executed: false });
                        break;
                    case '04':
                        if (key == '00') {
                            break;
                        }
                        bms.notes.push({ fraction: measure + fraction, type: 4, bmp: key, layer: 0, time: 0, executed: false });
                        break;
                    case '06':
                        if (key == '00') {
                            break;
                        }
                        bms.notes.push({ fraction: measure + fraction, type: 5, bmp: key, time: 0, executed: false });
                        break;
                    case '07':
                        if (key == '00') {
                            break;
                        }
                        bms.notes.push({ fraction: measure + fraction, type: 4, bmp: key, layer: 1, time: 0, executed: false });
                        break;
                    case '08':
                        if (key == '00') {
                            break;
                        }
                        bms.notes.push({ fraction: measure + fraction, type: 6, bpm: bpms[key], time: 0, executed: false });
                        break;
                    case '09':
                        if (key == '00') {
                            break;
                        }
                        bms.notes.push({ fraction: measure + fraction, type: 7, stop: stops[key], time: 0, executed: false });
                        break;
                    case '11':
                    case '12':
                    case '13':
                    case '14':
                    case '15':
                    case '16':
                    case '18':
                    case '19':
                    case '21':
                    case '22':
                    case '23':
                    case '24':
                    case '25':
                    case '26':
                    case '28':
                    case '29':
                        if (key == '00') {
                            break;
                        }
                        lineNum = match[2][1];
                        if (key == lnobj) {
                            const lineNotes = bms.notes.filter(note => note.type == 1 && note.line == match[2] && note.fraction < measure + fraction);
                            if (lineNotes) {
                                const note = lineNotes[lineNotes.length - 1];
                                note.endFraction = measure + fraction;
                            }
                            bms.notes.push({ fraction: measure + fraction, type: 0, key: key, time: 0, executed: false });
                        } else {
                            bms.notes.push({ fraction: measure + fraction, endFraction: -1, type: 1, line: match[2], key: key, time: 0, endTime: 0, node: undefined, judge: 0, executed: false });
                            bms.noteCnt++;
                        }
                        break;
                    case '31':
                    case '32':
                    case '33':
                    case '34':
                    case '35':
                    case '36':
                    case '38':
                    case '39':
                    case '41':
                    case '42':
                    case '43':
                    case '44':
                    case '45':
                    case '46':
                    case '48':
                    case '49':
                        if (key == '00') {
                            break;
                        }
                        lineNum = match[2][1];
                        bms.notes.push({ fraction: measure + fraction, type: 2, line: match[2], key: key, time: 0, executed: false });
                        break;
                    case '51':
                    case '52':
                    case '53':
                    case '54':
                    case '55':
                    case '56':
                    case '58':
                    case '59':
                    case '61':
                    case '62':
                    case '63':
                    case '64':
                    case '65':
                    case '66':
                    case '68':
                    case '69':
                        lineNum = match[2][0] - 4 + match[2][1];
                        if (lntype == 1) {
                            if (key == '00') {
                                break;
                            }
                            if (lastObj[lineNum] == '00') {
                                bms.notes.push({ fraction: measure + fraction, endFraction: -1, type: 1, line: lineNum, key: key, time: 0, endTime: 0, node: undefined, judge: 0, executed: false });
                                bms.noteCnt++;
                                lastObj[lineNum] = key;
                            } else {
                                const lineNotes = bms.notes.filter(note => note.type == 1 && note.line == lineNum && note.fraction < measure + fraction);
                                if (lineNotes) {
                                    const note = lineNotes[lineNotes.length - 1];
                                    note.endFraction = measure + fraction;
                                }
                                lastObj[lineNum] = '00';
                            }
                        } else if (lntype == 2) {
                            if (lastObj[lineNum] != key) {
                                if (lastObj[lineNum] != '00') {
                                    const lineNotes = bms.notes.filter(note => note.type == 1 && note.line == lineNum && note.fraction < measure + fraction);
                                    if (lineNotes) {
                                        const note = lineNotes[lineNotes.length - 1];
                                        note.endFraction = measure + fraction;
                                    }
                                }
                                if (key != '00') {
                                    bms.notes.push({ fraction: measure + fraction, endFraction: -1, type: 1, line: lineNum, key: key, time: 0, endTime: 0, node: undefined, judge: 0, executed: false });
                                    bms.noteCnt++;
                                }
                            }
                        }
                        break;
                    case 'D1':
                    case 'D2':
                    case 'D3':
                    case 'D4':
                    case 'D5':
                    case 'D6':
                    case 'D8':
                    case 'D9':
                    case 'E1':
                    case 'E2':
                    case 'E3':
                    case 'E4':
                    case 'E5':
                    case 'E6':
                    case 'E8':
                    case 'E9':
                        if (key == '00') {
                            break;
                        }
                        lineNum = String.fromCharCode(match[2][0].charCodeAt() - 19) + match[2][1];
                        bms.notes.push({ fraction: measure + fraction, type: 3, line: lineNum, damage: parseInt(key, 36), time: 0, executed: false });
                        break;
                }
            }
        });
    });
    bms.notes.sort((a, b) => a.fraction == b.fraction ? a.type - b.type : a.fraction - b.fraction);
    let bpmV = bms.bpm;
    let fractionV = 0;
    let offsetV = 0;
    let stack = [];
    for (let i = 0; i < bms.notes.length; i++) {
        switch (bms.notes[i].type) {
            case 0:
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                break;
            case 1:
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                if (bms.notes[i].endFraction >= 0) {
                    stack.push(i);
                }
                break;
            case 2:
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                break;
            case 3:
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                break;
            case 4:
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                break;
            case 5:
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                break;
            case 6:
                stack = stack.reduce((prev, n) => {
                    if (bms.notes[n].endFraction < bms.notes[i].fraction) {
                        bms.notes[n].endTime = fractionDiff(bms, fractionV, bms.notes[n].endFraction) * 240 / bpmV + offsetV;
                    } else {
                        prev.push(n);
                    }
                    return prev;
                }, []);
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                bpmV = bms.notes[i].bpm;
                fractionV = bms.notes[i].fraction;
                offsetV = bms.notes[i].time;
                break;
            case 7:
                stack = stack.reduce((prev, n) => {
                    if (bms.notes[n].endFraction < bms.notes[i].fraction) {
                        bms.notes[n].endTime = fractionDiff(bms, fractionV, bms.notes[n].endFraction) * 240 / bpmV + offsetV;
                    } else {
                        prev.push(n);
                    }
                    return prev;
                }, []);
                bms.notes[i].time = fractionDiff(bms, fractionV, bms.notes[i].fraction) * 240 / bpmV + offsetV;
                bms.notes[i].stop = bms.notes[i].stop * 240 / bpmV;
                offsetV += bms.notes[i].stop;
                break;
        }
    }
    stack.forEach(n => {
        bms.notes[n].endTime = fractionDiff(bms, fractionV, bms.notes[n].endFraction) * 240 / bpmV + offsetV;
    });
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

function fractionDiff(bms, a, b) {
    let negative = false;
    if (a > b) {
        [a, b] = [b, a];
        negative = true;
    }
    const aM = Math.floor(a);
    const bM = Math.floor(b);
    const aF = a - aM;
    const bF = b - bM;
    let sum;
    if (aM == bM) {
        sum = (bF - aF) * bms.signatures[aM];
    } else {
        sum = (1 - aF) * bms.signatures[aM] + bF * bms.signatures[bM];
        for (let i = aM + 1; i < bM; i++) {
            sum += bms.signatures[i];
        }
    }
    if (negative) {
        sum = -sum;
    }
    return sum;
}