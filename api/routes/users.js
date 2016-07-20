var userController = require('../controllers/user');

module.exports = function (app, nconf) {

    /**
     * User Routes
     */

    // Lists all users
    app.get(nconf.get("rest:api_url_prefix") + '/users', userController.getUsers);

    // List a user by id
    app.get(nconf.get("rest:api_url_prefix") + '/users/:id', userController.getUserById);

    // List a user by username
    app.get(nconf.get("rest:api_url_prefix") + '/users/:username/username', userController.getUserByUserName);

    // Update user by id
    app.post(nconf.get("rest:api_url_prefix") + '/users/:id', userController.updateUser);

    // Delete user by id
    app.delete(nconf.get("rest:api_url_prefix") + '/users/:id', userController.deleteUser);

    // Create a user
    app.post(nconf.get("rest:api_url_prefix") + '/users', userController.createUser);
};