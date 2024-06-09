var mongoose = require("mongoose");

var { Schema } = mongoose;
var ReviewSchema = require("../models/reviews");

const hotelsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  tittle: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  landmark: {
    type: String,
    required: true,
  },
  rooms: {
    type: [String],
  },

  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
  },
  reviews: [ReviewSchema],
});

const HotelModel = mongoose.model("hotel", hotelsSchema);

module.exports = HotelModel;
