var User = require('../../models/users');

module.exports = UserAPI = {
  helpers: {
    // Check user is authenticated
    //
    // Returns an error if not signed in, otherwise it sets the currentUser.
    checkAuth: (function (req, res, next) {
      if (!req.session.userId) {
        res.send('Please login to access this page.');
      } else {
        res.locals.currentUser = User.findById(req.session.userId);
        next();
      }
    })
  },

  // get '/'
  home: function (req, res) {
    res.render('index');
  },

  // get '/join'
  getJoin: function (req, res) {
    res.render('join');
  },

  // get '/login'
  getLogin: function (req, res) {
    res.render('login');
  },

  // get '/logout'
  getLogout: function (req, res) {
    req.session.destroy();
    res.locals.flash = 'Successfully logged out.';
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
    if (req.currentUser === undefined) {
      req.send('Invalid email or reset token.');
    } else {
      res.render('reset');
    }
  },

  // post '/join'
  postJoin: function (req, res) {
    User.register(req.body.name, req.body.email, req.body.password, function (user) {
      if (user) {
        res.locals.flash = 'Thank you for becoming a member.';
        req.session.userId = user.id;
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
        req.session.userId = user.id;
        req.locals.flash = 'Successfully logged in.';
        res.redirect('/members');
      } else {
        res.send('Invalid email or password.');
      }
    });
  },

  // post '/members/account'
  postMembersAccount: function (req, res) {
    currentUser.updateSettings(req.body.name, req.body.email, req.body.password, function () {
      res.locals.flash = 'Your settings have been updated.';
      res.redirect('/members');
    });
  },

  // post '/reminder'
  postReminder: function (req, res) {
    User.findByEmail(req.body.name, req.body.email, function (user) {
      if (user) {
        user.updateReset();
        // Email User
      }
      res.locals.flash = 'Your password reset email has been sent.';
      res.redirect('/reminder');
    });
  },

  // post '/reset'
  postReset: function (req, res) {
    User.updateSettings('', '', req.body.password, function (user) {
      if (user) {
        res.locals.flash = 'Password successfully updated.';
        res.redirect('/members');
      }
    });
  },
}
