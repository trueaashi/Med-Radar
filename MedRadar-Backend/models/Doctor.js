const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
    specialty: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      require: true,
    },
    endTime: {
      type: String,
      require: true,
    },
    yearsOfExperience: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
