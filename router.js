let bmsV;

function setBMS(bms) {
    bmsV = bms;
}

function route(app) {
    app.get('/', (req, res) => {
        res.render('main');
    });

    app.get('/list', (req, res) => {
        if (req.query.q) {
            search = new Array();
            for (i of Object.keys(bmsV)) {
                if (bmsV[i].title.indexOf(req.query.q) != -1) {
                    search.push(bmsV[i]);
                }
                else if (bmsV[i].subtitle.indexOf(req.query.q) != -1) {
                    search.push(bmsV[i]);
                }
                else if (bmsV[i].genre.indexOf(req.query.q) != -1) {
                    search.push(bmsV[i]);
                }
                else if (bmsV[i].artist.indexOf(req.query.q) != -1) {
                    search.push(bmsV[i]);
                }
            }
            res.render('list', {
                bms: search,
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