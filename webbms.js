"use strict";

const express = require('express');
const app = express();
const router = require('./router/router');
const init = require('./js/init');
const bodyParser = require('body-parser');

const port = parseInt(process.argv[2]) || 80;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port);
router.route(app);
console.log(`Welcome to WebBMS! Listening on port ${port}.`);

const start = new Date();
init.parseBMS().then(bms => {
    router.setBMS(bms);
    const end = new Date();
    console.log(`Reading BMS files complete! Took ${(end - start) / 1000}s.`);
});