let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');
let video = document.getElementById('video');

let audioCtx;
let playing = false;
let startTime;
let bpmC;
let offsetC;
let timeC;
let indexC;
let bmpC;
let poorBmpC;

let prevJudge = 0;
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
    },
    1: {
        5: 0.015,
        4: 0.030,
        3: 0.060,
        2: 0.200,
    },
    2: {
        5: 0.018,
        4: 0.040,
        3: 0.100,
        2: 0.200,
    },
    3: {
        5: 0.021,
        4: 0.060,
        3: 0.120,
        2: 0.200,
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
    NaN: '몰?루',
};

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
var background = new Image();
background.src = "./img/bg3.jpeg";
background.onload = function () {
    ctx.drawImage(background, 0, 0, cvs.width, cvs.height);
    ctx.font = "100px serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Press Space to Start", cvs.width / 2, cvs.height / 2);
}

const keys = {
    p1: ["KeyZ", "KeyS", "KeyX", "KeyD", "KeyC", "ShiftLeft", "KeyF", "KeyV"],
    p2: ["KeyM", "KeyK", "Comma", "KeyL", "Period", "ShiftRight", "Semicolon", "Slash"],
    speed: ["Digit1", "Digit2"],
};

window.addEventListener('keydown', e => {
    if (e.code == 'Escape') {
        window.history.back();
    } else if (!playing && e.code == 'Space') {
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
        playing = true;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        loadBMS(bmsC).then(bms => {
            bmsC = bms;
            offsetC = 0;
            fractionC = 0;
            bpmC = bmsC.bpm;
            timeC = 0
            indexC = 0;
            startTime = audioCtx.currentTime + 1;
            poorBmpC = bmsC.bmps['00'];
            setInterval(update, 0);
            setInterval(setColor, 50);
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
                    keyPress('16');
                    break;
                case keys.p1[6]:
                    keyPress('18');
                    break;
                case keys.p1[7]:
                    keyPress('19');
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
                    keyPress('26');
                    break;
                case keys.p2[6]:
                    keyPress('28');
                    break;
                case keys.p2[7]:
                    keyPress('29');
                    break;
            }
        }
        switch (e.code) {
            case keys.speed[0]:
                scrollSpeedVar = Math.max(1, scrollSpeedVar - 1);
                break;
            case keys.speed[1]:
                scrollSpeedVar = Math.min(30, scrollSpeedVar + 1);
                break;
        }
    }
}, true);

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
                keyRelease('16');
                break;
            case keys.p1[6]:
                keyRelease('18');
                break;
            case keys.p1[7]:
                keyRelease('19');
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
                keyRelease('26');
                break;
            case keys.p2[6]:
                keyRelease('28');
                break;
            case keys.p2[7]:
                keyRelease('29');
                break;
        }
    }
}, true);

let stopC = false;

function update() {
    const currentTime = audioCtx.currentTime - startTime;
    if (stopC && timeC < currentTime) {
        stopC = false;
    }
    for (const note of bmsC.notes.filter(note => !note.executed && note.time < currentTime)) {
        if (stopC) {
            break;
        }
        switch (note.type) {
            case 0:
                play(bmsC.wavs[note.key]);
                note.executed = true;
                break;
            case 1:
                if (autoC) {
                    if (note.judge == 0) {
                        keyPress(note.line);
                    }
                    if (note.endFraction < 0 || (note.endFraction >= 0 && note.endTime < currentTime)) {
                        keyRelease(note.line);
                    }
                } else {
                    if (note.judge == 0 && currentTime - note.time > judgeRange[bmsC.rank][2]) {
                        note.judge = 1;
                        note.executed = true;
                        exeJudge(1);
                    } else if (note.endFraction >= 0 && note.judge > 0 && currentTime - note.endTime > judgeRange[bmsC.rank][2]) {
                        note.executed = true;
                        exeJudge(1);
                    }
                }
                break;
            case 2:
                if (currentTime - note.time > judgeRange[bmsC.rank][2]) {
                    note.executed = true;
                }
                break;
            case 3:
                bmpC = bmsC.bmps[note.bmp];
                if (bmpC instanceof HTMLVideoElement) {
                    bmpC.play();
                }
                note.executed = true;
                break;
            case 4:
                poorBmpC = bmsC.bmps[note.bmp];
                note.executed = true;
                break;
            case 5:
                bpmC = note.bpm;
                offsetC = fractionDiff(0, note.fraction);
                timeC = note.time;
                note.executed = true;
                break;
            case 6:
                stopC = true;
                offsetC = fractionDiff(0, note.fraction);
                timeC = note.time + note.stop;
                note.executed = true;
                break;
        }
    }
}

