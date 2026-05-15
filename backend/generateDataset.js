const fs = require("fs");
const path = require("path");

const names = [
  "Anitha", "Lakshmi", "Meena", "Rani", "Sravani", "Divya", "Kavya",
  "Pooja", "Harika", "Nandini", "Priya", "Swathi", "Bhavya", "Mounika",
  "Deepika", "Sandhya", "Keerthi", "Lavanya", "Manasa", "Tejaswini"
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomBoolean = (probability = 0.5) => {
  return Math.random() < probability;
};

const rows = [];

rows.push(
  "patientName,age,weight,height,gravida,parity,previousLSCS,previousCSCount,gestationalAge,numberOfFetuses,fetalLie,presentation,labourType,deliveryTiming,diabetes,hypertension"
);

for (let i = 1; i <= 500; i++) {
  const patientName = `${randomItem(names)}_${i}`;

  const age = randomNumber(19, 42);
  const weight = randomNumber(45, 95);
  const height = randomNumber(145, 172);

  const parity = randomNumber(0, 3);
  const gravida = parity + randomNumber(1, 2);

  const previousLSCS = parity > 0 ? randomBoolean(0.25) : false;
  const previousCSCount = previousLSCS ? randomNumber(1, 2) : 0;

  const gestationalAge = randomNumber(34, 41);

  const numberOfFetuses = randomBoolean(0.08) ? "Multiple" : "Single";

  let fetalLie = "Longitudinal";
  let presentation = "Cephalic";

  const abnormalLieChance = Math.random();

  if (abnormalLieChance < 0.08) {
    fetalLie = "Transverse";
    presentation = "Transverse";
  } else if (abnormalLieChance < 0.15) {
    fetalLie = "Oblique";
    presentation = "Oblique";
  } else if (abnormalLieChance < 0.25) {
    fetalLie = "Longitudinal";
    presentation = "Breech";
  }

  let labourType = randomItem(["Spontaneous", "Induced", "No Labour"]);

  let deliveryTiming =
    labourType === "No Labour" ? "Pre Labour CS" : "In Labour";

  const diabetes = randomBoolean(0.18);
  const hypertension = randomBoolean(0.16);

  rows.push(
    [
      patientName,
      age,
      weight,
      height,
      gravida,
      parity,
      previousLSCS,
      previousCSCount,
      gestationalAge,
      numberOfFetuses,
      fetalLie,
      presentation,
      labourType,
      deliveryTiming,
      diabetes,
      hypertension,
    ].join(",")
  );
}

const outputPath = path.join(__dirname, "../dataset/robson_patients.csv");

fs.writeFileSync(outputPath, rows.join("\n"));

console.log("500 patient dataset generated successfully");
console.log("Saved at:", outputPath);