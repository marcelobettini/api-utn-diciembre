const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.mail_user,
    pass: process.env.mail_pass,
  },
});
module.exports = transporter;
