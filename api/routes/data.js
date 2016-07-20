var dataController = require('../controllers/data');

module.exports = function (app, nconf) {
    /**
     * The main endpoint for the analytics api.
     * http://localhost:3000/api/v1/data?viewId=testId&start-date=2013092715&end-date=2013092718
     */

    app.get(nconf.get("rest:api_url_prefix") + "/data", dataController.get_data);
};

