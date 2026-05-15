const predictRisk = (patient, robsonGroup) => {
  let score = 0;

  const age = Number(patient.age);
  const gestationalAge = Number(patient.gestationalAge);
  const previousCSCount = Number(patient.previousCSCount || 0);

  if (robsonGroup === 5) score += 5;
  if (robsonGroup === 6 || robsonGroup === 7) score += 4;
  if (robsonGroup === 8) score += 3;
  if (robsonGroup === 9) score += 5;
  if (robsonGroup === 10) score += 2;
  if (robsonGroup === 2 || robsonGroup === 4) score += 2;

  if (age >= 35) score += 2;
  if (gestationalAge > 40) score += 2;
  if (previousCSCount >= 2) score += 2;
  if (patient.diabetes === true) score += 2;
  if (patient.hypertension === true) score += 2;

  if (score >= 7) {
    return {
      outcome: "High C-Section Risk",
      riskScore: score,
    };
  }

  if (score >= 4) {
    return {
      outcome: "Moderate C-Section Risk",
      riskScore: score,
    };
  }

  return {
    outcome: "Normal Delivery Likely",
    riskScore: score,
  };
};

module.exports = predictRisk;