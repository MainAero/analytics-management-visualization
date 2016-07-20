var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var token = require('../token.js');

userSchema = new Schema({
    username: {type: String, lowercase: true, unique: true},
    salt: String,
    hash: String,
    role: String,
    token: String
}, {
    collection: 'user'
});


userSchema.methods.validPassword = function (password, salt) {
    return (userSchema.methods.hashPassword(password, salt) == this.hash);
};
userSchema.methods.generateSalt = function () {
    return bcrypt.genSaltSync(10);
}
userSchema.methods.hashPassword = function (password, salt) {
    // Hash the password with the salt
    return bcrypt.hashSync(password, salt);
};
userSchema.methods.generateToken = function() {
    this.token = token.encode(this);
    return this.token;
};


userSchema.pre('save', function (next) {
    this.generateToken();
    next();
});

module.exports = mongoose.model('User', userSchema);



