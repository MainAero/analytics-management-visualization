var View = require('../models/view.js');
var Attribute = require('../models/attribute.js');
var validator = require('./viewValidator.js');
var report = require('../models/wifireport');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var permissions = require('./helper/permissions.js');

//var WebSocket = require('ws');

var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();


exports.getViews = function (req, res) {
    View.find().populate('venue').exec(function (err, views) {
        if (err) console.log(err);
        views = permissions.filterModelByUser(views, req.user);
        return res.send(views);
    });
};

exports.getViewById = function (req, res) {
    var id = req.params.id;
    View.findById(id).populate('venue').exec(function (err, view) {
        console.log("find by ", view);
        if (err) console.log(err);
        if (permissions.isUserAllowed(view, req.user)) {
            return res.send(view);
        }
        return res.json({error: "User not allowed."});
    });
};

exports.getZonesByView = function (req, res) {
    var id = req.params.id;
    View.findById(id).populate('zone_arr').populate('venue').exec(function (err, view) {
        if (err) console.log(err);
        if (permissions.isUserAllowed(view, req.user)) {
            return res.send(view.zone_arr);
        }
        return res.json({error: "User not allowed."});
    });
};

exports.createView = function (req, res) {
    var view;
    console.log("POST: ");
    var content = '';
    var venueId = req.params.venueId;

    req.on('data', function (data) {
        // Append data.
        content += data;
    });

    req.on('end', function () {
        try { // Assuming we are receiving JSON, parse the string into a JSON object
            var data = JSON.parse(content);

            if (!validator.validate(req, res, data))
                return;

            var checkVenueQuery = permissions.getIsValidVenueQuery(venueId, req.user);

            checkVenueQuery.then(function (venue) {
                if (!venue) {
                    res.send(400, {error: 'venueId not valid'});
                    return;
                }

                data.venue = venue._id;
                view = new View(data)
                view.save(function (err, view) {
                    if (!err) {
                        console.log("created", view);
                        return res.send({"view id": view._id});

                    } else {
                        console.log(err);
                        return res.send({"error": err.toString()});
                    }
                });
            });
        } catch (e) {
            // An error has occurred, log it
            console.log(e);
            return res.send({"error": e.toString()});
        }

    });
};

exports.updateView = function (req, res) {
    var id = req.params.id;
    var view = {};
    var content = '';

    req.on('data', function (data) {
        // Append data.
        content += data;
    });

    req.on('end', function () {
        try {
            var data = JSON.parse(content);

            if (!validator.validate(req, res, data))
                return;

            View.findById(id).populate('venue').exec(function (err, view) {
                if (err) return console.log(err);
                if (permissions.isUserAllowed(view, req.user)) {
                    for (var key in data) {
                        view[key] = data[key];
                    }
                    view.save();
                }

                return res.send(view);
            });
        } catch (e) {
            console.log(e);
            return res.send({"error": e.toString()});
        }
    });
};

exports.addRemoveZoneByView = function (req, res) {
    var id = req.params.id;
    var zone = req.params.zone;

    View.findById(id).populate('venue').exec(function (err, view) {
        if (err) return console.log(err);
        if (permissions.isUserAllowed(view, req.user)) {
            view.zone_arr.push(zone);
            view.save();

            return res.send(view);
        }
    });
};

exports.deleteView = function (req, res) {
    var id = req.params.id;
    View.findById(id, function (err, view) {
        if (view != null) {
            if (permissions.isUserAllowed(view, req.user)) {
                View.findById(id).remove(function (err) {
                    if (!err) {
                        console.log("removed");
                        return res.send('removed');
                    } else {
                        console.log(err);
                        return res.send({"error": e.toString()});
                    }
                });
            }
        } else {
            return res.send(400, {"error": "Document not found"});
        }
    });
};

exports.getViewChildren = function (req, res) {
    var id = req.params.id;
    View.findById(id).populate('children_arr').populate('venue').exec(function (err, view) {
        if (err)
            console.log(err);

        if (permissions.isUserAllowed(view, req.user)) {
            var result = {viewId: id};
            var childrenArr = [];
            if (view.children_arr) {
                for (var i = 0; i < view.children_arr.length; i++) {
                    var o = {};
                    o.childId = view.children_arr[i]._id;
                    o.childName = view.children_arr[i].name;
                    o.hasChildren = view.children_arr[i].children_arr && view.children_arr[i].children_arr.length > 0;
                    childrenArr.push(o);
                }
            }
            result.children = childrenArr;
            return res.send(result);
        }
    });
};

//http://localhost:3000/api/v1/views/52f8a739be04c4125d000006/attributes
exports.getAttributesOfViews = function (req, res) {
    var idsArr = [req.params.id];
    var query = View.find({_id: {$in: idsArr}})
        .select("attributes_arr");

    query.exec(
        function (err, records) {
            if (err) {
                res.send({"error": e.toString()});
                return;
            }

            var mergerdAttributes = [];
            for (var i = 0; i < records.length; i++) {
                if (permissions.isUserAllowed(records[i], req.user)) {
                    var viewAttArr = records[i].attributes_arr;
                    for (var j = 0; j < viewAttArr.length; j++) {
                        var attribute = viewAttArr[j];
                        if (mergerdAttributes.indexOf(attribute) == -1)
                            mergerdAttributes[mergerdAttributes.length] = attribute;
                    }
                }
            }

            Attribute.find({_id: {$in: mergerdAttributes}}, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send({"error": err.toString()});
                }

                res.send(result);
            })

        });
};

