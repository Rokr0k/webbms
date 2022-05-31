"use strict";

const express = require('express');
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

app.listen(port);
router.route(app);
console.log(`Welcome to WebBMS! Listening on port ${port}.`);

const start = new Date();
init.parseBMS().then(bms => {
    router.setBMS(bms);
    const end = new Date();
    console.log(`Reading BMS files complete! Took ${(end - start) / 1000}s.`);
});