const User = require("../models/user");
const { auth, receiver } = require("../utils/resetPassLink");
const ExpressError = require("../utils/ExpressError");
const ejs = require("ejs");
const path = require("path");

module.exports.renderSignupForm = (req, res) => {
  res.render("./user/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let user = req.body;
    let email = user.email;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error("A user with the given Email is already registered");
    }
    let registeredUser = await User.register(user, `${user.password}`);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Wanderlust");
      const redirectURL = res.locals.savedRedirect || "/listings";
      res.redirect(redirectURL);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./user/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to wanderlust :)");
  const redirectURL = res.locals.savedRedirect || "/listings";
  req.flash("comment", res.locals.userReview);
  req.flash("rating", res.locals.userRating);
  res.redirect(redirectURL);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "Successfully logged out");
      res.redirect("/listings");
    }
  });
};

module.exports.renderResetPassForm = (req, res) => {
  res.render("./user/requestPassword.ejs");
};



module.exports.sendResetLink = async (req, res) => {
  let user = req.user;
  const templatePath = path.join(__dirname, "emailTemplate.ejs");
  const htmlContent = await ejs.renderFile(templatePath, {
    email: user.email,
    time: Date.now(),
  });
  receiver.html = htmlContent;
  receiver.to = user.email;

  auth.sendMail(receiver, (error, emailResponse) => {
    if (error) throw Error(error);
    console.log("sent");
    req.flash(
      "success",
      `A reset password link has been sent to ${user.email}`
    );
    res.redirect("/login");
  });
};

module.exports.renderNewPassForm = (req, res) => {
  let { email, time } = req.params;
  res.render("./user/newPassword.ejs",{email,time});
};

module.exports.updatePassword = async (req, res) => {
  const { email } = req.params;
  const { newPswd, reNewPswd } = req.body;
  if (newPswd !== reNewPswd) {
    req.flash(
      "error",
      "Oops! Password confirmation doesn't match the password."
    );
    res.render("./user/newPassword.ejs");
  }
  let user = await User.findOne({ email });
  await user.setPassword(newPswd);
  await user.save();
  console.log("saved");
  req.flash("success", "Password Updated Successfully");
  res.redirect("/login");
};
