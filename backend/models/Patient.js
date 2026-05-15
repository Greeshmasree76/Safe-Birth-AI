const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    gravida: {
      type: Number,
      required: true,
    },

    parity: {
      type: Number,
      required: true,
    },

    previousLSCS: {
      type: Boolean,
      default: false,
    },

    previousCSCount: {
      type: Number,
      default: 0,
    },

    gestationalAge: {
      type: Number,
      required: true,
    },

    numberOfFetuses: {
      type: String,
      enum: ["Single", "Multiple"],
      required: true,
    },

    fetalLie: {
      type: String,
      enum: ["Longitudinal", "Transverse", "Oblique"],
      required: true,
    },

    presentation: {
      type: String,
      enum: ["Cephalic", "Breech", "Transverse", "Oblique"],
      required: true,
    },

    labourType: {
      type: String,
      enum: ["Spontaneous", "Induced", "No Labour"],
      required: true,
    },

    deliveryTiming: {
      type: String,
      enum: ["In Labour", "Pre Labour CS"],
      required: true,
    },

    diabetes: {
      type: Boolean,
      default: false,
    },

    hypertension: {
      type: Boolean,
      default: false,
    },

    robsonGroup: {
      type: Number,
    },

    robsonDescription: {
      type: String,
    },

    riskScore: {
      type: Number,
    },

    outcome: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);