var viewController = require('../controllers/view');

module.exports = function (app, nconf) {

    /**
     * Zone Routes
     */
    app.get(nconf.get("rest:api_url_prefix") + '/views', viewController.getViews); //list all views
    app.get(nconf.get("rest:api_url_prefix") + '/views/attributes', viewController.getAllAttributes); //get the zones in a view by id
    app.get(nconf.get("rest:api_url_prefix") + '/views/:id', viewController.getViewById); //list a view by id
    app.get(nconf.get("rest:api_url_prefix") + '/views/:id/zones', viewController.getZonesByView); //get the zones in a view by id

    app.get(nconf.get("rest:api_url_prefix") + '/views/:id/attributes', viewController.getAttributesOfViews); //get the attributes related to the views [id]
    app.post(nconf.get("rest:api_url_prefix") + '/views/:id/attributes', viewController.updateAttributesOfView);//updates attributes of view

    app.post(nconf.get("rest:api_url_prefix") + '/views/:venueId/venue', viewController.createView); //create a view
    app.post(nconf.get("rest:api_url_prefix") + '/views/:id', viewController.updateView);//updates a view by id
    app.post(nconf.get("rest:api_url_prefix") + '/views/:id/zones/:zone', viewController.addRemoveZoneByView);//adds or removes a zone to the view

    app.del(nconf.get("rest:api_url_prefix") + '/views/:id', viewController.deleteView); //delete view by id
    app.del(nconf.get("rest:api_url_prefix") + '/views/attributes/:id', viewController.deleteAttribute); //delete attribute by id
    app.get(nconf.get("rest:api_url_prefix") + '/views/:id/children', viewController.getViewChildren); //get the children of view by viewId
};