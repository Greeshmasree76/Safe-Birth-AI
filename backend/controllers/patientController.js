const Patient = require("../models/Patient");
const predictRisk = require("../utils/predictRisk");
const classifyRobsonGroup = require("../utils/robsonClassifier");

const createPatient = async (req, res) => {
  try {
    const robsonResult = classifyRobsonGroup(req.body);

    const prediction = predictRisk(req.body, robsonResult.group);

    const patient = await Patient.create({
      ...req.body,
      robsonGroup: robsonResult.group,
      robsonDescription: robsonResult.description,
      riskScore: prediction.riskScore,
      outcome: prediction.outcome,
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

module.exports = {
  createPatient,
  getPatients,
};