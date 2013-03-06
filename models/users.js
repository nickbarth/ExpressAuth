var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    UserSchema = null,
    User = null;

/* User Schema */
UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true }
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

// Registers a new user.
//
// email - Set as new users email.
// password - Set as new users password.
// callback
//
// Returns callback with either the new user or false if there wan an error.
UserSchema.statics.register = (function (email, password, callback) {
  var user = new User({ email: email, password: password });
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

/* User Class Methods */

// Finds a user users by reset and password.
//
// email - Used to lookup user
// reset_token - Also used to lookup user.
// callback
//
// Returns callback with the found user or false if the user is not found or
// their reset token has expired.
UserSchema.statics.find_by_reset = (function (email, reset_token, callback) {
  this.findOne({ email: email, reset_token: reset_token }, function (err, user) {
    var fiveMinutesAgo = (function () { return ((new Date())*5*60000); });
    if (err || !user) return callback(false);
    if (user.reset_time > fiveMinutesAgo()) {
      return callback(user);
    } else {
      return callback(false);
    }
  });
});

User = mongoose.model('User', UserSchema);
