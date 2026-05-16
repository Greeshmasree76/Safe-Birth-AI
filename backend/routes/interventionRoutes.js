const express = require("express");

const {
  createIntervention,
  getInterventions,
} = require("../controllers/interventionController");

const router = express.Router();

router.post("/", createIntervention);
router.get("/", getInterventions);

module.exports = router;