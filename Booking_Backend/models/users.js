const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    BookedHotels: {
      type: [String],
    },
    BookingDetails: {
      type: [Object],
    },
    userFavHotels: {
      type: [String],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
