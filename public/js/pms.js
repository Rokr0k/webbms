"use strict";

let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');

localStorage["bg-color"] ||= "#1F2F2F";
localStorage["effect-color"] ||= "#FFA500";
localStorage["gauge-1-color"] ||= "#00BFFF";
localStorage["gauge-2-color"] ||= "#FFBF00";
localStorage["gear-color"] ||= "#DCDCDC";
localStorage["text-color"] ||= "#FFFFF0";
localStorage["pms-0-color"] ||= "#FFFFFF";
localStorage["pms-1-color"] ||= "#FFFF00";
localStorage["pms-2-color"] ||= "#00FF00";
localStorage["pms-3-color"] ||= "#00FFFF";
localStorage["pms-4-color"] ||= "#FF0000";
localStorage["pms-mine-color"] ||= "#808080";
localStorage["pms-cool-color"] ||= "#FF80FF";
localStorage["pms-great-color"] ||= "#FFFF80";
localStorage["pms-bad-color"] ||= "#FF4040";
localStorage["pms-poor-color"] ||= "#40FFFF";
localStorage["pms-0"] ||= "KeyC";
localStorage["pms-1"] ||= "KeyF";
localStorage["pms-2"] ||= "KeyV";
localStorage["pms-3"] ||= "KeyG";
localStorage["pms-4"] ||= "KeyB";
localStorage["pms-5"] ||= "KeyH";
localStorage["pms-6"] ||= "KeyN";
localStorage["pms-7"] ||= "KeyJ";
localStorage["pms-8"] ||= "KeyM";
localStorage["speed-down"] ||= "Digit1";
localStorage["speed-up"] ||= "Digit2";
localStorage["speed"] ||= 10;

let audioCtx;
let volumeNode;
let analyserNode;
let playing = false;
let startTime;
const bmpC = { 0: undefined, 1: undefined };
let poorBmpC;

let prevJudge = { 0: { judge: -1, time: 0 }, 1: { judge: -1, time: 0 }, 2: { judge: -1, time: 0 } };
let combo = 0;
let gauge = 20;
let exScore = 0;

const pressC = {};

const judgeRange = {
    0: {
        4: 0.015,
        3: 0.030,
        2: 0.200,
        0: 1,
    },
    1: {
        4: 0.020,
        3: 0.040,
        2: 0.200,
        0: 1,
    },
    2: {
        4: 0.025,
        3: 0.050,
        2: 0.200,
        0: 1,
    },
    3: {
        4: 0.030,
        3: 0.060,
        2: 0.200,
        0: 1,
    },
};

const result = {
    9: 'S',
    8: 'AAA',
    7: 'AA',
    6: 'A',
    5: 'B',
    4: 'C',
    3: 'D',
    2: 'E',
    1: 'F',
    0: 'F',
    NaN: 'NaN',
};

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

const keys = {
    p: [localStorage["pms-0"], localStorage["pms-1"], localStorage["pms-2"], localStorage["pms-3"], localStorage["pms-4"], localStorage["pms-5"], localStorage["pms-6"], localStorage["pms-7"], localStorage["pms-8"]],
    speed: [localStorage["speed-down"], localStorage["speed-up"]],
};

ctx.font = "100px serif";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.fillStyle = "white";
ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.fillText("Loading...", cvs.width / 2, cvs.height / 2);
ctx.strokeText("Loading...", cvs.width / 2, cvs.height / 2);
const background = document.createElement('img');
background.addEventListener('load', () => {
    ctx.drawImage(background, 0, 0, cvs.width, cvs.height);
    ctx.font = "100px serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillText("Loading...", cvs.width / 2, cvs.height / 2);
    ctx.strokeText("Loading...", cvs.width / 2, cvs.height / 2);
});
background.src = bmsC.stagefile;

