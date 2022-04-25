const fs = require('fs');
const iconv = require('iconv-lite');

module.exports = function (filename) {
    filename = filename.replace(/\\/g, '/');
    const buffer = fs.readFileSync('public/' + filename);
    const text = iconv.decode(buffer, "shift-jis");
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
        signatures: Array(1000).fill(1),
        notes: [],
        speedcore: [{ fraction: 0, time: 0, bpm: 130, inclusive: true }],
    };
    let lnobj = '00';
    const bpms = {};
    const stops = {};
    const lastObj = {
        '51': '00', '52': '00', '53': '00', '54': '00', '55': '00', '56': '00', '58': '00', '59': '00',
        '61': '00', '62': '00', '63': '00', '64': '00', '65': '00', '66': '00', '68': '00', '69': '00',
    };
    const wavProc = [".wav", ".mp3", ".ogg", ".webm", ".flac"];
    const bmpProc = [".png", ".jpg", ".mp4", ".webm"];
    let randomGenerated = 0;
    const ifStack = [false];
    const speedcore = [];
    const notes = [];
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
                bms.stagefile = encodeURIComponent(path);
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
                bms.wavs[match[1]] = encodeURIComponent(path);
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
                bms.bmps[match[1]] = encodeURIComponent(path);
            }
        }).when(/^#BPM (\d+(\.\d+)?(E\+\d+)?)$/i, match => {
            if (skipped) {
                return;
            }
            bms.speedcore[0].bpm = parseFloat(match[1]);
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
            const length = Math.floor(match[3].length / 2);
            for (let i = 0; i < length; i++) {
                const fraction = i / length;
                const key = match[3].substring(i * 2, i * 2 + 2);
                switch (match[2]) {
                    case '01':
                        if (key == '00') {
                            break;
                        }
                        notes.push({ fraction: measure + fraction, type: 'bgm', key: key });
                        break;
                    case '03':
                        if (key == '00') {
                            break;
                        }
                        speedcore.push({ fraction: measure + fraction, type: 'bpm', bpm: parseInt(key, 16) });
                        break;
                    case '04':
                        if (key == '00') {
                            break;
                        }
                        notes.push({ fraction: measure + fraction, type: 'bmp', bmp: key, layer: 0 });
                        break;
                    case '06':
                        if (key == '00') {
                            break;
                        }
                        notes.push({ fraction: measure + fraction, type: 'pbmp', bmp: key });
                        break;
                    case '07':
                        if (key == '00') {
                            break;
                        }
                        notes.push({ fraction: measure + fraction, type: 'bmp', bmp: key, layer: 1 });
                        break;
                    case '08':
                        if (key == '00') {
                            break;
                        }
                        speedcore.push({ fraction: measure + fraction, type: 'bpm', bpm: bpms[key] });
                        break;
                    case '09':
                        if (key == '00') {
                            break;
                        }
                        speedcore.push({ fraction: measure + fraction, type: 'stp', stop: stops[key] });
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
                        notes.push({ fraction: measure + fraction, type: 'not', line: match[2], key: key, end: key == lnobj });
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
                        notes.push({ fraction: measure + fraction, type: 'inv', line: match[2][0] - 2 + match[2][1], key: key });
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
                        if (key == '00') {
                            break;
                        }
                        if (lastObj[match[2]] == key) {
                            notes.push({ fraction: measure + fraction, type: 'not', line: match[2][0] - 4 + match[2][1], key: key, end: true });
                            lastObj[match[2]] = '00';
                        } else {
                            notes.push({ fraction: measure + fraction, type: 'not', line: match[2][0] - 4 + match[2][1], key: key, end: false });
                            lastObj[match[2]] = key;
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
                        notes.push({ fraction: measure + fraction, type: 'bom', line: String.fromCharCode(match[2][0].charCodeAt() - 19) + match[2][1], damage: parseInt(key, 36) });
                        break;
                }
            }
        });
    });
    speedcore.sort((a, b) => a.fraction - b.fraction);
    for (const core of speedcore) {
        const last = bms.speedcore.filter(s => s.fraction < core.fraction || (s.inclusive && s.fraction == core.fraction)).reverse()[0];
        switch (core.type) {
            case 'bpm':
                bms.speedcore.push({ fraction: core.fraction, time: fractionDiff(bms.signatures, last.fraction, core.fraction) * (last.bpm == 0 ? 0 : 240 / last.bpm) + last.time, bpm: core.bpm, inclusive: true });
                break;
            case 'stp':
                bms.speedcore.push({ fraction: core.fraction, time: fractionDiff(bms.signatures, last.fraction, core.fraction) * (last.bpm == 0 ? 0 : 240 / last.bpm) + last.time, bpm: 0, inclusive: true });
                bms.speedcore.push({ fraction: core.fraction, time: (fractionDiff(bms.signatures, last.fraction, core.fraction) + core.stop) * (last.bpm == 0 ? 0 : 240 / last.bpm) + last.time, bpm: last.bpm, inclusive: false });
                break;
        }
    }
    notes.sort((a, b) => a.fraction - b.fraction);
    for (const note of notes) {
        const core = bms.speedcore.filter(s => s.fraction < note.fraction || (s.inclusive && s.fraction == note.fraction)).reverse()[0];
        bms.notes.push({ ...note, time: fractionDiff(bms.signatures, core.fraction, note.fraction) * (core.bpm == 0 ? 0 : 240 / core.bpm) + core.time, executed: false });
        if (note.type == 'not') {
            bms.noteCnt++;
        }
    }
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

function fractionDiff(signatures, a, b) {
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
        sum = (bF - aF) * signatures[aM];
    } else {
        sum = (1 - aF) * signatures[aM] + bF * signatures[bM];
        for (let i = aM + 1; i < bM; i++) {
            sum += signatures[i];
        }
    }
    if (negative) {
        sum = -sum;
    }
    return sum;
}