function keyPress(line) {
    const currentTime = audioCtx.currentTime - startTime;
    const note = bmsC.notes.filter(note => note.type == 1 && note.line == line && !note.executed && note.judge == 0)[0];

    pressC[line] = { pressed: true, time: currentTime };

    if (note) {
        if (note.endFraction < 0) {
            play(bmsC.wavs[note.key]);
        }

        let judge = 0;
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
            }
        }
        if (judge != 0) {
            note.judge = judge;
            if (note.endFraction < 0) {
                exeJudge(judge);
                note.executed = true;
            } else {
                if (judge > 2) {
                    note.node = play(bmsC.wavs[note.key]);
                } else {
                    exeJudge(judge);
                    note.executed = true;
                }
            }
        }
    } else {
        const note = bmsC.notes.filter(note => note.type == 2 && note.line == line && !note.executed)[0];
        if (note && Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][3]) {
            note.executed = true;
            gauge = Math.max(2, gauge - note.damage / 1296 * 100);
        }
    }
}

function keyRelease(line) {
    const currentTime = audioCtx.currentTime - startTime;
    const note = bmsC.notes.filter(note => note.type == 1 && note.line == line && note.endFraction >= 0 && !note.executed && note.judge > 0)[0];

    pressC[line] = { pressed: false, time: currentTime };

    if (note) {
        let judge = 0;
        if (autoC) {
            judge = 5;
        } else {
            if (Math.abs(currentTime - note.endTime) < judgeRange[bmsC.rank][5]) {
                judge = 5;
            } else if (Math.abs(currentTime - note.endTime) < judgeRange[bmsC.rank][4]) {
                judge = 4;
            } else if (Math.abs(currentTime - note.endTime) < judgeRange[bmsC.rank][3]) {
                judge = 3;
            } else if (Math.abs(currentTime - note.endTime) < judgeRange[bmsC.rank][2]) {
                judge = 2;
            } else {
                judge = 1;
            }
        }
        exeJudge(Math.min(note.judge, judge));
        if (judge < 2) {
            note.node.stop();
            combo = 0;
        }
        note.executed = true;
        note.node = undefined;
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
            gauge = Math.max(2, gauge - 4);
            break;
        case 1:
            combo = 0;
            gauge = Math.max(2, gauge - 6);
            break;
    }
}

localStorage["bg-color"] = localStorage["bg-color"] || "#1F2F2F";
localStorage["effect-color"] = localStorage["effect-color"] || "#FFA500";
localStorage["gauge-color"] = localStorage["gauge-color"] || "#00BFFF";
localStorage["gear-color"] = localStorage["gear-color"] || "#DCDCDC";
localStorage["text-color"] = localStorage["text-color"] || "#FFFFF0";
localStorage["scratch-color"] = localStorage["scratch-color"] || "#FF0000";
localStorage["lower-color"] = localStorage["lower-color"] || "#FFFFFF";
localStorage["higher-color"] = localStorage["higher-color"] || "#00BFFF";
localStorage["mine-color"] = localStorage["mine-color"] || "#DC143C";
localStorage["great-color"] = localStorage["great-color"] || "#FFD700";
localStorage["good-color"] = localStorage["good-color"] || "#ADFF2F";
localStorage["bad-color"] = localStorage["bad-color"] || "#8A2BE2";
localStorage["poor-color"] = localStorage["poor-color"] || "#8B0000";

