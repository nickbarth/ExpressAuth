var request = require('supertest'),
    superagent = require('superagent'),
    agent = superagent.agent(),
    login = superagent.agent(),
    mongoose = require('mongoose'),
    User = require('../../models/users');
    app = require('../../server'),
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/expressAuth-test';

if (!mongoose.connections[0]._readyState) {
  mongoose.connect(mongoUri, {db: { safe: true }});
}

describe('User Controller', function () {
  var currentUser = null;

  // Saves a login cookie for pages which require authentication and the current user.
  //
  // Returns an nothing if successful, otherwise an error is thrown.
  before(function (done) {
    request(app).post('/signup').send({ name: 'john doe', email: 'john.doe@example.com', password: 'password' }).end(function (err, res) {
      if (err) return done(err);
      User.findOne({ email: 'john.doe@example.com' }, function (err, user) {
        if (err) return done(err);
        login.saveCookies(res);
        currentUser = user;
        done();
      });
    });
  }); // End Before

  // Cleans the user database after all tests have completed.
  //
  // Returns an nothing if successful, otherwise an error is thrown.
  after(function (done) {
    User.remove({}, function (err) {
      if (err) return done(err);
      done();
    });
  }); // End After

  describe('GET /', function () {
    it('displays the home page', function (done) {
      request(app).get('/').expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h1>Express Auth</h1>');
        done();
      });
    });
  }); // End GET /

  describe('GET /signup', function () {
    it('displays the sign up page', function (done) {
      request(app).get('/signup').expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h2>Sign Up</h2>');
        done();
      });
    });
  }); // End GET /signup

  describe('GET /login', function () {
    it('displays the login page', function (done) {
      request(app).get('/login').expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h2>Login</h2>');
        done();
      });
    });
  }); // End GET /login

  describe('GET /logout', function () {
    it('redirects to home page', function (done) {
      request(app).get('/logout').expect(302).end(function (err, res) {
        if (err) return done(err);
        res.headers.location.should.equal('/');
        agent.saveCookies(res);

        var req = request(app).get('/');
        agent.attachCookies(req);
        req.expect(200).end(function (err, res) {
          res.text.should.include('Successfully logged out.');
          done();
        });
      });
    });
  }); // End GET /logout

  describe('GET /members', function () {
    it('displays the members page', function (done) {
      var req = request(app).get('/members');
      login.attachCookies(req);

      req.expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h2>Members</h2>');
        done();
      });
    });

    it('displays an error if not logged in', function (done) {
      request(app).get('/members').expect(403).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('Please login to access this page.');
        done();
      });
    });
  }); // End GET /members

  describe('GET /members/account', function () {
    it('displays the account page', function (done) {
      var req = request(app).get('/members/account');
      login.attachCookies(req);

      req.expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h2>Account</h2>');
        done();
      });
    });

    it('displays an error if not logged in', function (done) {
      request(app).get('/members/account').expect(403).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('Please login to access this page.');
        done();
      });
    });
  }); // End GET /members/account

  describe('GET /reminder', function () {
    it('displays the reminder page', function (done) {
      request(app).get('/reminder').expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h2>Password Reminder</h2>');
        done();
      });
    });
  }); // End GET /reminder

  describe('GET /reset/:email/:resetToken', function () {
    it('displays the reset page', function (done) {
      request(app).get('/reset/'+encodeURIComponent(currentUser.email)+'/'+currentUser.resetToken).expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h2>Reset Password</h2>');
        done();
      });
    });
  }); // End GET /reset/:email/:resetToken

  describe('POST /signup', function () {
    it('redirects to members page on success', function (done) {
      var req = request(app).post('/signup').send({ name: 'jane doe', email: 'jane.doe@example.com', password: 'password' });

      req.end(function (err, res) {
        if (err) return done(err);
        res.headers.location.should.equal('/members');
        agent.saveCookies(res);

        req = request(app).get('/members');
        agent.attachCookies(req);
        req.expect(200).end(function (err, res) {
          res.text.should.include('Thank you for becoming a member.');
          done();
        });
      });
    });

    it('displays error on invalid entry', function (done) {
      var req = request(app).post('/signup').send({ name: 'john doe', email: 'john.doe@example.com', password: 'password' });

      req.end(function (err, res) {
        if (err) return done(err);
        res.headers.location.should.equal('/signup');
        agent.saveCookies(res);

        req = request(app).get('/signup');
        agent.attachCookies(req);
        req.expect(200).end(function (err, res) {
          res.text.should.include('Invalid email or password.');
          done();
        });
      });
    });
  }); // End POST /signup

  describe('POST /login', function () {
    it('redirects to members page on success', function (done) {
      var req = request(app).post('/login').send({ email: 'john.doe@example.com', password: 'password' });

      req.end(function (err, res) {
        if (err) return done(err);
        res.headers.location.should.equal('/members');
        agent.saveCookies(res);

        req = request(app).get('/members');
        agent.attachCookies(req);
        req.expect(200).end(function (err, res) {
          res.text.should.include('Successfully logged in.');
          done();
        });
      });
    });

    it('displays error on invalid login', function (done) {
      var req = request(app).post('/login').send({ name: 'jim doe', email: 'jim.doe@example.com', password: 'password' });

      req.end(function (err, res) {
        if (err) return done(err);
        res.headers.location.should.equal('/login');
        agent.saveCookies(res);

        req = request(app).get('/login');
        agent.attachCookies(req);
        req.expect(200).end(function (err, res) {
          res.text.should.include('Invalid email or password.');
          done();
        });
      });
    });
  }); // End POST /login

  describe('POST /members/account', function () {
    it('updates user information', function (done) {
      var req = request(app).post('/members/account');
      login.attachCookies(req);
      req.send({ email: 'jim.doe@example.com', password: 'password' });

      req.end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('<h2>Account</h2>');
        res.text.should.include('jim.doe@example.com');
        done();
      });
    });
  }); // End POST /members/account

  describe('POST /reminder', function () {
    it('displays the reset page', function (done) {
      var req = request(app).post('/reminder').send({ name: 'jim doe', email: 'jim.doe@example.com' }).end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('Your password reset email has been sent.');
        done();
      });
    });
  }); // End POST /reminder

  describe('POST /reset', function () {
    it('displays the reset page', function (done) {
      var req = request(app).post('/reset');
      login.attachCookies(req);

      req.send({ password: 'newpassword' }).end(function (err, res) {
        if (err) return done(err);
        res.headers.location.should.equal('/account');
        done();
      });
    });
  }); // End POST /reset
}); // End User Controller
