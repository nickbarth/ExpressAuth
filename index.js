process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var newrelic = require('newrelic'),
    mongoose = require('mongoose'),
    app = require('./server'),
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/expressAuth',
    port = process.env.PORT || 5000;

mongoose.connect(mongoUri, {db: { safe: true }});

app.listen(port, function () {
  console.log('Server listening on port ' + port);
});
