module.exports = function (app, bms) {
    app.get('/', (req, res) => {
        res.render('main', {
            bms: bms,
        });
    });

    app.get('/list', (req, res) => {
        res.render('list', {
            bms: bms,
        });
    });

    app.get('/license', (req, res) => {
        res.render('license', {
            bms: bms,
        });
    });

    Object.keys(bms).forEach(key => {
        app.get('/' + key, (req, res) => {
            res.render('play', {
                bms: bms[key],
            });
        });
    });
}