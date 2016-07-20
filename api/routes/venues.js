var venueController = require('../controllers/venue');

/**
 * Venue routes
 */
module.exports = function (app, nconf) {
    app.get(nconf.get("rest:api_url_prefix") + '/venues', venueController.getVenues); //lists all venues
    app.get(nconf.get("rest:api_url_prefix") + '/venues/:id', venueController.getVenueById); //get a venue by id
    app.post(nconf.get("rest:api_url_prefix") + '/venues', venueController.createVenue); //creates a new venue
    app.post(nconf.get("rest:api_url_prefix") + '/venues/:id', venueController.updateVenue); //updates a venue by its id
    app.del(nconf.get("rest:api_url_prefix") + '/venues/:id', venueController.deleteVenue); // deletes a venue by its id
};
