"use strict";

let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');

localStorage["bg-color"] ||= "#1F2F2F";
localStorage["effect-color"] ||= "#FFA500";
localStorage["gauge-1-color"] ||= "#00BFFF";
localStorage["gauge-2-color"] ||= "#FFBF00";
localStorage["gear-color"] ||= "#DCDCDC";
localStorage["text-color"] ||= "#FFFFF0";
localStorage["bms-scratch-color"] ||= "#FF0000";
localStorage["bms-lower-color"] ||= "#FFFFFF";
localStorage["bms-higher-color"] ||= "#00BFFF";
localStorage["bms-mine-color"] ||= "#DC143C";
localStorage["bms-pgreat-color"] ||= "#C0C0C0";
localStorage["bms-great-color"] ||= "#FFD700";
localStorage["bms-good-color"] ||= "#ADFF2F";
localStorage["bms-bad-color"] ||= "#8A2BE2";
localStorage["bms-poor-color"] ||= "#8B0000";
localStorage["bms-p1-0-u"] ||= "ShiftLeft";
localStorage["bms-p1-0-d"] ||= "ControlLeft";
localStorage["bms-p1-1"] ||= "KeyZ";
localStorage["bms-p1-2"] ||= "KeyS";
localStorage["bms-p1-3"] ||= "KeyX";
localStorage["bms-p1-4"] ||= "KeyD";
localStorage["bms-p1-5"] ||= "KeyC";
localStorage["bms-p1-6"] ||= "KeyF";
localStorage["bms-p1-7"] ||= "KeyV";
localStorage["bms-p2-0-u"] ||= "ShiftRight";
localStorage["bms-p2-0-d"] ||= "ControlRight";
localStorage["bms-p2-1"] ||= "KeyM";
localStorage["bms-p2-2"] ||= "KeyK";
localStorage["bms-p2-3"] ||= "Comma";
localStorage["bms-p2-4"] ||= "KeyL";
localStorage["bms-p2-5"] ||= "Period";
localStorage["bms-p2-6"] ||= "SemiColon";
localStorage["bms-p2-7"] ||= "Slash";
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

let prevJudge = -1;
let prevJudgeTime = 0;
let combo = 0;
let gauge = 20;
let exScore = 0;

const pressC = {};

const judgeRange = {
    0: {
        5: 0.008,
        4: 0.024,
        3: 0.040,
        2: 0.200,
        0: 1,
    },
    1: {
        5: 0.015,
        4: 0.030,
        3: 0.060,
        2: 0.200,
        0: 1,
    },
    2: {
        5: 0.018,
        4: 0.040,
        3: 0.100,
        2: 0.200,
        0: 1,
    },
    3: {
        5: 0.021,
        4: 0.060,
        3: 0.120,
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
    p1: [localStorage["bms-p1-1"], localStorage["bms-p1-2"], localStorage["bms-p1-3"], localStorage["bms-p1-4"], localStorage["bms-p1-5"], localStorage["bms-p1-6"], localStorage["bms-p1-7"], localStorage["bms-p1-0-u"], localStorage["bms-p1-0-d"]],
    p2: [localStorage["bms-p2-1"], localStorage["bms-p2-2"], localStorage["bms-p2-3"], localStorage["bms-p2-4"], localStorage["bms-p2-5"], localStorage["bms-p2-6"], localStorage["bms-p2-7"], localStorage["bms-p2-0-u"], localStorage["bms-p2-0-d"]],
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
                setInterval(() => greatPulse = !greatPulse, 50);
                draw();
            });
        } else if (playing) {
            if (!autoC && !e.repeat) {
                switch (e.code) {
                    case keys.p1[0]:
                        keyPress('11');
                        break;
                    case keys.p1[1]:
                        keyPress('12');
                        break;
                    case keys.p1[2]:
                        keyPress('13');
                        break;
                    case keys.p1[3]:
                        keyPress('14');
                        break;
                    case keys.p1[4]:
                        keyPress('15');
                        break;
                    case keys.p1[5]:
                        keyPress('18');
                        break;
                    case keys.p1[6]:
                        keyPress('19');
                        break;
                    case keys.p1[7]:
                    case keys.p1[8]:
                        keyPress('16');
                        break;
                    case keys.p2[0]:
                        keyPress('21');
                        break;
                    case keys.p2[1]:
                        keyPress('22');
                        break;
                    case keys.p2[2]:
                        keyPress('23');
                        break;
                    case keys.p2[3]:
                        keyPress('24');
                        break;
                    case keys.p2[4]:
                        keyPress('25');
                        break;
                    case keys.p2[5]:
                        keyPress('28');
                        break;
                    case keys.p2[6]:
                        keyPress('29');
                        break;
                    case keys.p2[7]:
                    case keys.p2[8]:
                        keyPress('26');
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
            case keys.p1[0]:
                keyRelease('11');
                break;
            case keys.p1[1]:
                keyRelease('12');
                break;
            case keys.p1[2]:
                keyRelease('13');
                break;
            case keys.p1[3]:
                keyRelease('14');
                break;
            case keys.p1[4]:
                keyRelease('15');
                break;
            case keys.p1[5]:
                keyRelease('18');
                break;
            case keys.p1[6]:
                keyRelease('19');
                break;
            case keys.p1[7]:
            case keys.p1[8]:
                keyRelease('16');
                break;
            case keys.p2[0]:
                keyRelease('21');
                break;
            case keys.p2[1]:
                keyRelease('22');
                break;
            case keys.p2[2]:
                keyRelease('23');
                break;
            case keys.p2[3]:
                keyRelease('24');
                break;
            case keys.p2[4]:
                keyRelease('25');
                break;
            case keys.p2[5]:
                keyRelease('28');
                break;
            case keys.p2[6]:
                keyRelease('29');
                break;
            case keys.p2[7]:
            case keys.p2[8]:
                keyRelease('26');
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
            judge = 5;
        } else {
            if (Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][5]) {
                judge = 5;
            } else if (Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][4]) {
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
                    exeJudge(judge);
                }
            } else {
                exeJudge(judge);
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
        if (!autoC && Math.abs(currentTime - note.time) > judgeRange[bmsC.rank][2]) {
            exeJudge(1);
        } else {
            exeJudge(note.lazy);
        }
        note.executed = true;
    }
}

