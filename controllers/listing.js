const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const User = require("../models/user.js");
module.exports.index = async (req, res) => {
  const data = await Listing.find();
  res.render("./listings/index.ejs", { allListing: data });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/newForm.ejs");
};

module.exports.createListing = async (req, res) => {
  let data = req.body.listing;
  let filename = req.file.filename;
  let url = req.file.path;
  let newListing = new Listing(data);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

function formatNumber(num) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(num);
}

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "createdBy",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you have requested for does not exist!");
    return res.redirect("/listings");
  }

  let actualRating = [0, 0, 0, 0, 0];
  let averageRating = 0;
  let reviews = listing.reviews;
  actualRating.push(reviews.length);

  for (let i = 0; i < reviews.length; i++) {
    let rating = reviews[i].rating;
    averageRating += rating;
    actualRating[--rating]++;
  }
  averageRating = Math.round((averageRating / reviews.length) * 10) / 10;
  let ratioRating = [];
  for (let i = 0; i < 5; i++) {
    ratioRating.push((actualRating[i] / actualRating[5]) * 100 || 0);
    actualRating[i] = formatNumber(actualRating[i]);
  }
  actualRating = actualRating.map((ele) => formatNumber(ele));
  res.render("./listings/show.ejs", {
    data: listing,
    ratioRating,
    averageRating,
    actualRating,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you have requested for, does not exist!");
    res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_150");
  res.render("./listings/edit.ejs", { data: listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
  const data = req.body.listing;
  const { id } = req.params;
  let newListing = await Listing.findByIdAndUpdate(id, data, {
    runValidators: true,
  });
  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    newListing.image = { filename, url };
    await newListing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
