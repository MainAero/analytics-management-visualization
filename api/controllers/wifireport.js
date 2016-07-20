var Wifireport = require('../models/wifireport.js');
var targetId = 'wlan_sa'

exports.list = function (req, res) {
    Wifireport.find('', function (err, reports) {
        res.send(reports);
    });
};

exports.distTargets = function (req, res) {
    var master_id = req.params.master_id;
    if (master_id != "all") {
        Wifireport.aggregate({$match: {master_id: master_id}}, {$group: {_id: '$wlan_sa'}}, {$group: { _id: 1, count: { $sum: 1 }}}, {$project: {_id: 0, count: 1}}, function (err, counter) {
            console.log(counter);
            res.send(counter);
        });
    } else {
        Wifireport.aggregate({$group: {_id: '$wlan_sa'}}, {$group: { _id: 1, count: { $sum: 1 }}}, {$project: {_id: 0, count: 1}}, function (err, counter) {
            console.log(counter);
            res.send(counter);
        });
    }
}

exports.distinctTargets = function (req, res) {
    var master_id = req.params.master_id;
    if (master_id == "all") {
        Wifireport.find('').distinct(targetId, function (err, reports) {
            res.send(reports);
        });
    } else {
        Wifireport.find({"master_id": req.params.master_id}).distinct(targetId, function (err, reports) {
            res.send(reports);
        });
    }
}

exports.distinctTargetsCount = function (req, res) {
    var master_id = req.params.master_id;
    //this.distinctTargets(req,res);
    if (master_id == "all") {
        Wifireport.find().distinct(targetId, function (err, reports) {
            res.send(reports.length.toString());
        });
    } else {
        Wifireport.find({"master_id": master_id}).distinct(targetId, function (err, reports) {
            res.send(reports.length.toString());
        });
    }
}

exports.distinctTargetsByTime = function (req, res) {
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    var master_id = req.params.master_id;
    if (req.params.master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, reports) {
                res.send(reports);
            });
    } else {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time},
                "master_id": req.params.master_id}).distinct(targetId, function (err, reports) {
                res.send(reports);
            });
    }
}

exports.distinct_targets_count_by_time = function (req, res) {
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    var master_id = req.params.master_id;
    if (req.params.master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, reports) {
                res.send(reports.length.toString());
            });
    } else {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time},
                "master_id": req.params.master_id}).distinct(targetId, function (err, reports) {
                res.send(reports.length.toString());
            });
    }
}


exports.distinct_targets_per_node = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    if (master_id == "all") {
        Wifireport.find('').distinct(targetId, function (err, reports) {
            res.send(reports);
        });
    } else {
        if (node_id == "all") {
            Wifireport.find({"master_id": master_id}).distinct(targetId, function (err, reports) {
                res.send(reports);
            });
        } else {
            Wifireport.find({"master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, reports) {
                res.send(reports);
            });
        }
    }
}

exports.distinct_targets_count_per_node = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    if (master_id == "all") {
        Wifireport.find('').distinct(targetId, function (err, reports) {
            res.send(reports.length.toString());
        });
    } else {
        if (node_id == "all") {
            Wifireport.find({"master_id": master_id}).distinct(targetId, function (err, reports) {
                res.send(reports.length.toString());
            });
        } else {
            Wifireport.find({"master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, reports) {
                res.send(reports.length.toString());
            });
        }
    }
}

exports.distinct_targets_per_node_by_time = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    if (master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, reports) {
                res.send(reports);
            });
    } else {
        if (node_id = "all") {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": req.params.master_id}).distinct(targetId, function (err, reports) {
                    res.send(reports);
                });
        } else {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, reports) {
                    res.send(reports);
                });
        }
    }
}

exports.distinct_targets_count_per_node_by_time = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    if (master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, reports) {
                res.send(reports.length.toString());
            });
    } else {
        if (node_id = "all") {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": req.params.master_id}).distinct(targetId, function (err, reports) {
                    res.send(reports.length.toString());
                });
        } else {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, reports) {
                    res.send(reports.length.toString());
                });
        }
    }
}


//todo (naseem) check..
exports.distinctTargetsCount = function (req, res) {
    var master_id = req.params.master_id;
    Wifireport.find(master_id == "all" ? "" : {"master_id": master_id}).distinct(targetId, function (err, records) {
        res.send(records.length.toString());
    });
}


exports.distinctTargetsByTime = function (req, res) {
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    var master_id = req.params.master_id;
    if (req.params.master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, records) {
                res.send(records);
            });
    } else {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time},
                "master_id": req.params.master_id}).distinct(targetId, function (err, records) {
                res.send(records);
            });
    }
}

exports.distinct_targets_count_by_time = function (req, res) {
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    var master_id = req.params.master_id;
    if (req.params.master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, records) {
                res.send(records.length.toString());
            });
    } else {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time},
                "master_id": req.params.master_id}).distinct(targetId, function (err, records) {
                res.send(records.length.toString());
            });
    }
}


exports.distinct_targets_per_node = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    if (master_id == "all") {
        Wifireport.find('').distinct(targetId, function (err, records) {
            res.send(records);
        });
    } else {
        if (node_id == "all") {
            Wifireport.find({"master_id": master_id}).distinct(targetId, function (err, records) {
                res.send(records);
            });
        } else {
            Wifireport.find({"master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, records) {
                res.send(records);
            });
        }
    }
}

exports.distinct_targets_count_per_node = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    if (master_id == "all") {
        Wifireport.find('').distinct(targetId, function (err, records) {
            res.send(records.length.toString());
        });
    } else {
        if (node_id == "all") {
            Wifireport.find({"master_id": master_id}).distinct(targetId, function (err, records) {
                res.send(records.length.toString());
            });
        } else {
            Wifireport.find({"master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, records) {
                res.send(records.length.toString());
            });
        }
    }
}

exports.distinct_targets_per_node_by_time = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    if (master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, records) {
                res.send(records);
            });
    } else {
        if (node_id = "all") {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": req.params.master_id}).distinct(targetId, function (err, records) {
                    res.send(records);
                });
        } else {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, records) {
                    res.send(records);
                });
        }
    }
}

exports.distinct_targets_count_per_node_by_time = function (req, res) {
    var master_id = req.params.master_id;
    var node_id = req.params.node_id;
    var start_time = req.params.start_time;
    var end_time = req.params.end_time;
    if (master_id == "all") {
        Wifireport.find(
            {"timestamp": {"$gte": start_time, "$lt": end_time}}).distinct(targetId, function (err, records) {
                res.send(records.length.toString());
            });
    } else {
        if (node_id = "all") {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": req.params.master_id}).distinct(targetId, function (err, records) {
                    res.send(records.length.toString());
                });
        } else {
            Wifireport.find(
                {"timestamp": {"$gte": start_time, "$lt": end_time},
                    "master_id": master_id, "node_id": node_id}).distinct(targetId, function (err, records) {
                    res.send(records.length.toString());
                });
        }
    }
}


exports.save = function (req, res) {
    var wifireport;
    console.log("POST: ");
    console.log(req.body);
    wifireport = new wifireport({
        master_id: req.body.master_id,
        timestamp_start: req.body.timestamp_start,
        timestamp_end: req.body.timestamp_end,
        target_id: req.body.target_id,
        measurments: [
            {
                node_id: req.body.measurments.node_id,
                rssi: req.body.measurments.rssi,
                noise: req.body.measurments.noise,
                ch_type: req.body.measurments.ch_type,
                ch_freq: req.body.measurments.ch_freq
            }
        ]
    });
    wifireport.save(function (err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });

    return res.send(wifireport);
}

