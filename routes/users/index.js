// Dependencies
const express = require('express');
const router = express.Router();

// Models
const Mailer = require('../../models/extensions/mailer');
const User = require('../../models/users');

/* Auth Middleware */

// Check user is authenticated.
//
// Returns an error if not signed in.
const checkAuth = ((req, res, next) => {
  if (!req.session.userId) {
    res.status(403);
    res.send('Please login to access this page.');
  } else {
    next();
  }
});

// Sets CSRF token.
//
// Sets the csrf token so it can be used for CSRF form protection.
router.use((req, res, next) => {
  res.locals.csrf = req.session._csrf;
  next();
});

// Display flash notices.
//
// Sets the local notice variable if the session is set.
router.use((req, res, next) => {
  res.locals.notice = req.session.notice;
  req.session.notice = false;
  next();
});

// Sets current user.
//
// Sets the current user variable for views.
router.use((req, res, next) => {
  if (req.session.userId) {
    User.findById(req.session.userId, function (user) {
      res.locals.currentUser = user;
      next();
    });
  } else {
    res.locals.currentUser = false;
    next();
  }
});

/* Routes */
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', (req, res) => {
  req.session.userId = undefined;
  req.session.notice = 'Successfully logged out.';
  res.redirect('/');
});

router.get('/members', checkAuth, (req, res) => {
  res.render('members');
});

router.get('/members/account', checkAuth, (req, res) => {
  res.render('account');
});

router.get('/reminder', (req, res) => {
  res.render('reminder');
});

router.get('/reset/:email/:reset_token', checkAuth, (req, res) => {
  User.findByReset(req.params.email, req.params.resetToken, function (user) {
    if (user) {
      req.session.userId = user._id;
      res.render('reset');
    } else {
      req.session.notice = 'Invalid email or reset token.';
      res.redirect('/');
    }
  });
});

router.post('/signup', (req, res) => {
  User.register(req.body.name, req.body.email, req.body.password, function (user) {
    if (user) {
      Mailer(user).sendWelcomeMessage();
      req.session.userId = user._id;
      req.session.notice = 'Thank you for becoming a member.';
      res.redirect('/members');
    } else {
      req.session.notice = 'Invalid email or password.';
      res.redirect('/signup');
    }
  });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body.email, req.body.password, function (user) {
    if (user) {
      req.session.userId = user._id;
      req.session.notice = 'Successfully logged in.';
      res.redirect('/members');
    } else {
      req.session.notice = 'Invalid email or password.';
      res.redirect('/login');
    }
  });
});

router.post('/members/account', checkAuth, (req, res) => {
  User.findById(req.session.userId, function (currentUser) {
    currentUser.updateSettings(req.body.name, req.body.email, req.body.password, function () {
      res.locals.notice = 'Your settings have been updated.';
      res.locals.currentUser = currentUser;
      res.render('account');
    });
  });
});

router.post('/reminder', (req, res) => {
  User.findByReminder(req.body.name, req.body.email, function (user) {
    if (user) {
      user.updateReset();
      Mailer(user).sendPasswordReset();
    }
    res.locals.notice = 'Your password reset email has been sent.';
    res.render('reminder');
  });
});

router.post('/reset', (req, res) => {
  User.findById(req.session.userId, function (currentUser) {
    currentUser.updateSettings('', '', req.body.password, function (user) {
      req.session.notice = 'Password successfully updated.';
      res.redirect('/account');
    });
  });
});

module.exports = router
