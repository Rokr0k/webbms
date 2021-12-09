const request = require('request');

let bmsV;

function setBMS(bms) {
    bmsV = bms;
}

function route(app) {
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/list', (req, res) => {
        if (req.query.query) {
            res.render('list', {
                bms: Object.keys(bmsV).filter(key => bmsV[key].title.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].subtitle.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].genre.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].artist.toLowerCase().includes(req.query.query.toLowerCase())).reduce((prev, curr) => (prev[curr] = bmsV[curr], prev), {}),
                length: Object.keys(bmsV).filter(key => bmsV[key].title.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].subtitle.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].genre.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].artist.toLowerCase().includes(req.query.query.toLowerCase())).length
            });
        }
        else {
            res.render('list', {
                bms: bmsV,
                length: Object.keys(bmsV).length
            });
        }
    });

    app.get('/license', (req, res) => {
        const options = {
            url: 'https://raw.githubusercontent.com/Rokr0k/webbms/main/LICENSE'
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200)
                res.send(`<pre>${body.replace(/</gi, "&lt;").replace(/>/gi, "&gt;")}</pre>`);
        }

        request(options, callback);
    });

    app.get('/play', (req, res) => {
        const key = req.query.key;
        const auto = req.query.auto || "false";
        if (bmsV[key]) {
            res.render('play', {
                bms: bmsV[key],
                auto: auto,
            });
        } else {
            res.sendStatus(404);
        }
    });

    app.get('/setting', (req, res) => {
        res.render('setting');
    });
}

module.exports = { setBMS: setBMS, route: route };