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
router.setBMS(init.parseBMS());
router.route(app);

console.log(`🚀 Welcome to WebBMS!\nListening on port ${port}`);