/**
 *
 * @param req the request it self
 * @param res the result object
 *
 * Returns all the existing attributes, and for each attribute it returns the list of views that have this attribute
 */
exports.getAllAttributes = function (req, res) {
    Attribute.find({}, function (err, attributes) {
        if (err) {
            console.log(err);
            res.send({"error": err.toString()});
        }

        //get all the attributes and push them to the map
        var attsViewsMap = new Object();
        for (var j = 0; j < attributes.length; j++) {
            attribute = attributes[j];
            var o = new Object();
            o.name = attribute.name;
            o.values = attribute.value;
            o.views = [];

            //to check all the views and for each one to push it's id to the attribute in the map
            attsViewsMap[attribute._id] = o;
        }

        //get all the views and push them to the their attributes in the map
        View.find("", function (err, views) {
            if (err) {
                console.log(err);
            } else {
                for (var i = 0; i < views.length; i++) {
                    view = views[i];
                    if (permissions.isUserAllowed(view, req.user)) {
                        viewAtts = view.attributes_arr;
                        for (var k = 0; k < viewAtts.length; k++) {
                            var viewsVal = attsViewsMap[viewAtts[k]];
                            if (viewsVal)
                                viewsVal.views.push(view.id);
                        }
                    }
                }
            }
            res.send(attsViewsMap);
        });
    })
};

exports.updateAttributesOfView = function (req, res) {
    var id = req.params.id;
    var view = {};
    var content = '';

    req.on('data', function (data) {
        content += data;
    });

    req.on('end', function () {
        try {
            var data = JSON.parse(content);
            if (!validator.validate(req, res, data))  //todo ask Gonsal about validation here
                return;

            attributesIdsArr = [];
            tasks = [];

            View.findById(id, function (err, view) {
                if (err) {
                    res.send({"error": err.toString()});
                    return console.log(err);
                }
                if (view == null) {
                    res.send("View not found");
                    return console.log("View not found");
                }

                if (!permissions.isUserAllowed(view, req.user)) {
                    res.send("User not allowed");
                    return;
                }
                //take all the provided attributes, create task for each one, and add it to tasks array
                for (var i = 0; i < data.attributes_arr.length; i++) {
                    var attToAdd = data.attributes_arr[i];
                    if (!attToAdd)
                        continue;
                    addStoreAttTask(attToAdd);
                }

                /*
                 async.parallel runs in parallel all the aync tasks in the tasks array,
                 the second parameter "function" will run after all async tasks are completed
                 */
                async.parallel(tasks, function (err) {
                    if (err) {
                        res.send({"error": err.toString()});
                        return console.log(err);
                    }

                    view.attributes_arr = attributesIdsArr;
                    view.save(function (err, view) {
                        if (err) {
                            res.send({"error": err.toString()});
                            return console.log(err);
                        }
                        res.send(view);
                    });
                });
            });

            /**
             * @param task
             * Add task to the tasks array, which represents the queries (dims).
             * This task must have the structure described in "dimension/readMe"
             */
            function addStoreAttTask(attToAdd) {
                //add task to the async tasks
                tasks.push(function (callback) {
                    //Try to find if the attribute is already defined
                    Attribute.find({"name": attToAdd.name, "value": attToAdd.value}, function (err, att) {
                        if (err) {
                            console.log("Error, when searching attribute");
                            callback();
                        }
                        //if the attribute was defined just return its ObjectId
                        else if (att && att[0] && att[0]._id) {
                            attributesIdsArr[attributesIdsArr.length] = att[0]._id;
                            callback();
                        }
                        //if the attributes wasn't defined yet, the creat new attributes, save it, and return its ObjectId
                        else {
                            var newAtt = new Attribute({"name": attToAdd.name, "value": attToAdd.value});
                            newAtt.save(function (err, savedAtt) {
                                if (err) {
                                    console.log(err);
                                    callback();//let async know the task is finished
                                } else {
                                    console.log("created");
                                    attributesIdsArr[attributesIdsArr.length] = savedAtt._id;
                                    callback();//let async know the task is finished
                                }
                            })
                        }
                    });
                })
            }
        } catch (e) {
            console.log(e);
            res.send({"error": e.toString()});
        }
    });
};

//find an Attribute by id, find Views that contain that Attribute, remove it from Views and delete it
exports.deleteAttribute = function (req, res) {
    var id = req.params.id;
    Attribute.findById(id, function (err, attribute) {
        if (err) {
            res.send({"error": err.toString()});
            return console.log(err);
        }
        if (attribute == null) {
            res.send("Attribute not found");
            return console.log("Attribute not found");
        }

        var query = View.find({attributes_arr: {$in: [ObjectId(id)]}});

        query.exec(
            function (err, docs) {
                if (err) {
                    console.log(err);
                    res.send({"error": err.toString()});
                    return;
                }
                docs.forEach(function (doc) {
                    var index = doc.attributes_arr.indexOf(ObjectId(id));
                    doc.attributes_arr.splice(index, 1);

                    console.log(doc.attributes_arr);

                    doc.save(function (err, savedDoc) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(savedDoc);
                        }
                    })

                });

                attribute.remove(function (err) {
                    if (!err) {
                        console.log("Attribute removed");
                        res.send('Attribute removed');
                    } else {
                        console.log(err);
                        res.send({"error": e.toString()});
                    }
                });

            });
    });
};