loadBMS(bmsC).then(bms => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(background, 0, 0, cvs.width, cvs.height);
    ctx.font = "100px serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillText("Press Space to Start", cvs.width / 2, cvs.height / 2);
    ctx.strokeText("Press Space to Start", cvs.width / 2, cvs.height / 2);
    bmsC = bms;
    poorBmpC = bmsC.bmpV['00'];

    window.addEventListener('keydown', e => {
        if (!playing && e.code == 'Space') {
            readyBMS().then(() => {
                playing = true;
                startTime = audioCtx.currentTime + 5;
                setInterval(update, 0);
                draw();
            });
        } else if (playing) {
            if (!autoC && !e.repeat) {
                switch (e.code) {
                    case keys.p[0]:
                        keyPress('11');
                        break;
                    case keys.p[1]:
                        keyPress('12');
                        break;
                    case keys.p[2]:
                        keyPress('13');
                        break;
                    case keys.p[3]:
                        keyPress('14');
                        break;
                    case keys.p[4]:
                        keyPress('15');
                        break;
                    case keys.p[5]:
                        keyPress(bmsC.player == 1 ? '18' : '22');
                        break;
                    case keys.p[6]:
                        keyPress(bmsC.player == 1 ? '19' : '23');
                        break;
                    case keys.p[7]:
                        keyPress(bmsC.player == 1 ? '16' : '24');
                        break;
                    case keys.p[8]:
                        keyPress(bmsC.player == 1 ? '17' : '25');
                        break;
                }
            }
            switch (e.code) {
                case keys.speed[0]:
                    scrollSpeedVar = Math.max(1, scrollSpeedVar - 1);
                    localStorage.setItem('speed', scrollSpeedVar);
                    break;
                case keys.speed[1]:
                    scrollSpeedVar = Math.min(100, scrollSpeedVar + 1);
                    localStorage.setItem('speed', scrollSpeedVar);
                    break;
            }
        }
    }, true);
});

window.addEventListener('keyup', e => {
    if (playing && !autoC) {
        switch (e.code) {
            case keys.p[0]:
                keyRelease('11');
                break;
            case keys.p[1]:
                keyRelease('12');
                break;
            case keys.p[2]:
                keyRelease('13');
                break;
            case keys.p[3]:
                keyRelease('14');
                break;
            case keys.p[4]:
                keyRelease('15');
                break;
            case keys.p[5]:
                keyRelease(bmsC.player == 1 ? '18' : '22');
                break;
            case keys.p[6]:
                keyRelease(bmsC.player == 1 ? '19' : '23');
                break;
            case keys.p[7]:
                keyRelease(bmsC.player == 1 ? '16' : '24');
                break;
            case keys.p[8]:
                keyRelease(bmsC.player == 1 ? '17' : '25');
                break;
        }
    }
}, true);

function update() {
    const currentTime = audioCtx.currentTime - startTime;

    for (const note of bmsC.notes.filter(n => !n.executed && n.time < currentTime)) {
        switch (note.type) {
            case 'bgm':
                playWav(note.key);
                note.executed = true;
                break;
            case 'not':
                if (autoC) {
                    if (note.end) {
                        keyRelease(note.line);
                    } else {
                        keyPress(note.line);
                        const next = bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.pos > note.pos && !n.executed)[0];
                        if (!next || !next.end) {
                            keyRelease(note.line);
                        }
                    }
                } else {
                    if (note.end && note.lazy != -1) {
                        exeJudge(note.lazy);
                        note.executed = true;
                    } else if (currentTime - note.time > judgeRange[bmsC.rank][2]) {
                        note.executed = true;
                        exeJudge(1);
                        const next = bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.pos > note.pos && !n.executed)[0];
                        if (next && next.end) {
                            next.executed = true;
                        }
                    }
                }
                break;
            case 'inv':
                note.executed = true;
                break;
            case 'bom':
                if (currentTime - note.time > judgeRange[bmsC.rank][2]) {
                    note.executed = true;
                }
                break;
            case 'bmp':
                if (note.layer < 0) {
                    poorBmpC = bmsC.bmpV[note.key];
                } else {
                    bmpC[note.layer] = bmsC.bmpV[note.key];
                    if (bmpC[note.layer] instanceof HTMLVideoElement) {
                        bmpC[note.layer].play();
                    }
                }
                note.executed = true;
                break;
        }
    }
}

