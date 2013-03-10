var express = require('express'),
  mongoose = require('mongoose'),
  app = express();


app.configure(function(){
  app.set('views', __dirname + '/app/users/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'SECRET' }));
  app.use(app.router);
});

require('./app/users/routes')(app);
app.listen(3000);
