var mongoose = require('mongoose');
/*
var nconf = require('nconf')
nconf.file({ file: './config/config.json' });
*/

module.exports = function(nconf){

    var options = {
        user: nconf.get('mongodb:user'),
        pass: nconf.get('mongodb:password'),
        server: {auto_reconnect:true},
        db: {
            //numberOfRetries: 10,
            retryMiliSeconds: nconf.get('mongodb:reconnectTime')
        }
    }
    var mongourl = 'mongodb://'+nconf.get('mongodb:host')+'/'+nconf.get('mongodb:dbname') ;
    //var db = mongoose.connect(mongourl,options)

    connectWithRetry(mongourl,options, nconf);

    mongoose.connection.on("error", function(err){
        console.log(err);
    });
}

var connectWithRetry = function(mongourl, options, nconf) {
    return mongoose.connect(mongourl, options, function(err) {
        if (err) {
            console.error('Failed to connect to mongodb on startup - retrying in 10 sec', err);
            setTimeout(function(){connectWithRetry(mongourl,options, nconf)}, nconf.get('mongodb:reconnectTime'));
        }
    });
};