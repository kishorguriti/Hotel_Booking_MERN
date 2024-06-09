var mongoose = require("mongoose");
var { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    title: { type: String },
    rating: { type: Number },
    review: { type: String },
    images: [String],
    staff: { type: Number },
    service: { type: Number },
    reviewedBy: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = ReviewSchema;
