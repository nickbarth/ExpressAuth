var nodemailer = require('nodemailer');

module.exports = Mailer;

// Mailer is used for user based transactional emails.
//
// user - The user a particular email notification will be addressed too.
// transport - The email transport used to send a message.
//
// Returns a new instance of the Mailer class.
function Mailer (user, transport) {
  if (!(this instanceof Mailer)) {
    return new Mailer(user, transport);
  }

  this.user = user;
  this.transport = transport || {
    // A mock of the nodemailer.transport function for sending email.
    //
    // emailHash - A hash containing the properties nessesary to send an email.
    //
    // Returns nothing.
    //
    // Notes: 
    //
    // For production sites use the nodemailer.createTransport function.
    //
    //   this.transport = transport || nodemailer.createTransport('SMTP', {
    //     host: 'smtp.example.com',
    //     secureConnection: true,
    //     port: 465,
    //     auth: { user: 'username', password: 'password' }
    //   });
    //
    sendMail: function (emailHash) {
      emailHash.from,
      emailHash.to,
      emailHash.subject,
      emailHash.html
    }
  };
}

// Sends a welcome messaged to newly signed up users.
//
// callback - for node mailer the return callback gets two parameters:
//            error - an error object if the message failed
//            responseStatus - an object with some information about the status on success
//                             (https://github.com/andris9/Nodemailer#return-callback)
//
Mailer.prototype.sendWelcomeMessage = function (callback) {
  this.transport.sendMail({
    from: 'John Doe <john.doe@example.com>',
    to: this.user.name+' <'+this.user.email+'>',
    subject: 'Welcome to ExpressAuth '+this.user.name,
    html: 'Thank you for signing up with us.',
    generateTextFromHTML: true
  }, callback);
};

// Sends an email with a link allowing users to reset their password.
//
// callback - for node mailer the return callback gets two parameters:
//            error - an error object if the message failed
//            responseStatus - an object with some information about the status on success
//                             (https://github.com/andris9/Nodemailer#return-callback)
//
Mailer.prototype.sendPasswordReset = function (callback) {
  this.transport.sendMail({
    from: 'John Doe <john.doe@example.com>',
    to: this.user.name+' <'+this.user.email+'>',
    subject: 'Password Reset for '+this.user.name,
    html: 'To update you password please visit http://example.com/'+encodeURIComponent(this.user.email)+'/'+this.user.resetToken,
    generateTextFromHTML: true
  }, callback);
};