function keyPress(line) {
    const currentTime = audioCtx.currentTime - startTime;
    const note = bmsC.notes.filter(n => n.type == 'not' && !n.end && n.line == line && !n.executed)[0];

    pressC[line] = { pressed: true, time: currentTime };

    if (note) {
        playWav(note.key);

        let judge = -1;
        if (autoC) {
            judge = 4;
        } else {
            if (Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][4]) {
                judge = 4;
            } else if (Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][3]) {
                judge = 3;
            } else if (Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][2]) {
                judge = 2;
            } else if (note.time - currentTime < judgeRange[bmsC.rank][0]) {
                exeJudge(0);
            }
        }
        if (judge != -1) {
            const next = bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.pos > note.pos && !n.executed)[0];
            if (next && next.end) {
                if (judge > 2) {
                    next.lazy = judge;
                } else {
                    next.executed = true;
                    exeJudge(judge, line);
                }
            } else {
                exeJudge(judge, line);
            }
            note.executed = true;
        }
    } else {
        const note = bmsC.notes.filter(n => n.type == 'bom' && n.line == line && !n.executed)[0];
        if (note && Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][3]) {
            note.executed = true;
            gauge = Math.max(2, gauge - parseInt(note.key, 36) / 1296 * 100);
        } else {
            const note = bmsC.notes.filter(n => n.type == 'inv' && n.line == line && !n.executed)[0];
            if (note) {
                playWav(note.key);
            }
        }
    }
}

function keyRelease(line) {
    const currentTime = audioCtx.currentTime - startTime;
    const note = bmsC.notes.filter(n => n.type == 'not' && n.line == line && !n.executed)[0];

    pressC[line] = { pressed: false, time: currentTime };

    if (note && note.end) {
        if (!autoC) {
            if (Math.abs(currentTime - note.time) > judgeRange[bmsC.rank][2]) {
                exeJudge(1, line);
            } else {
                exeJudge(note.lazy, line);
            }
        } else {
            exeJudge(note.lazy, line);
        }
        note.executed = true;
    }
}

const lineToJudgeIndex = {
    '11': 0,
    '12': 0,
    '13': 0,
    '14': 1,
    '15': 1,
    '18': 1,
    '22': 1,
    '19': 2,
    '16': 2,
    '17': 2,
    '23': 2,
    '24': 2,
    '25': 2,
};

function exeJudge(judge, line) {
    prevJudge[lineToJudgeIndex[line]].judge = judge;
    prevJudge[lineToJudgeIndex[line]].time = audioCtx.currentTime - startTime;

    switch (judge) {
        case 4:
            combo++;
            gauge = Math.min(100, gauge + 200 / bmsC.noteCnt);
            exScore += 2;
            break;
        case 3:
            combo++;
            gauge = Math.min(100, gauge + 100 / bmsC.noteCnt);
            exScore++;
            break;
        case 2:
            combo = 0;
            gauge = Math.max(2, gauge - 4);
            break;
        case 1:
            combo = 0;
            gauge = Math.max(2, gauge - 6);
            break;
        case 0:
            gauge = Math.max(2, gauge - 2);
            break;
    }
}

const colorScheme = {
    background: localStorage["bg-color"],
    gear: localStorage["gear-color"],
    text: localStorage["text-color"],
    k0: localStorage["pms-0-color"],
    k1: localStorage["pms-1-color"],
    k2: localStorage["pms-2-color"],
    k3: localStorage["pms-3-color"],
    k4: localStorage["pms-4-color"],
    mine: localStorage["pms-mine-color"],
    gauge1: localStorage["gauge-1-color"],
    gauge2: localStorage["gauge-2-color"],
    cool: localStorage["pms-cool-color"],
    great: localStorage["pms-great-color"],
    bad: localStorage["pms-bad-color"],
    poor: localStorage["pms-poor-color"],
    result: {
        s: "#7FFFDA",
        aaa: "#FFD700",
        aa: "#EBCF80",
        a: "#D5C880",
        b: "C0C0C0",
        c: "#00FF7F",
        d: "#9370DB",
        e: "#FF1493",
        f: "#DC143C",
        nan: "#FFFFFF",
    },
};

let scrollSpeedVar = parseInt(localStorage["speed"]);

const pressIndicateDuration = 0.1;

const linesData = {
    '11': { i: 0, c: colorScheme.k0 },
    '12': { i: 1, c: colorScheme.k1 },
    '13': { i: 2, c: colorScheme.k2 },
    '14': { i: 3, c: colorScheme.k3 },
    '15': { i: 4, c: colorScheme.k4 },
    '18': { i: 5, c: colorScheme.k3 },
    '19': { i: 6, c: colorScheme.k2 },
    '16': { i: 7, c: colorScheme.k1 },
    '17': { i: 8, c: colorScheme.k0 },
    '22': { i: 5, c: colorScheme.k3 },
    '23': { i: 6, c: colorScheme.k2 },
    '24': { i: 7, c: colorScheme.k1 },
    '25': { i: 8, c: colorScheme.k0 },
};

