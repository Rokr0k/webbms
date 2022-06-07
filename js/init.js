"use strict";

const parser = require('./parse');
const glob = require('glob');

function parseBMS() {
    const bms = {};
    console.time("reading file list");
    const files = glob.sync("public/bms/**/*.@(bm[sel]|pms)");
    console.timeEnd("reading file list");
    for (const file of files) {
        console.time(file);
        bms[file.substring(11)] = parser(file.substring(7));
        console.timeEnd(file);
    }
    return bms;
}

module.exports = { parseBMS };
