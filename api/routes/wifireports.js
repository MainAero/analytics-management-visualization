var wifireport = require('../controllers/wifireport');
var node = require('../controllers/zone');
var venue = require('../controllers/venue');

module.exports = function (app, nconf) {

    var vreports = "/venues/reports/:master_id";
    /**
     * Venues stats routes
     */
    app.get(vreports, wifireport.list);
    app.get(vreports + '/distinct_targets', wifireport.distTargets);
    app.get(vreports + '/distinct-targets', wifireport.distinctTargets);
    app.get(vreports + '/distinct-targets/count', wifireport.distinctTargetsCount);
    app.get(vreports + '/distinct-targets/per-date/:start_time/:end_time/', wifireport.distinctTargetsByTime);
    app.get(vreports + '/distinct-targets/count/per-date/:start_time/:end_time/', wifireport.distinct_targets_count_by_time);

    app.get(vreports + '/node/:node_id/distinct-targets', wifireport.distinct_targets_per_node);
    app.get(vreports + '/node/:node_id/distinct-targets/count', wifireport.distinct_targets_count_per_node);
    app.get(vreports + '/node/:node_id/distinct-targets/per-date/:start_time/:end_time/', wifireport.distinct_targets_per_node_by_time);
    app.get(vreports + '/node/:node_id/distinct-targets/count/per-date/:start_time/:end_time/', wifireport.distinct_targets_count_per_node_by_time);


    /**
     * Store TallyNode Reports
     */
    app.post('/venues/wifireport', wifireport.save);
};

