var api = require('./controller');

module.exports = UserRoutes = (function (app) {
  /* Helpers */
  app.use(api.helpers.currentUser);

  /* Routes */
  app.get('/', api.home);
  app.get('/join', api.getJoin);
  app.get('/login', api.getLogin);
  app.get('/logout', api.getLogout);
  app.get('/members', api.getMembers);
  app.get('/members/account', api.getMembersAccount);
  app.get('/reminder', api.getReminder);
  app.get('/reset/:email/:resetToken', api.getReset);
  app.post('/join', api.postJoin);
  app.post('/login', api.postLogin);
  app.post('/members/account', api.postMembersAccount);
  app.post('/reminder', api.postReminder);
  app.post('/reset', api.postReset);
});
