let mongoose = require("mongoose");

let { Schema } = mongoose;

let RoomSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: { type: String, require: true },
    price: {
      type: Number,
      require: true,
    },
    maxPeople: {
      type: Number,
      require: true,
    },
    roomNumbers: [{ number: Number, unavailableDates: Array }],
  },

  { timestamps: true }
);

const RoomsModel = mongoose.model("room", RoomSchema);

module.exports = RoomsModel;
