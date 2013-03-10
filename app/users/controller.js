var User = require('../../models/users');

module.exports = UserAPI = {
  helpers: {
    // Get the current user from session.
    //
    // Returns the current user or false if no session.
    currentUser: (function (req, res, next) {
      if (req.session.userId !== undefined) {
        res.locals.currentUser = User.findById(req.session.userId);
      }
      next();
    }),

    // ASDFDSAF
    //
    // ASDfadsfdf
    flashMessage: (function (req, res, next) {
      if (req.session.message !== undefined) {
        res.locals.message = req.session.message;
        req.session.message = undefined;
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
    req.flash('info', 'Successfully logged out');
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
        req.session.userId = user.id;
        req.session.message = 'Thank you for becoming a member.';
        res.redirect('/members');
      } else {
        res.send('Invalid email or password.');
        // res.redirect('/join');
      }
    });
  },

  // post '/login'
  postLogin: function (req, res) {
    User.authenticate(req.body.email, req.body.password, function (user) {
      if (user) {
        req.session.userId = user.id;
        req.session.message = 'Successfully logged in.';
        res.redirect('/members');
      } else {
        req.send('Invalid email or password.');
        // res.redirect('/login');
      }
    });
  },

  // post '/members/account'
  postMembersAccount: function (req, res) {
    currentUser.updateSettings(req.body.name, req.body.email, req.body.password, function () {
      req.flash('info', 'Your settings have been updated.');
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
      req.flash('info', 'Your password reset email has been sent.');
      res.redirect('/reminder');
    });
  },

  // post '/reset'
  postReset: function (req, res) {
    User.updateSettings('', '', req.body.password, function (user) {
      if (user) {
        req.flash('info', 'Password successfully updated.');
        res.redirect('/members');
      }
    });
  },
}
