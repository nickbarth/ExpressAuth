var express = require('express'),
    app = express();

app.configure(function () {
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'SECRET' }));
  if (app.get('env') !== 'test') {
    app.use(express.csrf());
  }
});

app.use(require(__dirname + '/app/users'));
app.use(app.router);

module.exports = app;
