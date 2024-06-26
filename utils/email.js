const { text } = require('express');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_host,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Define the email options
  const mailOption = {
    from: 'Devvrat Sharma <devvrat@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) Actually send the email with nodemailer
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
