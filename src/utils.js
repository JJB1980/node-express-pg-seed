const nodemailer = require('nodemailer');
const jsonConfig = require('../config/config.json');

let transporter;

function initMail () {
  const config = configuration();
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

  console.log(mailOptions);

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

function getIP (request) {
  return request.ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
}

const environment = process.env.NODE_ENV || 'development';

function configuration () {
  return jsonConfig[environment === 'test' ? 'development' : environment];
}

module.exports = {
  initMail,
  sendMail,
  getIP,
  config: configuration(),
  environment
};
