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

let pressTimeC = {};

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
ctx.font = "50px serif";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.fillText("Press Space to Start", cvs.width / 2, cvs.height / 2);

window.addEventListener('keydown', e => {
    if (!playing && e.code == 'Space') {
        playing = true;
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        loadBMS(bmsC).then(bms => {
            bmsC = bms;
            offsetC = 0;
            fractionC = 0;
            bpmC = bmsC.bpm;
            timeC = 0
            indexC = 0;
            startTime = audioCtx.currentTime + 1;
            setInterval(update, 10);
            draw();
        });
    }
});

let stopC = false;

function update() {
    const currentTime = audioCtx.currentTime - startTime;
    if (stopC && timeC < currentTime) {
        stopC = false;
    }
    while (!stopC && indexC < bmsC.notes.length && bmsC.notes[indexC].time <= currentTime) {
        const note = bmsC.notes[indexC++];
        switch (note.type) {
            case 0:
                play(bmsC.wavs[note.key]);
                break;
            case 1:
                play(bmsC.wavs[note.key]);
                pressTimeC[note.line] = note.endFraction < 0 ? note.time : note.endTime;
                break;
            case 3:
                bmpC = bmsC.bmps[note.bmp];
                if (bmpC instanceof HTMLVideoElement) {
                    bmpC.play();
                }
                break;
            case 4:
                bpmC = note.bpm;
                offsetC = fractionDiff(0, note.fraction);
                timeC = note.time;
                break;
            case 5:
                stopC = true;
                offsetC = fractionDiff(0, note.fraction);
                timeC = note.time + note.stop;
                break;
        }
    }
}

const colorScheme = {
    background: "#000000",
    gear: "#808080",
    text: "#FFFFFF",
    slide: "#FF0000",
    lower: "#FFFFFF",
    higher: "#0000FF",
    mine: "#AA0000",
    indicate: "#00FFFF88",
}

const scrollSpeed = 2000;

const bgaSize = 700;

const noteSize = 15;

const pressIndicateHeight = 1000;
const pressIndicateDuration = 0.2;

