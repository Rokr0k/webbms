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

router.route(app);

const server = app.listen(port);
process.on('SIGTERM', () => server.close());
console.log(`Listening on port ${port}.`);

(async () => {
    console.time(`reading BMS files`);
    router.setBMS(await init.parseBMS());
    console.timeEnd(`reading BMS files`);
})();
