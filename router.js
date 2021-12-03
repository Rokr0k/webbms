module.exports = function (app, bms) {
    app.get('/', (req, res) => {
        res.render('index', {
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