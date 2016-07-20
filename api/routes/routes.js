var controllers = require('../controllers/index');
var wifireport = require('../controllers/wifireport');
var zone = require('../controllers/zone');

module.exports = function (app, nconf) {

    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'Express Login'
        });
    });
    app.get('/', controllers.index);

    require('./wifireports')(app, nconf);
    require('./venues')(app, nconf);
    require('./zones')(app, nconf);
    require('./data')(app, nconf);
    require('./views')(app, nconf);
    require('./users')(app, nconf);
};
