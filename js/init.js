const fs = require('fs');
const path = require('path');

function readDirR(dir) {
    return fs.statSync(dir).isDirectory() ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f)))) : dir;
}

function parseBMS() {
    const bms = readDirR('public/bms').filter(file => file.split('.').pop().match(/^bm[sel]$/)).map(file => ({ key: file.substr(11), data: require('./parse')(file.substr(7)) })).reduce((prev, d) => {
        prev[d.key] = d.data;
        return prev;
    }, {});

    return bms;
}

module.exports = { readDirR: readDirR, parseBMS: parseBMS };
