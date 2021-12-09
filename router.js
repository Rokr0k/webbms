let bmsV;

function setBMS(bms) {
    bmsV = bms;
}

function route(app) {
    app.get('/', (req, res) => {
        res.render('main');
    });

    app.get('/list', (req, res) => {
        if (req.query.query) {
            res.render('list', {
                bms: Object.keys(bmsV).filter(key => bmsV[key].title.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].subtitle.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].genre.toLowerCase().includes(req.query.query.toLowerCase()) || bmsV[key].artist.toLowerCase().includes(req.query.query.toLowerCase())).reduce((prev, curr) => (prev[curr] = bmsV[curr], prev), {}),
            });
        }
        else {
            res.render('list', {
                bms: bmsV,
            });
        }
    });

    app.get('/license', (req, res) => {
        res.render('license');
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
}

module.exports = { setBMS: setBMS, route: route };