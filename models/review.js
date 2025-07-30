const mongoose = require("mongoose");

let reviewSchema = mongoose.Schema({
  createdBy:{
    type:mongoose.ObjectId,
    ref:"User",
  },
  comment: {
    type:String,
    required:true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Review", reviewSchema);
