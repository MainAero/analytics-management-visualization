/**
 * @author MainAero
 */

var User = require('./models/user');

module.exports = function (app, nconf, passport) {
    var BearerStrategy = require('passport-http-bearer');

    // Route to get user token by username and password, should be always accessible => define before catch-all
    app.get(nconf.get("rest:api_url_prefix") + '/users/token/user',
        function (req, res, next) {
            User.findOne({username: req.query.username})
                .populate('venues')
                .exec(function (err, user) {
                    if (err) {
                        return res.json({status: false});
                    }
                    if (!user) {
                        return res.json({status: false});
                    }
                    if (!user.validPassword(req.query.password, user.salt)) {
                        return res.json({status: false});
                    }
                    return res.json({
                        status: true,
                        username: user.username,
                        userId: user.id,
                        token: user.token,
                        venues: user.venues
                    });
                });
        }
    );

    var ensureAuthentication = passport.authenticate('bearer', {session: false});

    // Catch-all statement: Define authentication for routes
    // app.all(nconf.get("rest:api_url_prefix") + '/users*', ensureAuthentication);
    app.all(nconf.get("rest:api_url_prefix") + '/zones*', ensureAuthentication);
    app.all(nconf.get("rest:api_url_prefix") + '/venues*', ensureAuthentication);
    app.all(nconf.get("rest:api_url_prefix") + '/data*', ensureAuthentication);
    app.all(nconf.get("rest:api_url_prefix") + '/views*', ensureAuthentication);

    // Passport strategy configuration
    passport.use('bearer', new BearerStrategy(
        {
            passReqToCallback: true
        }, function (req, token, done) {
            User.findOne({token: token}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                req.user = user;
                return done(null, user, {scope: 'all'});
            });
        }
    ));
};