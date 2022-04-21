let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');
let video = document.getElementById('video');

localStorage["bg-color"] ||= "#1F2F2F";
localStorage["effect-color"] ||= "#FFA500";
localStorage["gauge-color"] ||= "#00BFFF";
localStorage["gear-color"] ||= "#DCDCDC";
localStorage["text-color"] ||= "#FFFFF0";
localStorage["scratch-color"] ||= "#FF0000";
localStorage["lower-color"] ||= "#FFFFFF";
localStorage["higher-color"] ||= "#00BFFF";
localStorage["mine-color"] ||= "#DC143C";
localStorage["great-color"] ||= "#C0C0C0";
localStorage["great-color"] ||= "#FFD700";
localStorage["good-color"] ||= "#ADFF2F";
localStorage["bad-color"] ||= "#8A2BE2";
localStorage["poor-color"] ||= "#8B0000";
localStorage["p1-0"] ||= "ShiftLeft";
localStorage["p1-1"] ||= "KeyZ";
localStorage["p1-2"] ||= "KeyS";
localStorage["p1-3"] ||= "KeyX";
localStorage["p1-4"] ||= "KeyD";
localStorage["p1-5"] ||= "KeyC";
localStorage["p1-6"] ||= "KeyF";
localStorage["p1-7"] ||= "KeyV";
localStorage["p2-0"] ||= "ShiftRight";
localStorage["p2-1"] ||= "KeyM";
localStorage["p2-2"] ||= "KeyK";
localStorage["p2-3"] ||= "Comma";
localStorage["p2-4"] ||= "KeyL";
localStorage["p2-5"] ||= "Period";
localStorage["p2-6"] ||= "SemiColon";
localStorage["p2-7"] ||= "Slash";
localStorage["speed-down"] ||= "Digit1";
localStorage["speed-up"] ||= "Digit2";
localStorage["speed"] ||= 10;

let audioCtx;
let volumeNode;
let analyserNode;
let playing = false;
let startTime;
let speedcoreIdx;
const bmpC = { 0: undefined, 1: undefined };
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
    NaN: 'NaN',
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
    p1: [localStorage["p1-1"], localStorage["p1-2"], localStorage["p1-3"], localStorage["p1-4"], localStorage["p1-5"], localStorage["p1-0"], localStorage["p1-6"], localStorage["p1-7"]],
    p2: [localStorage["p2-1"], localStorage["p2-2"], localStorage["p2-3"], localStorage["p2-4"], localStorage["p2-5"], localStorage["p2-0"], localStorage["p2-6"], localStorage["p2-7"]],
    speed: [localStorage["speed-down"], localStorage["speed-up"]],
};

