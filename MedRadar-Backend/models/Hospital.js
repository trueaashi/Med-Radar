const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    address: {
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      website: {
        type: String,
      },
    },

    specialties: {
      type: Array,
      items: {
        type: String,
      },
    },

    profilePic: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },

    facilities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Facility",
      },
    ],

    treatments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Treatment",
      },
    ],

    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],

    feedbacks: {
      type: Array,
      items: {
        type: Schema.Types.ObjectId,
        ref: "Fedback",
      },
    },

    // ratings: {
    //   averageRating: {
    //     type: Number,
    //     min: 0,
    //     max: 5,
    //     default: 0,
    //   },
    //   totalRatings: {
    //     type: Number,
    //     default: 0,
    //   },
    //   allRatings: {
    //     type: Array,
    //     items: {
    //       type: Schema.Types.ObjectId,
    //       ref: "Rating",
    //     },
    //   },
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
