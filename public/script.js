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
    if (stopC && timeC < audioCtx.currentTime - startTime) {
        stopC = false;
    }
    while (!stopC && indexC < bmsC.notes.length && bmsC.notes[indexC].time <= audioCtx.currentTime - startTime) {
        const note = bmsC.notes[indexC++];
        switch (note.type) {
            case 0:
                play(bmsC.wavs[note.key]);
                break;
            case 1:
                play(bmsC.wavs[note.key]);
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

const scrollSpeed = 2000;

const bgaSize = 700;

const noteSize = 15;

function draw() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    requestAnimationFrame(draw);
    const fraction = stopC ? offsetC : (audioCtx.currentTime - startTime - timeC) * bpmC / 240 + offsetC;
    let bgaRatio = 0;
    if (bmpC instanceof HTMLVideoElement) {
        bgaRatio = bmpC.videoHeight / bmpC.videoWidth;
    } else if (bmpC instanceof HTMLImageElement) {
        bgaRatio = bmpC.height / bmpC.width;
    }
    switch (bmsC.player) {
        case 1:
            ctx.fillStyle = "gray";
            ctx.fillRect(0, cvs.height - noteSize, 530, noteSize);
            for (let i = 0; i <= Math.ceil(bmsC.notes[bmsC.notes.length - 1].fraction); i++) {
                let y = (fractionDiff(0, i) - fraction) * scrollSpeed;
                ctx.fillStyle = "gray";
                ctx.fillRect(0, cvs.height - y, 530, 5);
            }
            for (note of bmsC.notes.filter(note => (note.type == 1 && note.endFraction < 0 && note.time > audioCtx.currentTime - startTime) || note.type == 2)) {
                if (note.type == 1) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    switch (note.line) {
                        case '16':
                            ctx.fillStyle = "red";
                            ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '11':
                            ctx.fillStyle = "white";
                            ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '12':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '13':
                            ctx.fillStyle = "white";
                            ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '14':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '15':
                            ctx.fillStyle = "white";
                            ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '18':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '19':
                            ctx.fillStyle = "white";
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
                    ctx.fillStyle = "red";
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
            for (note of bmsC.notes.filter(note => note.type == 1 && note.endFraction >= 0 && note.endTime > audioCtx.currentTime - startTime)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                let y2 = (fractionDiff(0, note.endFraction) - fraction) * scrollSpeed + noteSize;
                if (y1 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = "red";
                        ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                        break;
                    case '11':
                        ctx.fillStyle = "white";
                        ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '12':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '13':
                        ctx.fillStyle = "white";
                        ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '14':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '15':
                        ctx.fillStyle = "white";
                        ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '18':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '19':
                        ctx.fillStyle = "white";
                        ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                        break;
                }
            }
            if (bmpC) {
                ctx.drawImage(bmpC, (cvs.width - 530 - bgaSize) / 2 + 530, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = "white";
            ctx.font = "40px monospaced";
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText(`BPM ${bpmC}`, (cvs.width - 530) / 2 + 530, (cvs.height + bgaSize * bgaRatio) / 2);
            break;
        case 3:
            ctx.fillStyle = "gray";
            ctx.fillRect(0, cvs.height - noteSize, 530, noteSize);
            ctx.fillRect(cvs.width - 530, cvs.height - noteSize, 530, noteSize);
            for (let i = 0; i <= Math.ceil(bmsC.notes[bmsC.notes.length - 1].fraction); i++) {
                let y = (fractionDiff(0, i) - fraction) * scrollSpeed;
                ctx.fillStyle = "gray";
                ctx.fillRect(0, cvs.height - y, 530, 5);
                ctx.fillRect(cvs.width - 530, cvs.height - y, 530, 5);
            }
            for (note of bmsC.notes.filter(note => (note.type == 1 && note.endFraction < 0 && note.time > audioCtx.currentTime - startTime) || note.type == 2)) {
                if (note.type == 1) {
                    let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                    let y2 = y1 + noteSize;
                    if (y1 > cvs.height) {
                        break;
                    }
                    switch (note.line) {
                        case '16':
                            ctx.fillStyle = "red";
                            ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '11':
                            ctx.fillStyle = "white";
                            ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '12':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '13':
                            ctx.fillStyle = "white";
                            ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '14':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '15':
                            ctx.fillStyle = "white";
                            ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '18':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '19':
                            ctx.fillStyle = "white";
                            ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '26':
                            ctx.fillStyle = "red";
                            ctx.fillRect(cvs.width - 100, cvs.height - y2, 100, y2 - y1);
                            break;
                        case '29':
                            ctx.fillStyle = "white";
                            ctx.fillRect(cvs.width - 170, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '28':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(cvs.width - 220, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '25':
                            ctx.fillStyle = "white";
                            ctx.fillRect(cvs.width - 290, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '24':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(cvs.width - 340, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '23':
                            ctx.fillStyle = "white";
                            ctx.fillRect(cvs.width - 410, cvs.height - y2, 70, y2 - y1);
                            break;
                        case '22':
                            ctx.fillStyle = "blue";
                            ctx.fillRect(cvs.width - 460, cvs.height - y2, 50, y2 - y1);
                            break;
                        case '21':
                            ctx.fillStyle = "white";
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
                    ctx.fillStyle = "red";
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
            for (note of bmsC.notes.filter(note => note.type == 1 && note.endFraction >= 0 && note.endTime > audioCtx.currentTime - startTime)) {
                let y1 = (fractionDiff(0, note.fraction) - fraction) * scrollSpeed;
                let y2 = (fractionDiff(0, note.endFraction) - fraction) * scrollSpeed + noteSize;
                if (y1 > cvs.height) {
                    break;
                }
                switch (note.line) {
                    case '16':
                        ctx.fillStyle = "red";
                        ctx.fillRect(0, cvs.height - y2, 100, y2 - y1);
                        break;
                    case '11':
                        ctx.fillStyle = "white";
                        ctx.fillRect(100, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '12':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(170, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '13':
                        ctx.fillStyle = "white";
                        ctx.fillRect(220, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '14':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(290, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '15':
                        ctx.fillStyle = "white";
                        ctx.fillRect(340, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '18':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(410, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '19':
                        ctx.fillStyle = "white";
                        ctx.fillRect(460, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '26':
                        ctx.fillStyle = "red";
                        ctx.fillRect(cvs.width - 100, cvs.height - y2, 100, y2 - y1);
                        break;
                    case '29':
                        ctx.fillStyle = "white";
                        ctx.fillRect(cvs.width - 170, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '28':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(cvs.width - 220, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '25':
                        ctx.fillStyle = "white";
                        ctx.fillRect(cvs.width - 290, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '24':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(cvs.width - 340, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '23':
                        ctx.fillStyle = "white";
                        ctx.fillRect(cvs.width - 410, cvs.height - y2, 70, y2 - y1);
                        break;
                    case '22':
                        ctx.fillStyle = "blue";
                        ctx.fillRect(cvs.width - 460, cvs.height - y2, 50, y2 - y1);
                        break;
                    case '21':
                        ctx.fillStyle = "white";
                        ctx.fillRect(cvs.width - 530, cvs.height - y2, 70, y2 - y1);
                        break;
                }
            }
            if (bmpC) {
                ctx.drawImage(bmpC, (cvs.width - bgaSize) / 2, (cvs.height - bgaSize * bgaRatio) / 2, bgaSize, bgaSize * bgaRatio);
            }
            ctx.fillStyle = "white";
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