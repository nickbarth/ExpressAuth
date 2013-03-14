var mongoose = require('mongoose'),
    app = require('./server');

mongoose.connect('mongodb://localhost/tddauth', {db: { safe: true }});

app.listen(3000);
