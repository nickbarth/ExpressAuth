var mongoose = require('mongoose'),
    User = require('../../models/users');


describe('User', function () {
  var currentUser = null;

  beforeEach(function (done) {
    User.register('john doe', 'test@test.com', 'password', function(user){
      currentUser = user;
      done();
    });
  });

  afterEach(function (done) {
    User.remove({}, function () {
      done();
    });
  });

  describe('class method', function () {

    describe('#register', function () {
      it('registers a new user', function(done){
        User.register('john doe', 'test2@test.com', 'password', function(user) {
          user.email.should.equal('test2@test.com');
          done();
        });
      });

      it('fails on nonunique emails', function(done){
        User.register('john doe', 'test@test.com', 'password', function(user) {
          user.should.equal(false);
          done();
        });
      });
    });

    describe('#findByReset', function () {
      it('finds a user by their reset token and email', function(done){
        User.findByReset(currentUser.email, currentUser.resetToken, function(doc){
          doc.email.should.equal('test@test.com');
          doc.resetToken.should.not.equal(currentUser.resetToken);
          done();
        });
      });

      it('fails if resetTime is more than 5 minutes ago', function(done){
        currentUser.resetTime = (new Date()) - (5*60000);
        currentUser.save(function (err) {
          User.findByReset(currentUser.email, currentUser.resetToken, function(doc){
            doc.should.equal(false);
            done();
          });
        });
      });
    });

    describe('#authenticate', function () {
      it('returns user with valid login', function(done){
        User.authenticate(currentUser.email, 'password', function(user){
          user.email.should.equal('test@test.com');
          done();
        });
      });

      it('fails with invalid login', function(done){
        User.authenticate(currentUser.email, 'invalid_password', function(user){
          user.should.equal(false);
          done();
        });
      });
    });
  });
});

