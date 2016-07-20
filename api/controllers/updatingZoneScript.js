var tallynode = require('../models/tallyNode.js');
var wifireport = require('../models/wifireport.js');

//db.wifireport.find({"measurements.zone" :  {$exists: false}}).pretty()
var mapTnId_Zone = new Object();

exports.runUpdatingScript = function () {
    console.log("Start Script");
    exports.getAllNodes();
};

exports.getAllNodes = function () {
    tallynode.find("", function (err, tallyNodes) {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            for (var i = 0; i < tallyNodes.length; i++) {
                var tn = tallyNodes[i];
                mapTnId_Zone[tn.tallyNodeId] = tn.zone;
                console.log(tn.tallyNodeId + "-->" + tn.zone);
            }
        }
        exports.update_zones_WifiReports();

    });
};

exports.update_zones_WifiReports = function () {
    wifireport.find({timestamp_start: {$gt: 1389225600}}).
        limit(50000).
        exists('measurements.zone', false).
        exec(
        function (err, wifireportsLst) {
            if (err) {
                console.log(err);
                return err;
            }
            var toUpdate = false;

            for (var i = 0; i < wifireportsLst.length; i++) {
                var wifireportRec = wifireportsLst[i];

                //taking each one of the measurements
                for (var j = 0; j < wifireportRec.measurements.length; j++) {
                    var measurment = wifireportRec.measurements[j];
                    if (!measurment.zone) {

                        var zone = mapTnId_Zone[measurment.node_id];
                        //console.log(measurment.node_id);
                        if (zone) {
                            toUpdate = true;
                            measurment.zone = zone;
                           // console.log(measurment.zone);
                        }
                    }
                }
                if (toUpdate) {
                    console.log(i);
                    wifireportRec.save(function (err) {
                        if (!err) {
                            console.log("updated");
                        } else {
                            console.log(err);
                        }

                    });
                }
                toUpdate = false;
                //wifireport.find({ _id: wifireportRec._id }).update({ measurements: wifireportRec.measurements });

            }
        });
};

