var mongoose = require('mongoose'),
    User = require('../../models/users'),
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/expressAuth-test';

if (!mongoose.connections[0]._readyState) {
  mongoose.connect('mongodb://localhost/tddauth-test', {db: { safe: true }});
}

describe('User', function () {
  var currentUser = null;

  beforeEach(function (done) {
    User.register('john doe', 'john.doe@example.com', 'password', function(user){
      currentUser = user;
      done();
    });
  });

  afterEach(function (done) {
    User.remove({}, function () {
      done();
    });
  });

  describe('static method', function () {
    describe('#register', function () {
      it('registers a new user', function (done){
        User.register('jane doe', 'jane.doe@example.com', 'password', function(user) {
          user.email.should.equal('jane.doe@example.com');
          done();
        });
      });

      it('fails on invalid emails', function (done){
        User.register('john doe', 'john.doeexample.com', 'password', function(user) {
          user.should.equal(false);
          done();
        });
      });

      it('fails on nonunique emails', function (done){
        User.register('john doe', 'john.doe@example.com', 'password', function(user) {
          user.should.equal(false);
          done();
        });
      });
    }); // end #register

    describe('#findByReset', function () {
      it('finds a user by their reset token and email', function (done){
        User.findByReset(currentUser.email, currentUser.resetToken, function(doc){
          doc.email.should.equal('john.doe@example.com');
          doc.resetToken.should.not.equal(currentUser.resetToken);
          done();
        });
      });

      it('fails if resetTime is more than 5 minutes ago', function (done){
        currentUser.resetTime = (new Date()) - (5*60000);
        currentUser.save(function (err) {
          User.findByReset(currentUser.email, currentUser.resetToken, function(doc){
            doc.should.equal(false);
            done();
          });
        });
      });
    }); // end #findByReset

    describe('#authenticate', function () {
      it('returns user with valid login', function (done){
        User.authenticate(currentUser.email, 'password', function(user){
          user.email.should.equal('john.doe@example.com');
          done();
        });
      });

      it('fails with invalid login', function (done){
        User.authenticate(currentUser.email, 'invalid_password', function(user){
          user.should.equal(false);
          done();
        });
      });
    }); // end #authenticate
  }); // end static method

  describe('instance method', function () {
    describe('#updateSettings', function () {
      it('returns true with successful update', function (done){
        currentUser.updateSettings('new name', 'new.email@example.com', 'new password', function () {
          currentUser.name.should.equal('new name');
          currentUser.email.should.equal('new.email@example.com');
          currentUser.verifyPassword('new password', function (err, passwordCorrect) {
            passwordCorrect.should.equal(true);
            done();
          });
        });
      });

      it('fails with invalid data', function (done) {
        currentUser.updateSettings('', '', '', function () {
          currentUser.name.should.equal('john doe');
          currentUser.email.should.equal('john.doe@example.com');
          currentUser.verifyPassword('', function (err, passwordCorrect) {
            passwordCorrect.should.equal(false);
            done();
          });
          done();
        });
      });
    }); // end #authenticate
  }); // end instance method
}); // end User
