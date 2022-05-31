"use strict";

const fs = require('fs');
const path = require('path');
const parser = require('./parse');

async function* readDirR(dir) {
    if (fs.statSync(dir).isDirectory()) {
        for (const f of fs.readdirSync(dir)) {
            yield* readDirR(path.join(dir, f));
        }
    } else if (dir.split('.').pop().match(/^(bm[sel]|pms)$/)) {
        yield dir;
    }
}

async function parseBMS() {
    const bms = {};
    for await (const file of readDirR('public/bms')) {
        bms[file.substr(11)] = parser(file.substr(7));
    }
    return bms;
}

module.exports = { parseBMS };
