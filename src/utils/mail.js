const nodemailer = require('nodemailer');
const jsonConfig = require('../../config/config.json');

const {environment, config} = require('./');

let transporter;

/* istanbul ignore next */
function initMail () {
  const smtpConfig = {
    host: config.mail.smtp,
    port: config.mail.port,
    pool: true,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: config.mail.user,
      pass: config.mail.password
    }
  };

  transporter = nodemailer.createTransport(smtpConfig);
}

function sendMail (to, subject, html) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    // sender address
    from: `admin <${config.mail.user}>`,
    // list of receivers
    to,
    // Subject line
    subject,
    // plaintext body
    // text: 'It works! ✔',
    // rich text html body
    html
  };

  // console.log(mailOptions);

  if (environment === 'test') {
    return new Promise((resolve) => {
      if (to === 'error') throw new Error('test return error');
      const success = to === 'test@test.com' || to === 'test2@test.com';
      setTimeout(resolve.bind(null, {success}), 10);
    });
  }

  /* istanbul ignore next */
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      console.log(info);
      if (error){
        reject({success: false, error});
      } else {
        resolve({success: true});
      }
    });
  });
}

module.exports = {
  initMail,
  sendMail
};
