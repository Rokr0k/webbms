let bmsV;

function setBMS(bms) {
    bmsV = bms;
}

function route(app) {
    app.get('/', (req, res) => {
        res.render('main');
    });

    app.get('/list', (req, res) => {
        res.render('list', {
            bms: bmsV,
        });
    });

    app.get('/license', (req, res) => {
        res.render('license');
    });

    app.get('/*', (req, res) => {
        const key = req.url.split('/').pop();
        if (bmsV[key]) {
            res.render('play', {
                bms: bmsV[key],
            });
        } else {
            res.sendStatus(404);
        }
    });
}

module.exports = { setBMS: setBMS, route: route };