function draw() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    ctx.fillStyle = colorScheme.background;
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    requestAnimationFrame(draw);
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
                let y = (fractionDiff(0, i) - fraction) * scrollSpeed;
                ctx.fillRect(0, cvs.height - y, 530, 5);
            }
            ctx.fillRect(0 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(100 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(170 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(220 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(290 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(340 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(410 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(460 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(530 - 5/2, 0, 5, cvs.height);
            for (line of Object.keys(pressTimeC)) {
                let height = 0;
                if (currentTime < pressTimeC[line] + pressIndicateDuration) {
                    if (currentTime < pressTimeC[line]) {
                        height = pressIndicateHeight;
                    } else {
                        height = pressIndicateHeight * (pressTimeC[line] + pressIndicateDuration - currentTime) / pressIndicateDuration;
                    }
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
            for (note of bmsC.notes.filter(note => (note.type == 1 && note.endFraction < 0 && note.time > currentTime) || note.type == 2)) {
                if (note.type == 1) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    switch (note.line) {
                        case '16':
                            ctx.fillStyle = colorScheme.slide;
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
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    ctx.fillStyle = colorScheme.mine;
                    switch (note.line) {
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
            for (note of bmsC.notes.filter(note => note.type == 1 && note.endFraction >= 0 && note.endTime > currentTime)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                let y2 = (fractionDiff(0, note.endFraction) - fraction) * scrollSpeed + noteSize;
                if (y1 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = colorScheme.slide;
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
            if (bmpC) {
                ctx.drawImage(bmpC, (cvs.width - 530 - bgaSize) / 2 + 530, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = colorScheme.text;
            ctx.font = "40px monospaced";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText(`BPM ${bpmC}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize * bgaRatio) / 2);
            break;
        case 3:
            ctx.fillStyle = colorScheme.gear;
            ctx.fillRect(0, cvs.height - noteSize, 530, noteSize);
            ctx.fillRect(cvs.width - 530, cvs.height - noteSize, 530, noteSize);
            for (let i = 0; i <= Math.ceil(bmsC.notes[bmsC.notes.length - 1].fraction); i++) {
                let y = (fractionDiff(0, i) - fraction) * scrollSpeed;
                ctx.fillRect(0, cvs.height - y, 530, 5);
                ctx.fillRect(cvs.width - 530, cvs.height - y, 530, 5);
            }
            ctx.fillRect(0 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(100 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(170 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(220 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(290 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(340 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(410 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(460 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(530 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 100 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 170 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 220 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 290 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 340 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 410 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 460 - 5/2, 0, 5, cvs.height);
            ctx.fillRect(cvs.width - 530 - 5/2, 0, 5, cvs.height);
            for (line of Object.keys(pressTimeC)) {
                let height = 0;
                if (currentTime < pressTimeC[line] + pressIndicateDuration) {
                    if (currentTime < pressTimeC[line]) {
                        height = pressIndicateHeight;
                    } else {
                        height = pressIndicateHeight * (pressTimeC[line] + pressIndicateDuration - currentTime) / pressIndicateDuration;
                    }
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
                        case '26':
                            ctx.fillRect(cvs.width - 100, cvs.height - height, 100, height);
                            break;
                        case '29':
                            ctx.fillRect(cvs.width - 170, cvs.height - height, 70, height);
                            break;
                        case '28':
                            ctx.fillRect(cvs.width - 220, cvs.height - height, 50, height);
                            break;
                        case '25':
                            ctx.fillRect(cvs.width - 290, cvs.height - height, 70, height);
                            break;
                        case '24':
                            ctx.fillRect(cvs.width - 340, cvs.height - height, 50, height);
                            break;
                        case '23':
                            ctx.fillRect(cvs.width - 410, cvs.height - height, 70, height);
                            break;
                        case '22':
                            ctx.fillRect(cvs.width - 460, cvs.height - height, 50, height);
                            break;
                        case '21':
                            ctx.fillRect(cvs.width - 530, cvs.height - height, 70, height);
                            break;
                    }
                }
            }
            for (note of bmsC.notes.filter(note => (note.type == 1 && note.endFraction < 0 && note.time > currentTime) || note.type == 2)) {
                if (note.type == 1) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    switch (note.line) {
                        case '16':
                            ctx.fillStyle = colorScheme.slide;
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
                        case '26':
                            ctx.fillStyle = colorScheme.slide;
                            ctx.fillRect(cvs.width - 100, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '29':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(cvs.width - 170, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '28':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(cvs.width - 220, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '25':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(cvs.width - 290, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '24':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(cvs.width - 340, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '23':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(cvs.width - 410, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '22':
                            ctx.fillStyle = colorScheme.higher;
                            ctx.fillRect(cvs.width - 460, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '21':
                            ctx.fillStyle = colorScheme.lower;
                            ctx.fillRect(cvs.width - 530, cvs.height - y2, 70, y2 - y1);
                            break;
                    }
                }
                else if (note.type == 2) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    ctx.fillStyle = colorScheme.mine;
                    switch (note.line) {
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
            for (note of bmsC.notes.filter(note => note.type == 1 && note.endFraction >= 0 && note.endTime > currentTime)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                let y2 = (fractionDiff(0, note.endFraction) - fraction) * scrollSpeed + noteSize;
                if (y1 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = colorScheme.slide;
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
                    case '26':
                        ctx.fillStyle = colorScheme.slide;
                        ctx.fillRect(cvs.width - 100, cvs.height - y2, 100, y2 - y1);
                        break;
                    case '29':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(cvs.width - 170, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '28':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(cvs.width - 220, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '25':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(cvs.width - 290, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '24':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(cvs.width - 340, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '23':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(cvs.width - 410, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '22':
                        ctx.fillStyle = colorScheme.higher;
                        ctx.fillRect(cvs.width - 460, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '21':
                        ctx.fillStyle = colorScheme.lower;
                        ctx.fillRect(cvs.width - 530, cvs.height - y2, 70, y2 - y1);
                        break;
                }
            }
            if (bmpC) {
                ctx.drawImage(bmpC, (cvs.width - bgaSize) / 2, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = colorScheme.text;
            ctx.font = "40px monospaced";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText(`BPM ${bpmC}`, (cvs.width) / 2, (cvs.height + bgaSize * bgaRatio) / 2);
            break;
    }
}

function loadBMS(bms) {
    return new Promise(resolve => {
        audioCtx = new AudioContext();
        Promise.all(Object.keys(bms.wavs).map(wav => {
            if (wav.length > 0) {
                return new Promise(res => {
                    fetch(bms.wavs[wav]).then(response => response.arrayBuffer()).then(buffer => audioCtx.decodeAudioData(buffer)).then(buffer => res({ key: wav, buffer: buffer })).catch(_ => res({}));
                })
            }
        })).then(wavs => wavs.reduce((prev, wav) => {
            prev[wav.key] = wav.buffer;
            return prev;
        }, {})).then(wavs => {
            bms.wavs = wavs;
        }).then(() => {
            for (const key of Object.keys(bms.bmps)) {
                switch (bms.bmps[key].split('.').pop()) {
                    case 'mp4':
                    case 'webm': {
                        const video = bms.bmps[key];
                        bms.bmps[key] = document.createElement('video');
                        bms.bmps[key].src = video;
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
    }
}