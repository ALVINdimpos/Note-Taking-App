const nodemailer = require('nodemailer');

require('dotenv').config();
// Function to send a password reset email
const sendPasswordResetEmail = (userEmail, resetToken) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email message
  const mailOptions = {
    from: 'fistonalvin@example.com',
    to: userEmail, // Recipient's email address
    subject: 'Password Reset Request',
    html: `
      <p>You have requested a password reset.</p>
      <p>Click the following link to reset your password:</p>
      <a href="http://localhost:8080/api/users/reset-password/token=${resetToken}">Reset Password</a>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error sending email: ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = sendPasswordResetEmail;