window.addEventListener('keydown', e => {
    if (!playing && e.code == 'Space') {
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
        playing = true;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        loadBMS(bmsC).then(bms => {
            bmsC = bms;
            speedcoreIdx = 0;
            startTime = audioCtx.currentTime + 5;
            poorBmpC = bmsC.bmps['00'];
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
                localStorage.setItem('speed', scrollSpeedVar);
                break;
            case keys.speed[1]:
                scrollSpeedVar = Math.min(100, scrollSpeedVar + 1);
                localStorage.setItem('speed', scrollSpeedVar);
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

function update() {
    const currentTime = audioCtx.currentTime - startTime;

    for (const note of bmsC.notes.filter(n => !n.executed && n.time < currentTime)) {
        switch (note.type) {
            case 'bgm':
                play(bmsC.wavs[note.key]);
                note.executed = true;
                break;
            case 'not':
                if (autoC) {
                    if (note.end) {
                        keyRelease(note.line);
                    } else {
                        keyPress(note.line);
                        const next = bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.time > note.time && !n.executed)[0];
                        if (!next || !next.end) {
                            keyRelease(note.line);
                        }
                    }
                } else {
                    if (currentTime - note.time > judgeRange[bmsC.rank][2]) {
                        note.executed = true;
                        exeJudge(1);
                        const next = bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.time > note.time && !n.executed)[0];
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
                bmpC[note.layer] = bmsC.bmps[note.bmp];
                if (bmpC[note.layer] instanceof HTMLVideoElement) {
                    bmpC[note.layer].play();
                }
                note.executed = true;
                break;
            case 'pbmp':
                poorBmpC = bmsC.bmps[note.bmp];
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
        play(bmsC.wavs[note.key]);

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
            exeJudge(judge);
            note.executed = true;
        }
    } else {
        const note = bmsC.notes.filter(n => n.type == 'inv' && n.line == line && !n.executed)[0];
        if (note) {
            play(bmsC.wavs[note.key]);
        } else {
            const note = bmsC.notes.filter(n => n.type == 'bom' && n.line == line && !n.executed)[0];
            if (note && Math.abs(currentTime - note.time) < judgeRange[bmsC.rank][3]) {
                note.executed = true;
                gauge = Math.max(2, gauge - note.damage / 1296 * 100);
            }
        }
    }
}

function keyRelease(line) {
    const currentTime = audioCtx.currentTime - startTime;
    const note = bmsC.notes.filter(n => n.type == 'not' && n.line == line && !n.executed)[0];

    pressC[line] = { pressed: false, time: currentTime };

    if (note && note.end) {
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
        exeJudge(judge);
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
            gauge = Math.max(2, gauge - 4);
            break;
        case 1:
            combo = 0;
            gauge = Math.max(2, gauge - 6);
            break;
    }
}

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
    pgreat: localStorage["pgreat-color"],
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
        nan: "#FFFFFF",
    },
};

let greatPulse = false;

let scrollSpeedVar = parseInt(localStorage["speed"]);

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
    while (speedcoreIdx + 1 < bmsC.speedcore.length && bmsC.speedcore[speedcoreIdx + 1].time < currentTime) {
        speedcoreIdx++;
    }
    const fraction = timeToFraction(currentTime);
    const bpmC = bmsC.speedcore[speedcoreIdx].bpm == 0 && speedcoreIdx > 0 ? bmsC.speedcore[speedcoreIdx - 1].bpm : bmsC.speedcore[speedcoreIdx].bpm;
    let bgaRatio = 0;
    if (bmpC[0] instanceof HTMLVideoElement) {
        bgaRatio = bmpC[0].videoHeight / bmpC[0].videoWidth;
    } else if (bmpC[0] instanceof HTMLImageElement) {
        bgaRatio = bmpC[0].height / bmpC[0].width;
    } else if (bmpC[1] instanceof HTMLVideoElement) {
        bgaRatio = bmpC[1].videoHeight / bmpC[1].videoWidth;
    } else if (bmpC[1] instanceof HTMLImageElement) {
        bgaRatio = bmpC[1].height / bmpC[1].width;
    }
    const analyseLength = analyserNode.frequencyBinCount;
    const analyseData = new Uint8Array(analyseLength);
    analyserNode.getByteFrequencyData(analyseData);
    ctx.fillStyle = colorScheme.text;
    ctx.beginPath();
    ctx.moveTo(cvs.width, cvs.height);
    for (let i = 0; i < analyseLength; i++) {
        ctx.lineTo(cvs.width - analyseData[i] / 256 * cvs.width / 6, cvs.height * (1 - i / analyseLength));
    }
    ctx.lineTo(cvs.width, 0);
    ctx.fill();
    ctx.closePath();
    switch (bmsC.player) {
        case 1:
            ctx.fillStyle = colorScheme.gear;
            ctx.fillRect(0, cvs.height - noteSize, 530, noteSize);
            for (let i = 0; i <= Math.ceil(bmsC.notes[bmsC.notes.length - 1].fraction); i++) {
                let y = (fractionDiff(0, i) - fraction) * cvs.height * scrollSpeedVar / 10;
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
            for (note of bmsC.notes.filter(note => (note.type == 'not' && !note.executed) || (note.type == 'bom' && !note.executed))) {
                if (note.type == 'not') {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
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
                else if (note.type == 'bom') {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
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
            for (note of bmsC.notes.filter(note => note.type == 'not' && note.end && !note.executed)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
                let y2 = (fractionDiff(0, (bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.fraction < note.fraction).reverse()[0] || { fraction: 0 }).fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
                if (y2 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = colorScheme.scratch;
                        ctx.fillRect(0 + 10, cvs.height - y2, 100 - 20, y2 - y1);
                        break;
                    case '11':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(100 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '12':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(170 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '13':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(220 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '14':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(290 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '15':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(340 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '18':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(410 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '19':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(460 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                }
            }
            if (bmsC.notes.filter(note => (note.type == 'bom' || note.type == 'not') && !note.executed).length == 0) {
                const r = result[Math.floor(exScore / bmsC.noteCnt / 2 * 9)];
                ctx.fillStyle = colorScheme.result[r.toLowerCase()];
                ctx.font = "200px monospaced";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(`${r}`, (cvs.width + 530) / 2, (cvs.height - bgaSize) / 4);
            }
            if (bmpC[0]) {
                ctx.drawImage(bmpC[0], (cvs.width - 530 - bgaSize) / 2 + 530, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            if (bmpC[1]) {
                ctx.drawImage(bmpC[1], (cvs.width - 530 - bgaSize) / 2 + 530, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = colorScheme.text;
            ctx.font = "40px monospaced";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText(`BPM ${Math.round(bpmC * 100) / 100 % 1000}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize) / 2);
            ctx.fillText(`EXSCORE ${exScore} / ${bmsC.noteCnt * 2}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize) / 2 + 40);
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
                let y = (fractionDiff(0, i) - fraction) * cvs.height * scrollSpeedVar / 10;
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
            for (note of bmsC.notes.filter(note => (note.type == 'not' && !note.executed) || (note.type == 'bom' && !note.executed))) {
                if (note.type == 'not') {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
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
                else if (note.type == 'bom') {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
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
            for (note of bmsC.notes.filter(note => note.type == 'not' && note.end && !note.executed)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
                let y2 = (fractionDiff(0, (bmsC.notes.filter(n => n.type == 'not' && n.line == note.line && n.fraction < note.fraction).reverse()[0] || { fraction: 0 }).fraction) - fraction) * cvs.height * scrollSpeedVar / 10;
                if (y2 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = colorScheme.scratch;
                        ctx.fillRect(0 + 10, cvs.height - y2, 100 - 20, y2 - y1);
                        break;
                    case '11':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(100 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '12':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(170 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '13':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(220 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '14':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(290 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '15':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(340 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '18':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(410 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '19':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(460 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '21':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(580 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '22':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(650 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '23':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(700 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '24':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(770 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '25':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(820 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '28':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(890 + 10, cvs.height - y2, 50 - 20, y2 - y1);
                        break;
                    case '29':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(940 + 10, cvs.height - y2, 70 - 20, y2 - y1);
                        break;
                    case '26':
                        ctx.fillStyle = colorScheme.scratch;
                        ctx.fillRect(1010 + 10, cvs.height - y2, 100 - 20, y2 - y1);
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
            if (bmpC[0]) {
                ctx.drawImage(bmpC[0], (cvs.width - 1110 - bgaSize) / 2 + 1110, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            if (bmpC[1]) {
                ctx.drawImage(bmpC[1], (cvs.width - 1110 - bgaSize) / 2 + 1110, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = colorScheme.text;
            ctx.font = "40px monospaced";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText(`BPM ${Math.round(bpmC * 100) / 100 % 1000}`, (cvs.width - 1110) / 2 + 1110, (cvs.height + bgaSize) / 2);
            ctx.fillText(`EXSCORE ${exScore} / ${bmsC.noteCnt * 2}`, (cvs.width - 1110) / 2 + 1110, (cvs.height + bgaSize) / 2 + 40);
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
        volumeNode = new GainNode(audioCtx, { gain: 1 });
        analyserNode = new AnalyserNode(audioCtx, { fftSize: 512 });
        analyserNode.connect(volumeNode).connect(audioCtx.destination);
        Promise.all(Object.keys(bms.bmps).filter(key => bms.bmps[key] instanceof HTMLVideoElement).map(key => {
            new Promise(res => {
                (function wait(key) {
                    if (bms.bmps[key].readyState == bms.bmps[key].HAVE_ENOUGH_DATA) {
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

function timeToFraction(time) {
    return (time - bmsC.speedcore[speedcoreIdx].time) * bmsC.speedcore[speedcoreIdx].bpm / 240 + fractionDiff(0, bmsC.speedcore[speedcoreIdx].fraction);
}

function play(buffer) {
    if (buffer) {
        const node = new AudioBufferSourceNode(audioCtx, { buffer: buffer });
        node.connect(analyserNode);
        node.start();
        setTimeout(node => node.disconnect(), buffer.duration * 1000, node);
        return node;
    }
}