var swagger = require("./custom-modules/swagger-node-express/Common/node/swagger.js");
var express = require("express");
var nconf = require('nconf');
nconf.use('file', { file: __dirname + '/config.json' });
nconf.load();
/*var nconf = require("nconf");
 nconf.file({ file: './config/config.json' });*/


module.exports = function (app) {
    console.log("Starting Swagger-UI API Docs @" + new Date());
    var subpath = express();
    var APP_PORT = nconf.get("rest:api_port");
    var APP_API_URL_PREFIX = nconf.get("rest:api_url_prefix");

    app.use(APP_API_URL_PREFIX, subpath);

    swagger.setAppHandler(subpath);

    
// define specs and actions for the api:

    var getVenueById = {
        'spec': {
            "summary": "Get venue by venueID",
            "description": "Find a venue by its ID",
            "path": "/venues/{venueId}",
            "method": "GET",
            "params": [swagger.pathParam("venueId", "ID of venue that needs to be fetched", "string")],
            "responseClass": "Venue",
            "nickname": "getVenueById",
            "notes": "Find a venue by its ID"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getAllVenues = {
        'spec': {
            "summary": "Get all venues",
            "description": "Find all venues",
            "path": "/venues",
            "method": "GET",
            "responseClass": "Venues",
            "nickname": "getVenuesList",
            "notes": "Find all venues"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getZonesByVenue = {
        'spec': {
            "summary": "Get all zones for a venue",
            "description": "Get all zones for a venue",
            "path": "/zones/{venueId}/venue",
            "method": "GET",
            "params": [swagger.pathParam("venueId", "ID of venue that needs to be fetched", "string")],
            "responseClass": "Zones",
            "nickname": "getZonesByVenue",
            "notes": "Get all zones for a venue"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var addVenue = {
        'spec': {
            "summary": "Adds a new venue",
            "description": "Adds a new venue",
            "path": "/venues",
            "method": "POST",
            "responseClass": "Venue",
            "nickname": "addVenue",
            "notes": "Adds a new venue",
            "params": [swagger.bodyParam("Venue", "Venue object to be added", "Venue")]
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var updateVenue = {
        'spec': {
            "summary": "Updates an existing venue",
            "description": "Updates an existing venue",
            "path": "/venues/{venueId}",
            "method": "POST",
            "params": [swagger.pathParam("venueId", "ID of venue that needs to be updated", "string"),
                swagger.bodyParam("Venue", "Update Venue", "Venue")],
            "responseClass": "Venue",
            "nickname": "updateVenue",
            "notes": "Updates an existing venue"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };


    var deleteVenueById = {
        'spec': {
            "summary": "Deletes an existing venue",
            "description": "Deletes a venue",
            "path": "/venues/{venueId}",
            "method": "DELETE",
            "params": [swagger.pathParam("venueId", "ID of venue that needs to be deleted", "string")],
            "responseClass": "Venue",
            "nickname": "deleteVenueById",
            "notes": "Deletes a venue"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getUserById = {
         'spec' :
         {
             "summary" : "Get user by userID",
             "description" : "Find a user by its ID",
             "path" : "/users/{userId}",
             "method": "GET",
             "params" : [swagger.pathParam("userId", "ID of user that needs to be fetched", "string")],
             "responseClass" : "User",
             "nickname" : "getUserById",
             "notes" : "Find a user by its ID."
         },
         'action' : function(req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
         }
     };

    var getUserByUserName = {
        'spec' :
        {
            "summary" : "Get user by username",
            "description" : "Find a user by its username",
            "path" : "/users/{username}/username",
            "method": "GET",
            "params" : [swagger.pathParam("username", "Username of user that needs to be fetched", "string")],
            "responseClass" : "User",
            "nickname" : "getUserByUserName",
            "notes" : "Find a user by its username."
        },
        'action' : function(req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

     var addUser = {
         'spec' :
         {
             "summary" : "Adds a new user",
             "description" : "Adds a new user",
             "path" : "/users",
             "method": "POST",
             "responseClass" : "User",
             "nickname" : "addUser",
             "notes" : "Adds a new user. If you add a new user provide the user.hash as clear password. The salt gets created automatically.",
             "params": [swagger.bodyParam("User", "User object to be added", "User")]
         },
         'action' : function(req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
         }
     };

     var deleteUserById = {
         'spec' :
         {
             "summary" : "Deletes an existing user",
             "notes" : "Deletes a user.",
             "path" : "/users/{userId}",
             "method": "DELETE",
             "params" : [swagger.pathParam("userId", "ID of user that needs to be deleted", "string")],
             "responseClass" : "User",
             "nickname" : "deleteUserById"
         },
         'action' : function(req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
         }
     };

    var updateUser = {
        'spec':
        {
            "summary": "Updates an existing user",
            "description": "Updates an existing user",
            "path": "/users/{userId}",
            "method": "POST",
            "params": [swagger.pathParam("userId", "ID of user that needs to be updated", "string"),
                swagger.bodyParam("User", "Update User", "User")
            ],
            "responseClass": "User",
            "nickname": "updateUser",
            "notes": "Updates an existing user"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getAllUsers = {
        'spec': {
            "summary": "Get all users",
            "description": "Find all users",
            "path": "/users",
            "method": "GET",
            "responseClass": "Users",
            "nickname": "getUserList",
            "notes": "Find all users"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getAllZones = {
        'spec': {
            "summary": "Get all zones",
            "description": "Find all zones",
            "path": "/zones",
            "method": "GET",
            "responseClass": "Zones",
            "nickname": "getZoneList",
            "notes": "Find all zones"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getZoneById = {
        'spec': {
            "summary": "Get a zone by its Id",
            "notes": "A zone represents an area where WLAN probe requests are received. Can contain multiple receivers.",
            "path": "/zones/{zoneId}",
            "method": "GET",
            "params": [swagger.pathParam("zoneId", "ID of zone that needs to be fetched", "string")],
            "responseClass": "Zone",
            "nickname": "getZoneById"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var addZone = {
        'spec': {
            "summary": "Adds a new zone",
            "description": "Adds a new zone",
            "path": "/zones/{venueId}/venue",
            "method": "POST",
            "responseClass": "Zone",
            "nickname": "addZone",
            "notes": "Adds a new zone",
            "params": [swagger.pathParam("venueId", "ID of venue to which the zone belongs", "string"),
                swagger.bodyParam("Zone", "Zone object to be added", "Zone")]
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var updateZone = {
        'spec': {
            "summary": "Updates an existing zone",
            "description": "Updates an existing zone",
            "path": "/zones/{zoneId}",
            "method": "POST",
            "params": [swagger.pathParam("zoneId", "ID of zone that needs to be updated", "string"),
                swagger.bodyParam("Zone", "Update Zone", "Zone")
            ],
            "responseClass": "Zone",
            "nickname": "updateZone",
            "notes": "Updates an existing zone"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var deleteZoneById = {
        'spec': {
            "summary": "Deletes a zone by its Id",
            "notes": "This method deletes a zone.",
            "path": "/zones/{zoneId}",
            "method": "DELETE",
            "params": [swagger.pathParam("zoneId", "ID of zone that needs to be deleted", "string")],
            "responseClass": "Zone",
            "nickname": "deleteZoneById"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getAllViews = {
        'spec': {
            "summary": "Get all views",
            "description": "Find all views",
            "path": "/views",
            "method": "GET",
            "responseClass": "Views",
            "nickname": "getViewList",
            "notes": "Find all views"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getViewById = {
        'spec': {
            "summary": "Get a view by its Id",
            "notes": "A view (profile) is a compilation of different zones. It can be e.g. a group of zones that all belong to the same venue, but also certain types of zones that are spread over multiple venues.",
            "path": "/views/{viewId}",
            "method": "GET",
            "params": [swagger.pathParam("viewId", "ID of view that needs to be fetched", "string")],
            "responseClass": "View",
            "nickname": "getViewById"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getZonesForViewId = {
        'spec': {
            "summary": "Get all zones for a view",
            "description": "Get all zones for a view",
            "path": "/views/{viewId}/zones",
            "method": "GET",
            "params": [swagger.pathParam("viewId", "ID of view that needs to be fetched", "string")],
            "responseClass": "Zones",
            "nickname": "getZonesForViewId",
            "notes": "Get all zones for a view"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var getViewChildren = {
        'spec': {
            "summary": "Get all children for a view",
            "description": "Get all children for a view",
            "path": "/views/{viewId}/children",
            "method": "GET",
            "params": [swagger.pathParam("viewId", "ID of view that needs to be fetched", "string")],
            "responseClass": "View",
            "nickname": "getZonesForViewId",
            "notes": "Get all children for a view"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };


    var getAllAttributes = {
        'spec': {
            "summary": "Get all attributes",
            "description": "Get all attributes list",
            "path": "/views/attributes",
            "method": "GET",
            "responseClass": "Attributes",
            "nickname": "getAllAttributes",
            "notes": "Get all attributes were defined till now"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };


    var getAttributesOfViews = {
        'spec': {
            "summary": "Get all attributes of all the provided views",
            "description": "Get all attributes of the views in a distinct way (same attribute will appear just once)",
            "path": "/views/{viewsIds}/attributes",
            "method": "GET",
            "params": [swagger.pathParam("viewsIds", "IDs of views that need to be fetch their attributes", "string")],
            "responseClass": "Attributes",
            "nickname": "getAttributesOfViews",
            "notes": "Get all attributes of a view"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };


    var addView = {
        'spec': {
            "summary": "Adds a new view",
            "notes": "Adds a new view",
            "path": "/views/{venueId}/venue",
            "method": "POST",
            "params": [swagger.pathParam("venueId", "ID of venue to which the view belongs", "string"),
                swagger.bodyParam("View", "View object to be added", "View")],
            "responseClass": "View",
            "nickname": "addView"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var updateView = {
        'spec': {
            "summary": "Updates an existing view",
            "description": "Updates an existing view",
            "path": "/views/{viewId}",
            "method": "POST",
            "params": [swagger.pathParam("viewId", "ID of view that needs to be updated", "string"),
                swagger.bodyParam("View", "Update View", "View")
                /*swagger.bodyParam("Zones", "A list of zones that shall belong to this view", "\
                 {\"zone_arr\": \n\
                 [\n\
                 \"5554432\",\n\
                 \"2345928\"\n\
                 ]\n\
                 }")*/],
            "responseClass": "View",
            "nickname": "updateView",
            "notes": "Updates an existing view"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };


    var updateAttributesOfView = {
        'spec': {
            "summary": "Updates the attributes of an existing view",
            "description": "Updates the attributes of an existing view, possible to add new attributes that wasn't defined before",
            "path": "/views/{viewId}/attributes",
            "method": "POST",
            "params": [swagger.pathParam("viewId", "ID of view that needs to update its attributes", "string"),
                swagger.bodyParam("Attributes", "the new/updated attributes list\n for example: " +
                    '{ "attributes_arr": [ { "name": "city", "value": "Berlin" }, { "name": "country", "value": "Germany" } ] }', "Attributes")
            ],
            "responseClass": "View",
            "nickname": "updateAttributesOfView",
            "notes": "Updates an existing view, possible to add new attributes that wasn't defined before"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var deleteViewById = {
        'spec': {
            "summary": "Deletes a view by its Id",
            "notes": "This method deletes a view (profile) and the attached pre-computed data to that view.",
            "path": "/views/{viewId}",
            "method": "DELETE",
            "params": [swagger.pathParam("viewId", "ID of view that needs to be deleted", "string")],
            "responseClass": "View",
            "nickname": "deleteViewById"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

    var deleteAttributeById = {
        'spec': {
            "summary": "Deletes an Attribute by its Id",
            "notes": "This method deletes an Attribute and removes the Attribute from each view containing it.",
            "path": "/views/attributes/{attributeId}",
            "method": "DELETE",
            "params": [swagger.pathParam("attributeId", "ID of attribute that needs to be deleted", "string")],
            "responseClass": "Attribute",
            "nickname": "deleteAttributeById"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };

// for query params: exports.query = exports.q = function(name, description, dataType, required, allowMultiple, allowableValues, defaultValue)

    var getAnalyticsData = {
        'spec': {
            "summary": "Core Analytics API",
            "notes": "This endpoint acts as the core analytics API for Street Smart Retail. Each request requires a 'viewId', a 'start-time' and 'end-time' and one 'metric' out of the list.",
            "path": "/data",
            "method": "GET",
            "params": [swagger.queryParam("viewId", "The view id", "String", true, false),
                swagger.queryParam("start-date", "The start date", "ISODate", true, false),
                swagger.queryParam("end-date", "The end date", "ISODate", true, false),
                swagger.queryParam("dimensions", "Dimensions", "String[]", false, true),//, "ARRAY[allVisitors, newVisitors, returningVisitors,dateHour,dateDay,dateWeek,dateMonth,dateYear]", "allVisitors"),
                swagger.queryParam("metrics", "Metrics", "Array[]", true, true, "LIST[count,averageDwellTime,frequency]")

            ],
            "responseClass": "DataResponse",
            "nickname": "getAnalyticsData"
        },
        'action': function (req, res) {
            res.send(200,
                {start_date: "2013092715",
                    end_date: "2013092718",
                    view_id: "testid",

                    "name": "numberOfVisitors",
                    "columnType": "METRIC",
                    "dataType": "INTEGER",

                    "columnHeaders": [
                        {
                            "name": "dateHour",
                            "columnType": "DIMENSION",
                            "dataType": "STRING"
                        },
                        {
                            "name": "allVisitors",
                            "columnType": "DIMENSION",
                            "dataType": "STRING"
                        },
                        {
                            "name": "newVisitors",
                            "columnType": "DIMENSION",
                            "dataType": "STRING"
                        }
                    ],
                    "rows": [
                        [
                            "2013092715",
                            "500",
                            "200"
                        ],
                        [
                            "2013091716",
                            "300",
                            "100"
                        ],
                        [
                            "2013091716",
                            "200",
                            "40"
                        ]
                    ]}

            );
        }
    };

    var token = {
        'spec': {
            "summary": "Get token of user",
            "description": "Get token of user",
            "path": "/users/token/user",
            "method": "GET",
            "params": [swagger.queryParam("username", "The username of the user to login", "string"),
                swagger.queryParam("password", "The password of the user to login", "string")
            ],
            "responseClass": "User",
            "nickname": "token",
            "notes": "Get token of user"
        },
        'action': function (req, res) {
            res.send(501, { error: '501 - method not yet implemented. Sorry.' });
        }
    };


// load swagger models;
    var models = require('./models.js');
    swagger.addModels(models);

// Add methods defined above:

// users
    swagger.addGet(getAllUsers);
    swagger.addGet(getUserById);
    swagger.addGet(getUserByUserName);
    swagger.addPost(addUser);
    swagger.addPost(updateUser);
    swagger.addDelete(deleteUserById);
    swagger.addGet(token);

// venues
    swagger.addGet(getAllVenues);
    swagger.addGet(getVenueById);
    swagger.addPost(addVenue);
    swagger.addPost(updateVenue);
    swagger.addDelete(deleteVenueById);

// zones
    swagger.addGet(getAllZones);
    swagger.addGet(getZoneById);
    swagger.addGet(getZonesByVenue);
    swagger.addPost(addZone);
    swagger.addPost(updateZone);
    swagger.addDelete(deleteZoneById);

//views
    swagger.addGet(getAllViews);
    swagger.addGet(getViewById);
    swagger.addGet(getZonesForViewId);
    swagger.addGet(getViewChildren);
    swagger.addGet(getAllAttributes);
    swagger.addGet(getAttributesOfViews);
    swagger.addPost(updateAttributesOfView);
    swagger.addPost(addView);
    swagger.addPost(updateView);
    swagger.addDelete(deleteViewById);
    swagger.addDelete(deleteAttributeById);

//data
    swagger.addGet(getAnalyticsData);

    swagger.configureDeclaration("users", {
        description: "Operations about users"
    });

    swagger.configureDeclaration("venues", {
        description: "Operations about venues"
    });

    swagger.configureDeclaration("zones", {
        description: "Operations about zones"
    });

    swagger.configureDeclaration("views", {
        description: "Operations about views"
    });

    swagger.configureDeclaration("data", {
        description: "Operations about data"
    });

    swagger.setApiInfo({
        title: "Analytics API",
        description: "A RESTful data analytics API for indoor location analytics."
    });

// configureSwaggerPaths(format e.g. ".{format}, path, jsonSuffix e.g. ".json"):
    swagger.configureSwaggerPaths("", "/api-docs", "");
    //swagger.configure("http://localhost:3000" + APP_API_URL_PREFIX, "0.2");

    /**
     * Configuration for LOCALHOST
     */
    swagger.configure(nconf.get("swagger-ui:swagger_localhost")+":"+nconf.get("swagger-ui:swagger_port")+nconf.get("rest:api_url_prefix"),nconf.get("rest:api_version"));

    /**
     * Configuration for amazin-dev-1
     */
    //swagger.configure(nconf.get("swagger-ui:swagger_host") + nconf.get("rest:api_url_prefix"), nconf.get("rest:api_version"));

    var docs_handler = express.static(__dirname + '/custom-modules/swagger-ui/dist');
    app.get(/^\/api\/v1\/docs(\/.*)?$/, function (req, res, next) {
        if (req.url === '/api/v1/docs') { // express static barfs on root url w/o trailing slash
            res.writeHead(302, { 'Location': req.url + '/' });
            res.end();
            return;
        }
        // take off leading /docs so that connect locates file correctly
        req.url = req.url.substr('/api/v1/docs'.length);
        return docs_handler(req, res, next);
    });

    console.log("Done!");
}
