const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const {
  isLoggedIn,
  validateListing,
  isListingOwner,
} = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



// INDEX ROUTE
router.get("/", wrapAsync(listingController.index));

// NEW ROUTE
router
  .route("/new")
  .get(isLoggedIn, listingController.renderNewForm)
  .post(
    isLoggedIn,       // to check login if post request from hoppscotch
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// SHOW ROUTE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(
    isLoggedIn,
    upload.single("listing[image][url]"),
    isListingOwner,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isListingOwner,
    wrapAsync(listingController.destroyListing)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isListingOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
