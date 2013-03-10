var request = require('supertest'),
    app = require('../../server.js');

describe('User Controller', function () {
  describe('GET /', function () {
    it('displays the home page.', function (done) {
      request(app).get('/').expect(200).end(function (err, res) {
        if (err) return done(err);
        res.text.should.equal("<h1>ExpressAuth</h1>")
        done();
      });
    });
  }); // End Get '/'
}); // End User Controller
