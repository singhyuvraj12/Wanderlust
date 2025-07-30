const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudConfig.js");
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  image: {
    filename: {
      type: String,
      default: "listing_image",
    },
    url: {
      type: String,
      default: "/img.jpg",
      set: (v) => (v === "" ? "/sampleImg.jpg" : v),
    },
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await cloudinary.uploader.destroy(listing.image.filename);
    if (listing.reviews.length) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
