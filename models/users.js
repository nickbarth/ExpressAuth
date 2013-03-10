var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    UserSchema = null,
    User = null;

/* User Schema */
UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  resetToken: { type: String, required: true },
  resetTime: { type: Date, required: true }
});

/* Properties */

// Id Property
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Password Property
UserSchema.virtual('password').get(function (password) {
  return this._password;
}).set(function (password) {
  this._password = password;
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, this.salt);
});

/* User Instance Methods */

// Verifies a users password.
//
// password - Takes user password.
// callback
//
// Returns callback with a boolean on if the password was verified.
UserSchema.methods.verifyPassword = (function (password, callback) {
  bcrypt.compare(password, this.hash, callback);
});

// Updates a users reset token and time.
//
// callback
//
// Returns and calls callback when saved.
UserSchema.methods.updateReset = (function (callback) {
  this.resetToken = escape(bcrypt.genSaltSync(5));
  this.resetTime = (new Date());
  this.save(function () {
    return callback();
  });
});

// Updates a users name, email, and password.
//
// name - Set as users name.
// email - Set as users email.
// password - Set as users password.
// callback
//
// Returns and calls callback when saved.
UserSchema.methods.updateSettings = (function (name, email, password, callback) {
  this.name = name || this.name;
  this.email = email || this.email;
  this.password = password || this.password;
  this.save(function (err) {
    return callback();
  });
});

/* User Static Methods */

// Registers a new user.
//
// name - Set as new users name.
// email - Set as new users email.
// password - Set as new users password.
// callback
//
// Returns callback with either the new user or false if there wan an error.
UserSchema.statics.register = (function (name, email, password, callback) {
  var user = new User({
    name: name,
    email: email,
    password: password,
    resetToken: escape(bcrypt.genSaltSync(5)),
    resetTime: (new Date())
  });
  user.save(function (err) {
    if (err) {
      return callback(false);
    } else {
      return callback(user);
    }
  });
});

// Authenticates a user.
//
// email - Looks up a user by a given email.
// password - Password to verify user against.
// callback
//
// Returns callback with either the found and verified user or false.
UserSchema.statics.authenticate = (function (email, password, callback) {
  this.findOne({ email: email }, function (err, user) {
    if (err || !user) return callback(false);

    user.verifyPassword(password, function (err, passwordCorrect) {
      if (err || !passwordCorrect) return callback(false);
      return callback(user);
    });
  });
});

// Finds a user users by reset and password.
//
// email - Used to lookup user
// resetToken - Also used to lookup user.
// callback
//
// Returns callback with the found user or false if the user is not found or
// their reset token has expired.
UserSchema.statics.findByReset = (function (email, resetToken, callback) {
  this.findOne({ email: email, resetToken: resetToken }, function (err, user) {
    var fiveMinutesAgo = (function () { return ((new Date())-5*60000); });
    if (err || !user) return callback(false);
    if (user.resetTime > fiveMinutesAgo()) {
      user.updateReset(function () {
        return callback(user);
      });
    } else {
      return callback(false);
    }
  });
});

User = mongoose.model('User', UserSchema);
module.exports = User;
