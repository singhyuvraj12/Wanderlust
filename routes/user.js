const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirect, isPasswrdTimeout ,isRegistered } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(savedRedirect, wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    savedRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

router.route("/logout").get(userController.logout);

router
  .route("/password_reset")
  .get(userController.renderResetPassForm)
  .post(isRegistered, userController.sendResetLink);

router
  .route("/password_reset/:email/:time")
  .get(isPasswrdTimeout, userController.renderNewPassForm)
  .patch(isPasswrdTimeout, userController.updatePassword);

module.exports = router;
