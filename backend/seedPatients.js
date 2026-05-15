const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Patient = require("./models/Patient");
const classifyRobsonGroup = require("./utils/robsonClassifier");
const predictRisk = require("./utils/predictRisk");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const convertBoolean = (value) => {
  return value === true || value === "true" || value === "TRUE" || value === "1";
};

const seedPatients = async () => {
  await connectDB();

  const patients = [];

  const csvPath = path.join(__dirname, "../dataset/robson_patients.csv");

  if (!fs.existsSync(csvPath)) {
    console.log("CSV file not found at:", csvPath);
    process.exit(1);
  }

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      const patientData = {
        patientName: row.patientName,
        age: Number(row.age),
        weight: Number(row.weight),
        height: Number(row.height),
        gravida: Number(row.gravida),
        parity: Number(row.parity),
        previousLSCS: convertBoolean(row.previousLSCS),
        previousCSCount: Number(row.previousCSCount || 0),
        gestationalAge: Number(row.gestationalAge),
        numberOfFetuses: row.numberOfFetuses,
        fetalLie: row.fetalLie,
        presentation: row.presentation,
        labourType: row.labourType,
        deliveryTiming: row.deliveryTiming,
        diabetes: convertBoolean(row.diabetes),
        hypertension: convertBoolean(row.hypertension),
      };

      const robsonResult = classifyRobsonGroup(patientData);
      const prediction = predictRisk(patientData, robsonResult.group);

      patients.push({
        ...patientData,
        robsonGroup: robsonResult.group,
        robsonDescription: robsonResult.description,
        riskScore: prediction.riskScore,
        outcome: prediction.outcome,
      });
    })
    .on("end", async () => {
      try {
        if (patients.length === 0) {
          console.log("No patient rows found in CSV.");
          process.exit(1);
        }

        await Patient.insertMany(patients);

        console.log(`${patients.length} patients inserted successfully`);
        process.exit();
      } catch (error) {
        console.log("Insert failed:", error.message);
        process.exit(1);
      }
    });
};

seedPatients();