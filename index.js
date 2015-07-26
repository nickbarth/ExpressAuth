// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');

// Enviroment Vars
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/expressAuth-test';
const PORT = process.env.PORT || 5000;
const SECRET = process.env.SECRET || 'APPSECRET';

const app = express();

// Configuration
mongoose.connect(MONGO_URL, {db: { safe: true }});
app.set('view engine', 'jade');

/* Middleware */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));

if (app.get('env') === 'production') {
  // app.use(csrf());
}

/* Routes */
app.use('/', require('./routes/users'));

if (app.get('env') !== 'test') {
  app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
  });
}

module.exports = app
