const Intervention = require("../models/Intervention");

const createIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.create(req.body);

    res.status(201).json(intervention);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInterventions = async (req, res) => {
  try {
    const interventions = await Intervention.find().sort({ createdAt: -1 });

    res.status(200).json(interventions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createIntervention,
  getInterventions,
};