var api = require('./controller');

module.exports = UserRoutes = (function (app) {
  /* Helpers */
  app.all('*', api.helpers.checkNotice);
  app.all('*', api.helpers.setCSRF);
  app.all('*', api.helpers.setCurrentUser);

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
