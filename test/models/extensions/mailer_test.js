var Mailer = require('../../../models/extensions/mailer'), TestTransport;

TestTransport =  function () {
  this.from = '';
  this.to = '';
  this.subject = '';
  this.html = '';
  this.generateTextFromHTML = '';

  this.sendMail = (function (emailHash) {
    this.from = emailHash.from;
    this.to = emailHash.to;
    this.subject = emailHash.subject;
    this.html = emailHash.html;
    this.generateTextFromHTML = emailHash.generateTextFromHTML;
  });
};

describe('Mailer', function () {
  var currentUser = { name: 'Jane Doe', email: 'jane.doe@example.com', resetToken: 'RESET_TOKEN' };

  describe('instance method', function () {
    describe('sendWelcomeMessage', function () {
      it('emails the user a welcome message', function (done){
        var transport = new TestTransport();
        (new Mailer(currentUser, transport)).sendWelcomeMessage();
        transport.from.should.equal('John Doe <john.doe@example.com>');
        transport.to.should.equal('Jane Doe <jane.doe@example.com>');
        transport.subject.should.equal('Welcome to ExpressAuth Jane Doe');
        transport.html.should.equal('Thank you for signing up with us.');
        transport.generateTextFromHTML.should.equal(true);
        done();
      });
    }); // end sendWelcomeMessage

    describe('sendPasswordReset', function () {
      it('emails the user a password reset', function (done){
        var transport = new TestTransport();
        (new Mailer(currentUser, transport)).sendPasswordReset();
        transport.from.should.equal('John Doe <john.doe@example.com>');
        transport.to.should.equal('Jane Doe <jane.doe@example.com>');
        transport.subject.should.equal('Password Reset for Jane Doe');
        transport.html.should.equal('To update you password please visit http://example.com/jane.doe%40example.com/RESET_TOKEN');
        transport.generateTextFromHTML.should.equal(true);
        done();
      });
    }); // end sendPasswordReset
  }); // end instance methods
}); // end Mailer
