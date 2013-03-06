var mongoose = require('mongoose'),
    User = require('../../models/users');

describe('Users', function () {
  var currentCustomer = null;

  beforeEach(function (done) {
    User.register('test@test.com', 'password', 'password', function(doc){
      currentCustomer = doc;
      done();
    });
  });

  afterEach(function (done) {
    User.model.remove({}, function () {
      done();
    });
  });

  describe('#register', function () {
    it('registers a new user', function(done){
      User.register('test2@test.com', 'password', 'password', function(user) {
        user.email.should.equal('test2@test.com');
        user.hash.should.not.equal('password');
        done();
      });
    });
  });

  /*
  describe('#find_by_reset', function () {
    it('finds ', function(done){
      User.findByEmail(currentCustomer.email, function(doc){
        doc.email.should.equal('test@test.com');
        done();
      });
    });
  });

  it('retrieves by token', function(done){
    User.findByToken(currentCustomer.auth_token, function(doc){
      doc.email.should.equal('test@test.com');
      done();
    });
  });

  it('authenticates and returns User with valid login', function(done){
    User.authenticate(currentCustomer.email, 'password', function(User){
      User.email.should.equal('test@test.com');
      done();
    }, function(){
      throw('oops');
      done();
    });
  });

  it('authenticates and returns fail with invalid login', function(done){
    User.authenticate(currentCustomer.email, 'liar', function(User){
      throw('This shouldn't happen');
    }, function(){
      done();
    });
  });
    */
});

