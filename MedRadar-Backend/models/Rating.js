const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ratingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Rating", ratingSchema);
