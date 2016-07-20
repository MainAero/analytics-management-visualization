var express = require("express");
var url     = require("url");
var swagger = require("./custom-modules/swagger-node-express/Common/node/swagger.js");
var http = require("http");
var async = require("async");
var nconf = require("nconf");
var session = require('express-session');
var passport = require('passport');
var cors = require('cors');

nconf.use('file', { file: __dirname+'/config.json' });
nconf.load();

// create express application
var app = express();

// Passport setup has to be defined here to avoid the out-of-order middleware hell
app.configure(function() {
    app.use(express.static('public'));
    app.use(cors());
    app.use(passport.initialize());
    app.use(app.router);
});

require('./restapi.js')(app);
require('./swaggerapi.js')(app);

var env = process.env.NODE_ENV
if ('test' == env) {
    http.createServer(app).listen(nconf.get("rest:api_port"),nconf.get("api_host_test"), function(){
        console.log("Express server listening on port " + nconf.get("rest:api_port"))});
} else {
    http.createServer(app).listen(nconf.get("rest:api_port"),nconf.get("rest:api_host"), function(){
        console.log("Express server listening on port " + nconf.get("rest:api_port"))});
}