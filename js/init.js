"use strict";

const parser = require('./parse');
const glob = require('glob');

function parseBMS() {
    return new Promise((resolve) => {
        console.time("reading file list");
        const files = glob.sync("public/bms/**/*.@(bm[sel]|pms)");
        console.timeEnd("reading file list");
        Promise.all(files.map(file => new Promise(res => {
            console.time(file);
            const bms = parser(file.substring(7));
            console.timeEnd(file);
            res({ key: file.substring(11), value: bms });
        }))).then(bmsList => bmsList.reduce((obj, bms) => ({ ...obj, [bms.key]: bms.value }), {})).then(bms => resolve(bms));
    });
}

module.exports = { parseBMS };
