const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.isLoggedInReview = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.headers.referer;

    //for saving info and display after login
    if (req.body.review) {
      req.session.userReview = req.body.review.comment;
      req.session.userRating = req.body.review.rating;
    }
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((err) => err.message).join("\n");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errmsg = error.details.map((err) => err.message).join("/n");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.savedRedirect = (req, res, next) => {
  res.locals.savedRedirect = req.session.redirectUrl;
  res.locals.userReview = req.session.userReview;
  res.locals.userRating = req.session.userRating;
  next();
};

module.exports.isListingOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.user._id)) {
    req.flash("error", "You are not the owner of listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.createdBy.equals(res.locals.user._id)) {
    req.flash("error", "You don't have permission to delete others reviews");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isPasswrdTimeout = (req, res, next) => {
  let { time } = req.params;
  // if (!req.session.linkSent) {
  //   return next(new ExpressError(400, "Password reset link not found"));
  // }
  let linkActivate = Date.now();
  if (linkActivate - time > 15 * 60 * 1000) {
    throw new ExpressError(400, "Password reset Link has been expired");
  }
  next();
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports.isRegistered = async (req, res, next) => {
  let { username: data } = req.body;
  let user;
  if (!validateEmail(data)) {
    user = await User.findOne({ username: data });
  } else {
    user = await User.findOne({ email: data });
  }
  if (!user) {
    req.flash(
      "error",
      "You are not a registered user . First Sign up on platform"
    );
    return res.redirect("/password_reset");
  }
  req.user=user
  next();
};
