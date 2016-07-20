/**
 * @author MainAero
 */

var jwt = require('jwt-simple');

module.exports = {
    getSecret: function() {
        return '4c1a23806c7def89f5a99cb5208438b950f9be1d';
    },
    encode: function(payload) {
        return jwt.encode(payload, this.getSecret());
    },
    decode: function(token) {
        return jwt.decode(token, this.getSecret());
    }
};