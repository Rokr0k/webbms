"use strict";

const express = require('express');
const fs = require('fs');
const app = express();
const router = require('./router/router');
const init = require('./js/init');
require('dotenv').config();

const port = +process.env.PORT || 80;

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.route(app);

require('http').createServer(app).listen(port);

(async () => {
    console.time(`reading BMS files`);
    router.setBMS(await init.parseBMS());
    console.timeEnd(`reading BMS files`);
})();
