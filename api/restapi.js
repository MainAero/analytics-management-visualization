/**
 * Module dependencies.
 */
var  http = require('http')
    , path = require('path')
    , express = require('express');
var nconf = require('nconf');
//nconf.use('file', { file: __dirname+'/config.json' });
var session = require('express-session');
var passport = require('passport');

var env = process.env.NODE_ENV
if(env == 'test'){
    console.log("Running on test mode");
    nconf.use('file', { file: __dirname+'/tests/config.json' });
}else{
    nconf.use('file', { file: __dirname+'/config.json' });
}
nconf.load();

console.log("Initialize REST API...")

require('./dbconnect.js')(nconf);

module.exports = function(app){
    // Added cors otherwise no ajax request will work
    app.all('/api*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, PUT, OPTIONS");
        next();
    });

    app.all('*', function(req, res, next) {
        var start = process.hrtime();

        // event triggers when express is done sending response
        res.on('finish', function() {
            var hrtime = process.hrtime(start);
            var elapsed = parseFloat(hrtime[0] + (hrtime[1] / 1000000).toFixed(3), 10);
            console.log(+elapsed);
        });

        next();
    });

    app.configure(function(){
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });

    console.log(app.ENV)

    // Authentication configuration, have to be included before routes config
    require('./passport.js')(app, nconf, passport);

    // Configuration for REST API routes
    require('./routes/routes.js')(app,nconf);

    console.log("Done!");
}
