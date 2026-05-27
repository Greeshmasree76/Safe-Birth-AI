const express = require("express");

const {
  createPatient,
  getPatients,
  updatePatient,
} = require("../controllers/patientController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("Admin", "Doctor", "Nurse/Staff"),
  createPatient
);

router.get(
  "/",
  protect,
  authorize("Admin", "Doctor", "Nurse/Staff", "Data Analyst"),
  getPatients
);

router.patch(
  "/:id",
  protect,
  authorize("Admin", "Doctor", "Data Analyst"),
  updatePatient
);

module.exports = router;