var User = require('../../models/users');

module.exports = UserAPI = {
  helpers: {

    setCSRF: (function (req, res, next) {
      res.locals.csrf = req.session._csrf;
      next();
    }),

    // Display flash notices.
    //
    // Sets the local notice variable if the session is set.
    checkNotice: (function (req, res, next) {
      res.locals.notice = req.session.notice;
      req.session.notice = false;
      next();
    }),

    // Sets current user.
    //
    // Sets the current user variable for views.
    setCurrentUser: (function (req, res, next) {
      if (req.session.userId) {
        User.findById(req.session.userId, function (user) {
          res.locals.currentUser = user;
          next();
        });
      } else {
        res.locals.currentUser = false;
        next();
      }
    }),

    // Check user is authenticated.
    //
    // Returns an error if not signed in.
    checkAuth: (function (req, res, next) {
      if (!req.session.userId) {
        res.send(403, 'Please login to access this page.');
      } else {
        next();
      }
    })
  },

  // get '/'
  home: function (req, res) {
    res.render('index');
  },

  // get '/signup'
  getSignUp: function (req, res) {
    res.render('signup');
  },

  // get '/login'
  getLogin: function (req, res) {
    res.render('login');
  },

  // get '/logout'
  getLogout: function (req, res) {
    req.session.userId = undefined;
    req.session.notice = 'Successfully logged out.';
    res.redirect('/');
  },

  // get '/members'
  getMembers: function (req, res) {
    res.render('members');
  },

  // get '/members/account'
  getMembersAccount: function (req, res) {
    res.render('account');
  },

  // get '/reminder'
  getReminder: function (req, res) {
    res.render('reminder');
  },

  // get '/reset/:email/:reset_token'
  getReset: function (req, res) {
    User.findByReset(req.params.email, req.params.resetToken, function (user) {
      if (user) {
        req.session.userId = user._id;
        res.render('reset');
      } else {
        res.send('Invalid email or reset token.');
      }
    });
  },

  // post '/signup'
  postSignUp: function (req, res) {
    User.register(req.body.name, req.body.email, req.body.password, function (user) {
      if (user) {
        req.session.userId = user._id;
        req.session.notice = 'Thank you for becoming a member.';
        res.redirect('/members');
      } else {
        res.send('Invalid email or password.');
      }
    });
  },

  // post '/login'
  postLogin: function (req, res) {
    User.authenticate(req.body.email, req.body.password, function (user) {
      if (user) {
        req.session.userId = user._id;
        req.session.notice = 'Successfully logged in.';
        res.redirect('/members');
      } else {
        res.send('Invalid email or password.');
      }
    });
  },

  // post '/members/account'
  postMembersAccount: function (req, res) {
    User.findById(req.session.userId, function (currentUser) {
      currentUser.updateSettings(req.body.name, req.body.email, req.body.password, function () {
        res.locals.notice = 'Your settings have been updated.';
        res.locals.currentUser = currentUser;
        res.render('account');
      });
    });
  },

  // post '/reminder'
  postReminder: function (req, res) {
    User.findByReminder(req.body.name, req.body.email, function (user) {
      if (user) {
        user.updateReset();
        // Email User
      }
      res.locals.notice = 'Your password reset email has been sent.';
      res.render('reminder');
    });
  },

  // post '/reset'
  postReset: function (req, res) {
    User.findById(req.session.userId, function (currentUser) {
      currentUser.updateSettings('', '', req.body.password, function (user) {
        req.session.notice = 'Password successfully updated.';
        res.redirect('/account');
      });
    });
  },
}
