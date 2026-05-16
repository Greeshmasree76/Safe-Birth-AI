const axios = require("axios");

const Patient = require("../models/Patient");
const predictRisk = require("../utils/predictRisk");
const classifyRobsonGroup = require("../utils/robsonClassifier");

const createPatient = async (req, res) => {
  try {
    let predictionData;

    try {
      const mlResponse = await axios.post(
        process.env.ML_API_URL || "http://localhost:5001/predict",
        req.body,
        {
          timeout: 5000,
        }
      );

      predictionData = {
        robsonGroup: mlResponse.data.robsonGroup,
        robsonDescription: mlResponse.data.robsonDescription,
        riskScore: mlResponse.data.riskScore,
        outcome: mlResponse.data.outcome,
        mlConfidence: mlResponse.data.mlConfidence,
        predictionSource: mlResponse.data.predictionSource,
      };
    } catch (mlError) {
      console.log("ML service unavailable. Using rule-based fallback.");

      const robsonResult = classifyRobsonGroup(req.body);
      const prediction = predictRisk(req.body, robsonResult.group);

      predictionData = {
        robsonGroup: robsonResult.group,
        robsonDescription: robsonResult.description,
        riskScore: prediction.riskScore,
        outcome: prediction.outcome,
        mlConfidence: null,
        predictionSource: "Rule-based fallback",
      };
    }

    const patient = await Patient.create({
      ...req.body,
      ...predictionData,
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  updatePatient,
};