var express = require('express');
var app = express();

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.listen(3000);

describe('Array', function () {
  describe('BLAH()', function () {
    it('should blah it', function () {
      (3).should.equal(2);
    });
  });
});