function draw() {
    gamepadInput();
    cvs.width = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
    cvs.height = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    ctx.fillStyle = colorScheme.background;
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    window.requestAnimationFrame(draw);
    const currentTime = audioCtx.currentTime - startTime;
    const pos = timeToPos(currentTime);
    const bpmC = (bmsC.speedcore.filter(core => core.bpm != 0 && (core.time < currentTime || core.inclusive && core.time <= currentTime)).at(-1) || bmsC.speedcore[0]).bpm;
    const bgaSize = cvs.width / 6;
    const bgaRatio = [0, 0];
    if (bmpC[0] instanceof HTMLVideoElement) {
        bgaRatio[0] = bmpC[0].videoHeight / bmpC[0].videoWidth;
    } else if (bmpC[0] instanceof HTMLImageElement) {
        bgaRatio[0] = bmpC[0].height / bmpC[0].width;
    }
    if (bmpC[1] instanceof HTMLVideoElement) {
        bgaRatio[1] = bmpC[1].videoHeight / bmpC[1].videoWidth;
    } else if (bmpC[1] instanceof HTMLImageElement) {
        bgaRatio[1] = bmpC[1].height / bmpC[1].width;
    }
    const analyseLength = analyserNode.frequencyBinCount;
    const analyseData = new Uint8Array(analyseLength);
    analyserNode.getByteFrequencyData(analyseData);
    ctx.fillStyle = colorScheme.text;
    ctx.beginPath();
    ctx.moveTo(0, cvs.height);
    for (let i = 0; i < analyseLength; i++) {
        ctx.lineTo(analyseData[i] / 256 * cvs.width / 6, cvs.height * (1 - i / analyseLength));
    }
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.closePath();

    const noteWidth = cvs.width / 18;

    ctx.lineWidth = noteWidth / 20;

    Object.keys(linesData).filter(line => line[0] == '1').forEach(line => {
        ctx.fillStyle = linesData[line].c + '50';
        ctx.fillRect(noteWidth * linesData[line].i + cvs.width / 4, 0, noteWidth, cvs.height);
    });

    const p2c = p => (p - pos) * cvs.height * scrollSpeedVar / 40;
    const limit = cvs.height / p2c(pos + 1) + pos;

    ctx.fillStyle = colorScheme.gear;
    ctx.fillRect(cvs.width / 4, cvs.height - noteWidth / 2, cvs.width / 2, noteWidth / 2);
    for (let i = Math.max(0, Math.ceil(p2f(pos))); f2p(i) < limit; i++) {
        const y = p2c(f2p(i));
        ctx.fillRect(cvs.width / 4, cvs.height - y, cvs.width / 2, 5);
    }

    ctx.strokeStyle = colorScheme.background;

    Object.keys(pressC).forEach(line => {
        let fill = 0;
        if (pressC[line].pressed) {
            fill = 1;
        } else if (currentTime < pressC[line].time + pressIndicateDuration) {
            fill = (pressC[line].time + pressIndicateDuration - currentTime) / pressIndicateDuration;
        }
        if (fill > 0) {
            ctx.fillStyle = linesData[line].c + 'AC';
            ctx.fillRect(noteWidth * linesData[line].i + cvs.width / 4 + noteWidth * (1 - fill) / 2, 0, noteWidth * fill, cvs.height);
        }
    });
    bmsC.notes.filter(note => (note.type == 'not' && !note.end || note.type == 'bom') && note.pos < limit && !note.executed).forEach(note => {
        const y1 = p2c(note.pos);
        const y2 = y1 + noteWidth / 2;
        if (note.type == 'not') {
            ctx.fillStyle = linesData[note.line].c;
            ctx.fillRect(noteWidth * linesData[note.line].i + cvs.width / 4, cvs.height - y2, noteWidth, y2 - y1);
            ctx.strokeRect(noteWidth * linesData[note.line].i + cvs.width / 4, cvs.height - y2, noteWidth, y2 - y1);
        }
        else if (note.type == 'bom') {
            ctx.fillStyle = colorScheme.mine;
            ctx.fillRect(noteWidth * linesData[note.line].i + cvs.width / 4, cvs.height - y2, noteWidth, y2 - y1);
        }
    });
    const lastEnd = {};
    bmsC.notes.filter(n => n.type == 'not' && n.end && !n.executed).forEach(note => {
        if (lastEnd[note.line]) {
            return;
        }
        lastEnd[note.line] = note.pos >= limit;
        const start = bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.pos < note.pos).at(-1) || { pos: 0 };
        if (start.pos >= limit) {
            return;
        }
        ctx.fillStyle = linesData[note.line].c;
        ctx.fillRect(noteWidth * linesData[note.line].i + cvs.width / 4, cvs.height - y1, noteWidth, y1 - y2);
        ctx.strokeRect(noteWidth * linesData[note.line].i + cvs.width / 4, cvs.height - y1, noteWidth, y1 - y2);
        ctx.fillRect(noteWidth * linesData[note.line].i + cvs.width / 4, cvs.height - y2, noteWidth, noteWidth / 2);
        ctx.strokeRect(noteWidth * linesData[note.line].i + cvs.width / 4, cvs.height - y2, noteWidth, noteWidth / 2);
    });
    ctx.lineWidth = 5;
    if (bmsC.notes.filter(note => (note.type == 'bom' || note.type == 'not') && !note.executed).length == 0) {
        const r = result[Math.floor(exScore / bmsC.noteCnt / 2 * 9)];
        ctx.fillStyle = colorScheme.result[r.toLowerCase()];
        ctx.font = "200px monospaced";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(`${r}`, cvs.width / 2, cvs.height / 2);
        ctx.strokeText(`${r}`, cvs.width / 2, cvs.height / 2);
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect((cvs.width / 4 - bgaSize) / 2, cvs.height / 2 - bgaSize, bgaSize, bgaSize * 2);
    if (bmpC[0]) {
        ctx.drawImage(bmpC[0], (cvs.width / 4 - bgaSize) / 2, (cvs.height - bgaSize - bgaSize * bgaRatio[0]) / 2, bgaSize, bgaSize * bgaRatio[0]);
        ctx.drawImage(bmpC[0], (cvs.width / 4 - bgaSize) / 2, (cvs.height + bgaSize - bgaSize * bgaRatio[0]) / 2, bgaSize, bgaSize * bgaRatio[0]);
    }
    if (bmpC[1]) {
        ctx.drawImage(bmpC[1], (cvs.width / 4 - bgaSize) / 2, (cvs.height - bgaSize - bgaSize * bgaRatio[1]) / 2, bgaSize, bgaSize * bgaRatio[0]);
        ctx.drawImage(bmpC[1], (cvs.width / 4 - bgaSize) / 2, (cvs.height + bgaSize - bgaSize * bgaRatio[1]) / 2, bgaSize, bgaSize * bgaRatio[0]);
    }
    ctx.fillStyle = colorScheme.text;
    ctx.font = "40px monospaced";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    const clock = Math.floor(bmsC.notes[bmsC.notes.length - 1].time - currentTime);
    if (clock > 0) {
        ctx.fillText(String(Math.floor(clock / 60)) + ':' + String(clock % 60).padStart(2, '0'), cvs.width * 7 / 8, cvs.height - 140);
    }
    ctx.fillText(`BPM ${Math.floor(bpmC).toString().substring(0, 3)}`, cvs.width * 7 / 8, cvs.height - 100);
    ctx.fillText(`EXSCORE ${exScore} / ${bmsC.noteCnt * 2}`, cvs.width * 7 / 8, cvs.height - 60);
    ctx.fillStyle = colorScheme.gauge1;
    ctx.fillRect(cvs.width * 3 / 4, cvs.height * 5 / 6 - Math.min(gauge, 60) * cvs.height / 150, 20, Math.min(gauge, 60) * cvs.height / 150);
    ctx.fillStyle = colorScheme.gauge2;
    ctx.fillRect(cvs.width * 3 / 4, cvs.height * 13 / 30 - Math.max(gauge - 60, 0) * cvs.height / 150, 40, Math.max(gauge - 60, 0) * cvs.height / 150);
    ctx.fillStyle = colorScheme.text;
    ctx.font = "30px monospaced";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText(`${scrollSpeedVar / 10} x ${bpmC} = ${scrollSpeedVar * bpmC / 10}`, cvs.width * 3 / 4, cvs.height);
    ctx.font = "80px monospaced";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        if (prevJudge[i].time + 1 > currentTime) {
            switch (prevJudge[i].judge) {
                case 0:
                case 1:
                    ctx.fillStyle = colorScheme.poor;
                    ctx.fillText(`POOR`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                    ctx.strokeText(`POOR`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                    if (poorBmpC) {
                        ctx.drawImage(poorBmpC, (cvs.width / 4 - bgaSize) / 2, cvs.height / 2 - bgaSize, bgaSize, bgaSize * bgaRatio);
                        ctx.drawImage(poorBmpC, (cvs.width / 4 - bgaSize) / 2, cvs.height / 2, bgaSize, bgaSize * bgaRatio);
                    }
                    break;
                case 2:
                    ctx.fillStyle = colorScheme.bad;
                    ctx.fillText(`BAD`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                    ctx.strokeText(`BAD`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                    if (poorBmpC) {
                        ctx.drawImage(poorBmpC, (cvs.width / 4 - bgaSize) / 2, cvs.height / 2 - bgaSize, bgaSize, bgaSize * bgaRatio);
                        ctx.drawImage(poorBmpC, (cvs.width / 4 - bgaSize) / 2, cvs.height / 2, bgaSize, bgaSize * bgaRatio);
                    }
                    break;
                case 3:
                    ctx.fillStyle = colorScheme.great;
                    ctx.fillText(`GREAT`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                    ctx.strokeText(`GREAT`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                    break;
                case 4:
                    if (gauge < 100) {
                        ctx.fillStyle = colorScheme.cool;
                        ctx.fillText(`COOL`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.strokeText(`COOL`, cvs.width / 3 + cvs.width * i / 6, cvs.height * 3 / 4);
                    } else {
                        const oW = ctx.measureText('O');
                        const cW = ctx.measureText('C');
                        const lW = ctx.measureText('L');
                        ctx.fillStyle = colorScheme.k2;
                        ctx.fillText(`C`, cvs.width / 3 - oW.width - cW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.strokeText(`C`, cvs.width / 3 - oW.width - cW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.fillStyle = colorScheme.k1;
                        ctx.fillText(`O`, cvs.width / 3 - oW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.strokeText(`O`, cvs.width / 3 - oW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.fillStyle = colorScheme.k4;
                        ctx.fillText(`O`, cvs.width / 3 + oW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.strokeText(`O`, cvs.width / 3 + oW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.fillStyle = colorScheme.k3;
                        ctx.fillText(`L`, cvs.width / 3 + oW.width + lW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                        ctx.strokeText(`L`, cvs.width / 3 + oW.width + lW.width / 2 + cvs.width * i / 6, cvs.height * 3 / 4);
                    }
                    break;
            }
        }
    }
    const judgeArray = Object.keys(prevJudge).filter(i => prevJudge[i].judge > 0);
    if (judgeArray.length > 0) {
        const i = judgeArray.reduce((a, b) => prevJudge[a].time > prevJudge[b].time ? a : b);
        if (prevJudge[i].time + 1 > currentTime) {
            ctx.font = "50px monospaced";
            ctx.fillStyle = colorScheme.text;
            ctx.fillText(combo.toString(), cvs.width / 3 + cvs.width * i / 6, cvs.height * 7 / 8);
        }
    }
}

const gpInput = {
    3: false,
    1: false,
    5: false,
    0: false,
    4: false,
    2: false,
    7: false,
    12: false,
    6: false,
}
const buttons = [3, 1, 5, 0, 4, 2, 7, 12, 6];
const buttonToKey = {
    1: {
        3: '11',
        1: '12',
        5: '13',
        0: '14',
        4: '15',
        2: '18',
        7: '19',
        12: '16',
        6: '17',
    },
    3: {
        3: '11',
        1: '12',
        5: '13',
        0: '14',
        4: '15',
        2: '22',
        7: '23',
        12: '24',
        6: '25',
    },
};
function gamepadInput() {
    const gamepad = navigator.getGamepads();
    for (const gp of gamepad) {
        if (gp) {
            for (const button of buttons) {
                if (gpInput[button] != gp.buttons[button].pressed) {
                    gpInput[button] = gp.buttons[button].pressed;
                    if (gpInput[button]) {
                        keyPress(buttonToKey[bmsC.player][button]);
                    } else {
                        keyRelease(buttonToKey[bmsC.player][button]);
                    }
                }
            }
            break;
        }
    }
}

function loadBMS(bms) {
    return new Promise(resolve => {
        for (const key of Object.keys(bms.bmpV)) {
            switch (bms.bmpV[key].split('.').pop()) {
                case 'mp4':
                case 'webm': {
                    const video = bms.bmpV[key];
                    bms.bmpV[key] = document.createElement('video');
                    bms.bmpV[key].src = video;
                    document.getElementById('bga').appendChild(bms.bmpV[key]);
                    break;
                }
                case 'png':
                case 'jpg': {
                    const image = document.createElement('img');
                    image.src = bms.bmpV[key];
                    image.addEventListener('load', () => {
                        const buffer = document.createElement('canvas');
                        buffer.width = image.width;
                        buffer.height = image.height;
                        const bufferCtx = buffer.getContext('2d');
                        bufferCtx.drawImage(image, 0, 0);
                        const imageData = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);
                        for (let i = 0; i < imageData.data.length; i += 4) {
                            if (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2] == 0) {
                                imageData.data[i + 3] = 0;
                            }
                        }
                        bufferCtx.putImageData(imageData, 0, 0);
                        bms.bmpV[key] = document.createElement('img');
                        console.log(buffer.toDataURL());
                        bms.bmpV[key].src = buffer.toDataURL();
                        document.getElementById('bga').appendChild(bms.bmpV[key]);
                    });
                    break;
                }
            }
        }
        Promise.all(Object.keys(bms.bmpV).filter(key => bms.bmpV[key] instanceof HTMLVideoElement).map(key => {
            new Promise(res => {
                (function wait(key) {
                    if (bms.bmpV[key].readyState == bms.bmpV[key].HAVE_ENOUGH_DATA) {
                        res();
                    } else {
                        setTimeout(wait, 0, key);
                    }
                })(key);
            });
        })).then(() => Promise.all(Object.keys(bms.wavV).map(wav => {
            if (wav.length > 0) {
                return new Promise(res => {
                    fetch(bms.wavV[wav]).then(response => response.arrayBuffer()).then(buffer => res({ key: wav, buffer: buffer })).catch(_ => res({}));
                });
            }
        }))).then(wavs => wavs.reduce((prev, wav) => (prev[wav.key] = wav.buffer, prev), {})).then(wavs => bms.wavV = wavs).then(() => bms.notes = bms.notes.map(note => note.end ? { ...note, lazy: -1 } : note)).then(() => resolve(bms));
    });
}

function readyBMS() {
    return new Promise(resolve => {
        audioCtx = new AudioContext();
        volumeNode = new GainNode(audioCtx, { gain: 1 });
        analyserNode = new AnalyserNode(audioCtx, { fftSize: 512 });
        analyserNode.connect(volumeNode).connect(audioCtx.destination);
        Promise.all(Object.keys(bmsC.wavV).filter(wav => bmsC.wavV[wav]).map(wav => audioCtx.decodeAudioData(bmsC.wavV[wav]).then(buffer => bmsC.wavV[wav] = buffer))).then(() => resolve());
    });
}

function f2p(f) {
    const measure = Math.floor(f);
    return [...new Array(measure).keys()].reduce((p, m) => p + (bmsC.signatures[m] || 1), (f - measure) * (bmsC.signatures[measure] || 1)) * 4;
}

function p2f(p) {
    p /= 4;
    let measure = 0;
    while (p > 0) {
        p -= bmsC.signatures[measure++] || 1;
    }
    while (p < 0) {
        p += bmsC.signatures[--measure] || 1;
    }
    return measure + p / (bmsC.signatures[measure] || 1);
}

function timeToPos(time) {
    const core = bmsC.speedcore.filter(core => core.time < time || core.inclusive && core.time <= time).at(-1) || bmsC.speedcore[0];
    return core.pos + (time - core.time) * core.bpm / 60;
}

const nodes = {};

function playWav(key) {
    if (bmsC.wavV[key]) {
        if (nodes[key]) {
            nodes[key].stop();
        }
        nodes[key] = new AudioBufferSourceNode(audioCtx, { buffer: bmsC.wavV[key] });
        nodes[key].connect(analyserNode);
        nodes[key].start();
        setTimeout(node => node.disconnect(), bmsC.wavV[key].duration * 1000, nodes[key]);
    }
}

function stopWav(key) {
    if (nodes[key]) {
        nodes[key].stop();
    }
}