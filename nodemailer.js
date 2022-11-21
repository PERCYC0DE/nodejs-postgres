'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'ppj.code@gmail.com',
      pass: 'frujkzwpudldfchu',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'ppj.code@gmail.com', // sender address
    to: 'ppj.tejadadonayre@gmail.com', // list of receivers
    subject: 'Mensaje de Prueba', // Subject line
    text: 'Este es un mensaje de prueba desde un servidor ftp', // plain text body
    html: '<b>Mensaje de Prueba</b>', // html body
  });

  // eslint-disable-next-line no-console
  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // eslint-disable-next-line no-console
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// eslint-disable-next-line no-console
sendMail().catch(console.error);
