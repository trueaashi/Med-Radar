const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facilitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Facility", facilitySchema);
