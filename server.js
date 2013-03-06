var express = require('express'),
  mongoose = require('mongoose'),
  app = express();

mongoose.connect('mongodb://localhost/nodeauth');

app.configure(function(){
  app.use(app.router);
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'SECRET' }));
  app.use(passport.initialize());
  app.use(passport.session());
});

app.listen(3000);
