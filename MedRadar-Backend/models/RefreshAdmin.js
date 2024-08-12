const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshAdminSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RefreshAdmin", refreshAdminSchema);
