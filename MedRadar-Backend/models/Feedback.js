const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const feedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    hospital:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Hospital",
    },
    feedback: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Feedback", feedbackSchema);
