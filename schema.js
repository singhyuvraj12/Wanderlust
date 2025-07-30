const Joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      filename: Joi.string(),
      url: Joi.string().allow("", null),
    }),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
