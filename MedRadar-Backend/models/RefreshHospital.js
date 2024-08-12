const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshHospitalSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RefreshHospital", refreshHospitalSchema);
