module.exports = UserAPI = {
  helpers: {
    // Get the current user from session.
    //
    // Returns the current user or false if no session.
    currentUser: (function (req, res) {
      if (req.session.userId !== undefined) {
        return User.findById(req.session.userId);
      } else {
        return false;
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
    
    res.render('reset', {});
  },
  // post '/join'
  postJoin: function (req, res) {
    
    res.render('join', {});
  },
  // post '/login'
  postLogin: function (req, res) {
    
    res.render('login', {});
  },
  // post '/members/account'
  postMembersAccount: function (req, res) {
    
    res.render('members/account', {});
  },
  // post '/reminder'
  postReminder: function (req, res) {
    
    res.render('reminder', {});
  },
  // post '/reset'
  postReset: function (req, res) {
    
    res.render('reset', {});
  },
}
