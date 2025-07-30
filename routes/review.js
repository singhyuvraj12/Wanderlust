const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedInReview,
  isReviewOwner,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//CREATE ROUTE
router.post(
  "/",
  isLoggedInReview,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//DELETE ROUTE
router.delete(
  "/:reviewId",
  isLoggedInReview,
  isReviewOwner,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