const colorScheme = {
    background: localStorage["bg-color"],
    gear: localStorage["gear-color"],
    text: localStorage["text-color"],
    scratch: localStorage["scratch-color"],
    lower: localStorage["lower-color"],
    higher: localStorage["higher-color"],
    mine: localStorage["mine-color"],
    indicate: localStorage["effect-color"], // color when i press key
    gauge: localStorage["gauge-color"],
    pgreat: "#FFFFFF",
    great: localStorage["great-color"],
    good: localStorage["good-color"],
    bad: localStorage["bad-color"],
    poor: localStorage["poor-color"],
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
        "몰?루": "#FFFFFF",
    },
};

let greatPulse = false;

function setColor() {
    colorScheme.pgreat = `rgb(${Math.floor(Math.random() * 192 + 64)}, ${Math.floor(Math.random() * 192 + 64)}, ${Math.floor(Math.random() * 192 + 64)})`;
    greatPulse = !greatPulse;
}

const scrollSpeed = 200;
let scrollSpeedVar = 15;

const bgaSize = 500;

const noteSize = 15;

const pressIndicateDuration = 0.2;

function draw() {
    cvs.width = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
    cvs.height = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    ctx.fillStyle = colorScheme.background;
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    window.requestAnimationFrame(draw);
    const currentTime = audioCtx.currentTime - startTime;
    const fraction = stopC ? offsetC : (currentTime - timeC) * bpmC / 240 + offsetC;
    let bgaRatio = 0;
    if (bmpC instanceof HTMLVideoElement) {
        bgaRatio = bmpC.videoHeight / bmpC.videoWidth;
    } else if (bmpC instanceof HTMLImageElement) {
        bgaRatio = bmpC.height / bmpC.width;
    }
    switch (bmsC.player) {
        case 1:
            ctx.fillStyle = colorScheme.gear;
            ctx.fillRect(0, cvs.height - noteSize, 530, noteSize);
            for (let i = 0; i <= Math.ceil(bmsC.notes[bmsC.notes.length - 1].fraction); i++) {
                let y = (fractionDiff(0, i) - fraction) * scrollSpeed * scrollSpeedVar;
                ctx.fillRect(0, cvs.height - y, 530, 5);
            }
            ctx.fillRect(0 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(100 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(170 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(220 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(290 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(340 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(410 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(460 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(530 - 5 / 2, 0, 5, cvs.height);
            for (line of Object.keys(pressC)) {
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
                    switch (line) {
                        case '16':
                            ctx.fillRect(0, cvs.height - height, 100, height);
                            break;
                        case '11':
                            ctx.fillRect(100, cvs.height - height, 70, height);
                            break;
                        case '12':
                            ctx.fillRect(170, cvs.height - height, 50, height);
                            break;
                        case '13':
                            ctx.fillRect(220, cvs.height - height, 70, height);
                            break;
                        case '14':
                            ctx.fillRect(290, cvs.height - height, 50, height);
                            break;
                        case '15':
                            ctx.fillRect(340, cvs.height - height, 70, height);
                            break;
                        case '18':
                            ctx.fillRect(410, cvs.height - height, 50, height);
                            break;
                        case '19':
                            ctx.fillRect(460, cvs.height - height, 70, height);
                            break;
                    }
                }
            }
            for (note of bmsC.notes.filter(note => (note.type == 1 && note.endFraction < 0 && !note.executed) || (note.type == 2 && !note.executed))) {
                if (note.type == 1) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed * scrollSpeedVar;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    switch (note.line) {
                        case '16':
                            ctx.fillStyle = colorScheme.scratch;
                            ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '11':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '12':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '13':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '14':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '15':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '18':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '19':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                            break;
                    }
                }
                else if (note.type == 2) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed * scrollSpeedVar;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    ctx.fillStyle = colorScheme.mine; audioCtx.currentTime - startTime
                    switch (note.line) {
                        case '16':
                            ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '11':
                            ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '12':
                            ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '13':
                            ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '14':
                            ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '15':
                            ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '18':
                            ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '19':
                            ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                            break;
                    }
                }
            }
            for (note of bmsC.notes.filter(note => note.type == 1 && note.endFraction >= 0 && !note.executed)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed * scrollSpeedVar;
                let y2 = (fractionDiff(0, note.endFraction) - fraction) * scrollSpeed * scrollSpeedVar + noteSize;
                if (y1 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = colorScheme.scratch;
                        ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                        break;
                    case '11':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '12':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '13':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '14':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '15':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '18':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '19':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                        break;
                }
            }
            if (bmsC.notes.filter(note => !note.executed).length == 0) {
                const r = result[Math.floor(exScore / bmsC.noteCnt / 2 * 9)];
                ctx.fillStyle = colorScheme.result[r.toLowerCase()];
                ctx.font = "200px monospaced";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(`${r}`, (cvs.width + 530) / 2, (cvs.height - bgaSize) / 4);
            }
            if (bmpC) {
                ctx.drawImage(bmpC, (cvs.width - 530 - bgaSize) / 2 + 530, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = colorScheme.text;
            ctx.font = "40px monospaced";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            if (bpmC < 1000) {
                ctx.fillText(`BPM ${bpmC}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize) / 2);
            } else if (bpmC.toString().substring(bpmC.toString().length - 3) != '000') {
                ctx.fillText(`BPM ${bpmC.toString().substring(bpmC.toString().length - 3)}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize) / 2);
            } else {
                ctx.fillText(`BPM ${bpmC.toString().substring(0, 3)}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize) / 2);
            }
            ctx.fillText(`EXSCORE ${exScore}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize) / 2 + 40);
            ctx.fillStyle = colorScheme.gauge;
            ctx.fillRect(530, cvs.height * 5 / 6 - Math.floor(gauge / 2) * cvs.height * 4 / 300, 20, Math.floor(gauge / 2) * cvs.height * 4 / 300);
            ctx.fillStyle = colorScheme.text;
            ctx.font = "30px monospaced";
            ctx.textBaseline = "bottom";
            ctx.textAlign = "left";
            ctx.fillText(`${Math.floor(gauge / 2) * 2}%`, 530, cvs.height / 6);
            ctx.fillText(`x${scrollSpeedVar / 10}`, 530, cvs.height);
            if (prevJudgeTime + 1 > currentTime) {
                ctx.font = "80px monospaced";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                switch (prevJudge) {
                    case 1:
                        ctx.fillStyle = colorScheme.poor;
                        ctx.fillText(`POOR ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        if (poorBmpC) {
                            ctx.drawImage(poorBmpC, (cvs.width - 530 - bgaSize) / 2 + 530, (cvs.height - bgaSize * poorBmpC.height / poorBmpC.width) / 2, bgaSize, bgaSize * poorBmpC.height / poorBmpC.width);
                        }
                        break;
                    case 2:
                        ctx.fillStyle = colorScheme.bad;
                        ctx.fillText(`BAD ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        if (poorBmpC) {
                            ctx.drawImage(poorBmpC, (cvs.width - 530 - bgaSize) / 2 + 530, (cvs.height - bgaSize * poorBmpC.height / poorBmpC.width) / 2, bgaSize, bgaSize * poorBmpC.height / poorBmpC.width);
                        }
                        break;
                    case 3:
                        ctx.fillStyle = colorScheme.good;
                        ctx.fillText(`GOOD ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        break;
                    case 4:
                        if (greatPulse) {
                            ctx.fillStyle = colorScheme.great;
                            ctx.fillText(`GREAT ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        }
                        break;
                    case 5:
                        ctx.fillStyle = colorScheme.pgreat;
                        ctx.fillText(`GREAT ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        break;
                }
            }
            break;
        case 3:
            ctx.fillStyle = colorScheme.gear;
            ctx.fillRect(0, cvs.height - noteSize, 1110, noteSize);
            for (let i = 0; i <= Math.ceil(bmsC.notes[bmsC.notes.length - 1].fraction); i++) {
                let y = (fractionDiff(0, i) - fraction) * scrollSpeed * scrollSpeedVar;
                ctx.fillRect(0, cvs.height - y, 1110, 5);
            }
            ctx.fillRect(0 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(100 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(170 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(220 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(290 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(340 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(410 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(460 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(530 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(530, 0, 50, cvs.height);
            ctx.fillRect(580 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(650 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(700 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(770 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(820 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(890 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(940 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(1010 - 5 / 2, 0, 5, cvs.height);
            ctx.fillRect(1110 - 5 / 2, 0, 5, cvs.height);
            for (line of Object.keys(pressC)) {
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
                    switch (line) {
                        case '16':
                            ctx.fillRect(0, cvs.height - height, 100, height);
                            break;
                        case '11':
                            ctx.fillRect(100, cvs.height - height, 70, height);
                            break;
                        case '12':
                            ctx.fillRect(170, cvs.height - height, 50, height);
                            break;
                        case '13':
                            ctx.fillRect(220, cvs.height - height, 70, height);
                            break;
                        case '14':
                            ctx.fillRect(290, cvs.height - height, 50, height);
                            break;
                        case '15':
                            ctx.fillRect(340, cvs.height - height, 70, height);
                            break;
                        case '18':
                            ctx.fillRect(410, cvs.height - height, 50, height);
                            break;
                        case '19':
                            ctx.fillRect(460, cvs.height - height, 70, height);
                            break;
                        case '21':
                            ctx.fillRect(580, cvs.height - height, 70, height);
                            break;
                        case '22':
                            ctx.fillRect(650, cvs.height - height, 50, height);
                            break;
                        case '23':
                            ctx.fillRect(700, cvs.height - height, 70, height);
                            break;
                        case '24':
                            ctx.fillRect(770, cvs.height - height, 50, height);
                            break;
                        case '25':
                            ctx.fillRect(820, cvs.height - height, 70, height);
                            break;
                        case '28':
                            ctx.fillRect(890, cvs.height - height, 50, height);
                            break;
                        case '29':
                            ctx.fillRect(940, cvs.height - height, 70, height);
                            break;
                        case '26':
                            ctx.fillRect(1010, cvs.height - height, 100, height);
                            break;
                    }
                }
            }
            for (note of bmsC.notes.filter(note => (note.type == 1 && note.endFraction < 0 && !note.executed) || (note.type == 2 && !note.executed))) {
                if (note.type == 1) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed * scrollSpeedVar;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    switch (note.line) {
                        case '16':
                            ctx.fillStyle = colorScheme.scratch;
                            ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '11':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '12':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '13':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '14':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '15':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '18':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '19':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '21':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(580, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '22':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(650, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '23':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(700, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '24':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(770, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '25':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(820, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '28':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(890, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '29':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(940, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '26':
                            ctx.fillStyle = colorScheme.scratch;
                            ctx.fillRect(1010, cvs.height - y2, 100, y2 - y1);
                            break;
                    }
                }
                else if (note.type == 2) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed * scrollSpeedVar;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    ctx.fillStyle = colorScheme.mine;
                    switch (note.line) {
                        case '16':
                            ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '11':
                            ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '12':
                            ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '13':
                            ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '14':
                            ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '15':
                            ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '18':
                            ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '19':
                            ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '21':
                            ctx.fillRect(580, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '22':
                            ctx.fillRect(650, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '23':
                            ctx.fillRect(700, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '24':
                            ctx.fillRect(770, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '25':
                            ctx.fillRect(820, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '28':
                            ctx.fillRect(890, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '29':
                            ctx.fillRect(940, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '26':
                            ctx.fillRect(1010, cvs.height - y2, 100, y2 - y1);
                            break;
                    }
                }
            }
            for (note of bmsC.notes.filter(note => note.type == 1 && note.endFraction >= 0 && !note.executed)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed * scrollSpeedVar;
                let y2 = (fractionDiff(0, note.endFraction) - fraction) * scrollSpeed * scrollSpeedVar + noteSize;
                if (y1 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = colorScheme.scratch;
                        ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                        break;
                    case '11':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '12':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '13':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '14':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '15':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '18':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '19':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '21':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(580, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '22':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(650, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '23':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(700, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '24':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(770, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '25':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(820, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '28':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(890, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '29':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(940, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '26':
                        ctx.fillStyle = colorScheme.scratch;
                        ctx.fillRect(1010, cvs.height - y2, 100, y2 - y1);
                        break;
                }
            }
            if (bmsC.notes.filter(note => !note.executed).length == 0) {
                const r = result[Math.floor(exScore / bmsC.noteCnt / 2 * 9)];
                ctx.fillStyle = colorScheme.result[r.toLowerCase()];
                ctx.font = "200px monospaced";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(`${r}`, (cvs.width + 1110) / 2, (cvs.height - bgaSize) / 4);
            }
            if (bmpC) {
                ctx.drawImage(bmpC, (cvs.width - 1110 - bgaSize) / 2 + 1110, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = colorScheme.text;
            ctx.font = "40px monospaced";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            if (bpmC < 1000) {
                ctx.fillText(`BPM ${bpmC}`, (cvs.width - 1110) / 2 + 1110, (cvs.height + bgaSize) / 2);
            } else if (bpmC.toString().substring(bpmC.toString().length - 3) != '000') {
                ctx.fillText(`BPM ${bpmC.toString().substring(bpmC.toString().length - 3)}`, (cvs.width - 1110) / 2 + 1110, (cvs.height + bgaSize) / 2);
            } else {
                ctx.fillText(`BPM ${bpmC.toString().substring(0, 3)}`, (cvs.width - 1110) / 2 + 1110, (cvs.height + bgaSize) / 2);
            }
            ctx.fillText(`EXSCORE ${exScore}`, (cvs.width - 1110) / 2 + 1110, (cvs.height + bgaSize) / 2 + 40);
            ctx.fillStyle = colorScheme.gauge;
            ctx.fillRect(1110, cvs.height * 5 / 6 - Math.floor(gauge / 2) * cvs.height * 4 / 300, 20, Math.floor(gauge / 2) * cvs.height * 4 / 300);
            ctx.fillStyle = colorScheme.text;
            ctx.font = "30px monospaced";
            ctx.textBaseline = "bottom";
            ctx.textAlign = "left";
            ctx.fillText(`${Math.floor(gauge / 2) * 2}%`, 1110, cvs.height / 6);
            ctx.fillText(`x${scrollSpeedVar / 10}`, 1110, cvs.height);
            if (prevJudgeTime + 1 > currentTime) {
                ctx.font = "80px monospaced";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                switch (prevJudge) {
                    case 1:
                        ctx.fillStyle = colorScheme.poor;
                        ctx.fillText(`POOR ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        ctx.fillText(`POOR ${combo}`, 1690 / 2, cvs.height * 3 / 4);
                        if (poorBmpC) {
                            ctx.drawImage(poorBmpC, (cvs.width - 1110 - bgaSize) / 2 + 1110, (cvs.height - bgaSize * poorBmpC.height / poorBmpC.width) / 2, bgaSize, bgaSize * poorBmpC.height / poorBmpC.width);
                        }
                        break;
                    case 2:
                        ctx.fillStyle = colorScheme.bad;
                        ctx.fillText(`BAD ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        ctx.fillText(`BAD ${combo}`, 1690 / 2, cvs.height * 3 / 4);
                        if (poorBmpC) {
                            ctx.drawImage(poorBmpC, (cvs.width - 1110 - bgaSize) / 2 + 1110, (cvs.height - bgaSize * poorBmpC.height / poorBmpC.width) / 2, bgaSize, bgaSize * poorBmpC.height / poorBmpC.width);
                        }
                        break;
                    case 3:
                        ctx.fillStyle = colorScheme.good;
                        ctx.fillText(`GOOD ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        ctx.fillText(`GOOD ${combo}`, 1650 / 2, cvs.height * 3 / 4);
                        break;
                    case 4:
                        if (greatPulse) {
                            ctx.fillStyle = colorScheme.great;
                            ctx.fillText(`GREAT ${combo}`, 530 / 2, cvs.height * 3 / 4);
                            ctx.fillText(`GREAT ${combo}`, 1690 / 2, cvs.height * 3 / 4);
                        }
                        break;
                    case 5:
                        ctx.fillStyle = colorScheme.pgreat;
                        ctx.fillText(`GREAT ${combo}`, 530 / 2, cvs.height * 3 / 4);
                        ctx.fillText(`GREAT ${combo}`, 1690 / 2, cvs.height * 3 / 4);
                        break;
                }
            }
            break;
    }
}

function loadBMS(bms) {
    return new Promise(resolve => {
        for (const key of Object.keys(bms.bmps)) {
            switch (bms.bmps[key].split('.').pop()) {
                case 'mp4':
                case 'webm': {
                    const video = bms.bmps[key];
                    bms.bmps[key] = document.createElement('video');
                    bms.bmps[key].src = video;
                    bms.bmps[key].load
                    document.getElementById('bga').appendChild(bms.bmps[key]);
                    break;
                }
                case 'bmp':
                case 'png':
                case 'jpg': {
                    const image = bms.bmps[key];
                    bms.bmps[key] = document.createElement('img');
                    bms.bmps[key].src = image;
                    document.getElementById('bga').appendChild(bms.bmps[key]);
                    break;
                }
            }
        }
        audioCtx = new AudioContext();
        Promise.all(Object.keys(bms.bmps).filter(key => bms.bmps[key] instanceof HTMLVideoElement).map(key => {
            new Promise(res => {
                (function wait(key) {
                    if(bms.bmps[key].readyState == bms.bmps[key].HAVE_ENOUGH_DATA){
                        res();
                    } else {
                        setTimeout(wait, 0, key);
                    }
                })(key);
            });
        })).then(() => Promise.all(Object.keys(bms.wavs).map(wav => {
            if (wav.length > 0) {
                return new Promise(res => {
                    fetch(bms.wavs[wav]).then(response => response.arrayBuffer()).then(buffer => audioCtx.decodeAudioData(buffer)).then(buffer => res({ key: wav, buffer: buffer })).catch(_ => res({}));
                })
            }
        }))).then(wavs => wavs.reduce((prev, wav) => (prev[wav.key] = wav.buffer, prev), {})).then(wavs => {
            bms.wavs = wavs;
        }).then(() => resolve(bms));
    });
}

function fractionDiff(a, b) {
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
        sum = (bF - aF) * bmsC.signatures[aM];
    } else {
        sum = (1 - aF) * bmsC.signatures[aM] + bF * bmsC.signatures[bM];
        for (let i = aM + 1; i < bM; i++) {
            sum += bmsC.signatures[i];
        }
    }
    if (negative) {
        sum = -sum;
    }
    return sum;
}

function play(buffer) {
    if (buffer) {
        const node = audioCtx.createBufferSource();
        node.buffer = buffer;
        node.connect(audioCtx.destination);
        node.start();
        setTimeout(node => node.disconnect(), buffer.duration * 1000, node);
        return node;
    }
}