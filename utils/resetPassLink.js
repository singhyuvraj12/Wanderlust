const nodemailer = require("nodemailer");

module.exports.auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "wanderlust.passwrd.recovery@gmail.com",
    pass: "tzbyyhslqgvhlkex",
  },
});

module.exports.receiver = {
  from: "wanderlust.passwrd.recovery@gmail.com",
  to: "",
  subject: "Password reset link",
};

// auth.sendMail(receiver, (error, emailResponse) => {
//   if (error) throw error;
//   console.log("success!");
//   response.end();
// });
