const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

function readDirR(dir) {
    return fs.statSync(dir).isDirectory() ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f)))) : dir;
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000);

const data = readDirR('public/bms').filter(file => file.split('.').pop().match(/^bm[sel]$/)).map(file => file.substr(7)).reduce((prev, file) => {
    prev[file.split('/').pop()] = file;
    return prev;
}, {});

const bms = Object.keys(data).map(key => {
    return { key: encodeURI(key), data: require('./parse')(data[key]) };
}).reduce((prev, d) => {
    prev[d.key] = d.data;
    return prev;
}, {});

require('./router')(app, bms);