const mongoose = require("mongoose");

const interventionSchema = new mongoose.Schema(
  {
    interventionName: {
      type: String,
      required: true,
    },

    targetRobsonGroup: {
      type: Number,
      required: true,
    },

    beforeCSRate: {
      type: Number,
      required: true,
    },

    afterCSRate: {
      type: Number,
      required: true,
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Intervention", interventionSchema);