var express = require('express'),
    api = require('./controller'),
    app = module.exports = express();

app.configure(function () {
  /* Config */
  app.set('views', __dirname + '/views');

  /* Helpers */
  app.use(api.helpers.checkNotice);
  app.use(api.helpers.setCSRF);
  app.use(api.helpers.setCurrentUser);

  /* Routes */
  app.get('/', api.home);
  app.get('/signup', api.getSignUp);
  app.get('/login', api.getLogin);
  app.get('/logout', api.getLogout);
  app.get('/members', api.helpers.checkAuth, api.getMembers);
  app.get('/members/account', api.helpers.checkAuth, api.getMembersAccount);
  app.get('/reminder', api.getReminder);
  app.get('/reset/:email/:resetToken', api.getReset);
  app.post('/signup', api.postSignUp);
  app.post('/login', api.postLogin);
  app.post('/members/account', api.helpers.checkAuth, api.postMembersAccount);
  app.post('/reminder', api.postReminder);
  app.post('/reset', api.helpers.checkAuth, api.postReset);
});
