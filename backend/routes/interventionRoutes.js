const express = require("express");

const {
  createIntervention,
  getInterventions,
} = require("../controllers/interventionController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("Admin", "Doctor", "Data Analyst"),
  createIntervention
);

router.get(
  "/",
  protect,
  authorize("Admin", "Doctor", "Data Analyst"),
  getInterventions
);

module.exports = router;