var zoneController = require('../controllers/zone');

module.exports = function (app, nconf) {

    /**
     * Zone Routes
     */
    app.get(nconf.get("rest:api_url_prefix") + '/zones', zoneController.getZones); //lists all zones
    app.get(nconf.get("rest:api_url_prefix") + '/zones/:id', zoneController.getZoneById); //list a zone by id
    app.get(nconf.get("rest:api_url_prefix") + '/zones/:venueId/venue', zoneController.getZonesByVenue); //list zones by venue id
    app.post(nconf.get("rest:api_url_prefix") + '/zones/:venueId/venue', zoneController.createZone); //create a zone associated with the venue id
    app.post(nconf.get("rest:api_url_prefix") + '/zones/:id', zoneController.updateZone); //update zone by id
    app.del(nconf.get("rest:api_url_prefix") + '/zones/:id', zoneController.deleteZone); //delete zone by id

};