function exeJudge(judge) {
    prevJudge = judge;
    prevJudgeTime = audioCtx.currentTime - startTime;

    switch (judge) {
        case 5:
            combo++;
            gauge = Math.min(100, gauge + bmsC.total / bmsC.noteCnt);
            exScore += 2;
            break;
        case 4:
            combo++;
            gauge = Math.min(100, gauge + bmsC.total / bmsC.noteCnt);
            exScore++;
            break;
        case 3:
            combo++;
            gauge = Math.min(100, gauge + bmsC.total / bmsC.noteCnt / 2);
            break;
        case 2:
            combo = 0;
            gauge = Math.max(2, gauge - 2);
            break;
        case 1:
            combo = 0;
            gauge = Math.max(2, gauge - 6);
            break;
        case 0:
            gauge = Math.max(2, gauge - 4);
            break;
    }
}

const colorScheme = {
    background: localStorage["bg-color"],
    gear: localStorage["gear-color"],
    text: localStorage["text-color"],
    scratch: localStorage["bms-scratch-color"],
    lower: localStorage["bms-lower-color"],
    higher: localStorage["bms-higher-color"],
    mine: localStorage["bms-mine-color"],
    indicate: localStorage["effect-color"], // color when i press key
    gauge1: localStorage["gauge-1-color"],
    gauge2: localStorage["gauge-2-color"],
    pgreat: localStorage["bms-pgreat-color"],
    great: localStorage["bms-great-color"],
    good: localStorage["bms-good-color"],
    bad: localStorage["bms-bad-color"],
    poor: localStorage["bms-poor-color"],
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

let greatPulse = false;

let scrollSpeedVar = parseInt(localStorage["speed"]);

const bgaSize = 500;

const noteSize = 15;

const longNotePadding = 10;

const pressIndicateDuration = 0.1;

const linesData = {
    '16': { x: 0, w: 100, c: colorScheme.scratch },
    '11': { x: 100, w: 70, c: colorScheme.lower },
    '12': { x: 170, w: 50, c: colorScheme.higher },
    '13': { x: 220, w: 70, c: colorScheme.lower },
    '14': { x: 290, w: 50, c: colorScheme.higher },
    '15': { x: 340, w: 70, c: colorScheme.lower },
    '18': { x: 410, w: 50, c: colorScheme.higher },
    '19': { x: 460, w: 70, c: colorScheme.lower },
    '21': { x: 580, w: 70, c: colorScheme.lower },
    '22': { x: 650, w: 50, c: colorScheme.higher },
    '23': { x: 700, w: 70, c: colorScheme.lower },
    '24': { x: 770, w: 50, c: colorScheme.higher },
    '25': { x: 820, w: 70, c: colorScheme.lower },
    '28': { x: 890, w: 50, c: colorScheme.higher },
    '29': { x: 940, w: 70, c: colorScheme.lower },
    '26': { x: 1010, w: 100, c: colorScheme.scratch },
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
    const endLine = {
        1: '19',
        3: '26',
    }[bmsC.player];
    const gearWidth = linesData[endLine].x + linesData[endLine].w;
    ctx.fillStyle = colorScheme.text;
    ctx.beginPath();
    ctx.moveTo(cvs.width, cvs.height);
    for (let i = 0; i < analyseLength; i++) {
        ctx.lineTo(cvs.width - analyseData[i] / 256 * cvs.width / 6, cvs.height * (1 - i / analyseLength));
    }
    ctx.lineTo(cvs.width, 0);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = colorScheme.gear;
    ctx.fillRect(0, cvs.height - noteSize, gearWidth, noteSize);
    for (let i = 0; i < 1000; i++) {
        const y = (f2p(i) - pos) * cvs.height * scrollSpeedVar / 40;
        ctx.fillRect(0, cvs.height - y, gearWidth, 5);
    }
    Object.keys(linesData).filter(line => bmsC.player == 3 || line[0] == '1').map(line => linesData[line].x).forEach(x => ctx.fillRect(x - 5 / 2, 0, 5, cvs.height));
    if (bmsC.player == 3) {
        ctx.fillRect(linesData['19'].x + linesData['19'].w, 0, linesData['21'].x - linesData['19'].x - linesData['19'].w, cvs.height);
    }
    ctx.fillRect(gearWidth - 5 / 2, 0, 5, cvs.height);
    Object.keys(pressC).forEach(line => {
        let height = 0;
        if (pressC[line].pressed) {
            height = cvs.height;
        } else if (currentTime < pressC[line].time + pressIndicateDuration) {
            height = cvs.height * (pressC[line].time + pressIndicateDuration - currentTime) / pressIndicateDuration;
        }
        if (height > 0) {
            ctx.fillStyle = ctx.createLinearGradient(0, cvs.height - height, 0, cvs.height);
            ctx.fillStyle.addColorStop(0, "#00000000");
            ctx.fillStyle.addColorStop(1, colorScheme.indicate);
            ctx.fillRect(linesData[line].x, cvs.height - height, linesData[line].w, height);
        }
    });
    for (const note of bmsC.notes.filter(note => (note.type == 'not' || note.type == 'bom') && !note.executed)) {
        const y = (note.pos - pos) * cvs.height * scrollSpeedVar / 40;
        if (y > cvs.height) {
            break;
        }
        if (note.type == 'not') {
            ctx.fillStyle = linesData[note.line].c;
        } else if (note.type == 'bom') {
            ctx.fillStyle = colorScheme.mine;
        }
        ctx.fillRect(linesData[note.line].x, cvs.height - y, linesData[note.line].w, -noteSize);
    }
    bmsC.notes.filter(note => note.type == 'not' && note.end && !note.executed).forEach(note => {
        const start = bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.pos < note.pos).at(-1) || { pos: 0 };
        const y1 = (note.pos - pos) * cvs.height * scrollSpeedVar / 40;
        const y2 = Math.max(0, (start.pos - pos) * cvs.height * scrollSpeedVar / 40);
        if (y2 > cvs.height) {
            return;
        }
        ctx.fillStyle = linesData[note.line].c;
        ctx.fillRect(linesData[note.line].x + longNotePadding, cvs.height - y2, linesData[note.line].w - longNotePadding * 2, y2 - y1);
    });
    if (bmsC.notes.filter(note => (note.type == 'bom' || note.type == 'not') && !note.executed).length == 0) {
        const r = result[Math.floor(exScore / bmsC.noteCnt / 2 * 9)];
        ctx.fillStyle = colorScheme.result[r.toLowerCase()];
        ctx.font = "200px monospaced";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(`${r}`, (cvs.width + gearWidth) / 2, (cvs.height - bgaSize) / 4);
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect((cvs.width - gearWidth - bgaSize) / 2 + gearWidth, (cvs.height - bgaSize) / 2, bgaSize, bgaSize);
    if (bmpC[0]) {
        ctx.drawImage(bmpC[0], (cvs.width - gearWidth - bgaSize) / 2 + gearWidth, (cvs.height - bgaSize * bgaRatio[0]) / 2, bgaSize, bgaSize * bgaRatio[0]);
    }
    if (bmpC[1]) {
        ctx.drawImage(bmpC[1], (cvs.width - gearWidth - bgaSize) / 2 + gearWidth, (cvs.height - bgaSize * bgaRatio[1]) / 2, bgaSize, bgaSize * bgaRatio[1]);
    }
    ctx.fillStyle = colorScheme.text;
    ctx.font = "40px monospaced";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(`BPM ${Math.floor(bpmC).toString().substring(0, 3)}`, (cvs.width - gearWidth) / 2 + gearWidth, (cvs.height + bgaSize) / 2);
    ctx.fillText(`EXSCORE ${exScore} / ${bmsC.noteCnt * 2}`, (cvs.width - gearWidth) / 2 + gearWidth, (cvs.height + bgaSize) / 2 + 40);
    ctx.fillStyle = colorScheme.gauge1;
    ctx.fillRect(gearWidth, cvs.height * 5 / 6 - Math.floor(Math.min(gauge, 80) / 2) * cvs.height * 4 / 300, 20, Math.floor(Math.min(gauge, 80) / 2) * cvs.height * 4 / 300);
    ctx.fillStyle = colorScheme.gauge2;
    ctx.fillRect(gearWidth, cvs.height * 3 / 10 - Math.floor(Math.max(gauge - 80, 0) / 2) * cvs.height * 4 / 300, 20, Math.floor(Math.max(gauge - 80, 0) / 2) * cvs.height * 4 / 300);
    ctx.fillStyle = colorScheme.text;
    ctx.font = "30px monospaced";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText(`${Math.floor(gauge / 2) * 2}%`, gearWidth, cvs.height / 6);
    ctx.fillText(`${scrollSpeedVar / 10} x ${bpmC} = ${scrollSpeedVar * bpmC / 10}`, gearWidth, cvs.height);
    if (prevJudgeTime + 1 > currentTime) {
        ctx.font = "80px monospaced";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        switch (prevJudge) {
            case 0:
            case 1:
                ctx.fillStyle = colorScheme.poor;
                ctx.fillText(`POOR ${combo}`, gearWidth / 2, cvs.height * 3 / 4);
                if (poorBmpC) {
                    ctx.drawImage(poorBmpC, (cvs.width - gearWidth - bgaSize) / 2 + gearWidth, (cvs.height - bgaSize * poorBmpC.height / poorBmpC.width) / 2, bgaSize, bgaSize * poorBmpC.height / poorBmpC.width);
                }
                break;
            case 2:
                ctx.fillStyle = colorScheme.bad;
                ctx.fillText(`BAD ${combo}`, gearWidth / 2, cvs.height * 3 / 4);
                if (poorBmpC) {
                    ctx.drawImage(poorBmpC, (cvs.width - gearWidth - bgaSize) / 2 + gearWidth, (cvs.height - bgaSize * poorBmpC.height / poorBmpC.width) / 2, bgaSize, bgaSize * poorBmpC.height / poorBmpC.width);
                }
                break;
            case 3:
                ctx.fillStyle = colorScheme.good;
                ctx.fillText(`GOOD ${combo}`, gearWidth / 2, cvs.height * 3 / 4);
                break;
            case 4:
                if (greatPulse) {
                    ctx.fillStyle = colorScheme.great;
                    ctx.fillText(`GREAT ${combo}`, gearWidth / 2, cvs.height * 3 / 4);
                }
                break;
            case 5:
                ctx.fillStyle = colorScheme.pgreat;
                ctx.fillText(`GREAT ${combo}`, gearWidth / 2, cvs.height * 3 / 4);
                break;
        }
    }
}


const gpInput = {
    1: {
        2: false,
        4: false,
        0: false,
        5: false,
        1: false,
        7: false,
        15: false,
        12: false,
        13: false,
    },
    2: {
        2: false,
        4: false,
        0: false,
        5: false,
        1: false,
        7: false,
        15: false,
        12: false,
        13: false,
    },
};
const buttons = [2, 4, 0, 5, 1, 7, 15, 12, 13];
const buttonToKey = {
    2: '1',
    4: '2',
    0: '3',
    5: '4',
    1: '5',
    7: '8',
    15: '9',
    12: '6',
    13: '6',
};
function gamepadInput() {
    const gamepad = navigator.getGamepads();
    let player = 0;
    for (const gp of gamepad) {
        if (gp && player++ < 2) {
            for (const button of buttons) {
                if (gpInput[button] != gp.buttons[button].pressed) {
                    gpInput[button] = gp.buttons[button].pressed;
                    if (gpInput[button]) {
                        keyPress('' + player + buttonToKey[button]);
                    } else {
                        keyRelease('' + player + buttonToKey[button]);
                    }
                }
            }
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
        }))).then(wavs => wavs.reduce((prev, wav) => (prev[wav.key] = wav.buffer, prev), {})).then(wavs => bms.wavV = wavs).then(() => bms.notes = bms.notes.map(note => ({ ...note, executed: false }))).then(() => resolve(bms));
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