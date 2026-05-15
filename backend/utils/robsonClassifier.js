const classifyRobsonGroup = (patient) => {
  const parity = Number(patient.parity);
  const gestationalAge = Number(patient.gestationalAge);
  const previousLSCS = patient.previousLSCS;
  const numberOfFetuses = patient.numberOfFetuses;
  const presentation = patient.presentation;
  const fetalLie = patient.fetalLie;
  const labourType = patient.labourType;
  const deliveryTiming = patient.deliveryTiming;

  if (numberOfFetuses === "Multiple") {
    return {
      group: 8,
      description: "Multiple pregnancy",
    };
  }

  if (
    fetalLie === "Transverse" ||
    fetalLie === "Oblique" ||
    presentation === "Transverse" ||
    presentation === "Oblique"
  ) {
    return {
      group: 9,
      description: "Single pregnancy with transverse or oblique lie",
    };
  }

  if (presentation === "Breech" && parity === 0) {
    return {
      group: 6,
      description: "Nulliparous woman with single breech pregnancy",
    };
  }

  if (presentation === "Breech" && parity >= 1) {
    return {
      group: 7,
      description: "Multiparous woman with single breech pregnancy",
    };
  }

  if (
    previousLSCS === true &&
    numberOfFetuses === "Single" &&
    presentation === "Cephalic" &&
    gestationalAge >= 37
  ) {
    return {
      group: 5,
      description:
        "Previous cesarean section, single cephalic pregnancy, term",
    };
  }

  if (
    numberOfFetuses === "Single" &&
    presentation === "Cephalic" &&
    gestationalAge < 37
  ) {
    return {
      group: 10,
      description: "Single cephalic pregnancy, preterm",
    };
  }

  if (
    parity === 0 &&
    numberOfFetuses === "Single" &&
    presentation === "Cephalic" &&
    gestationalAge >= 37 &&
    labourType === "Spontaneous"
  ) {
    return {
      group: 1,
      description:
        "Nulliparous, single cephalic pregnancy, term, spontaneous labour",
    };
  }

  if (
    parity === 0 &&
    numberOfFetuses === "Single" &&
    presentation === "Cephalic" &&
    gestationalAge >= 37 &&
    (labourType === "Induced" || deliveryTiming === "Pre Labour CS")
  ) {
    return {
      group: 2,
      description:
        "Nulliparous, single cephalic pregnancy, term, induced labour or pre-labour CS",
    };
  }

  if (
    parity >= 1 &&
    previousLSCS === false &&
    numberOfFetuses === "Single" &&
    presentation === "Cephalic" &&
    gestationalAge >= 37 &&
    labourType === "Spontaneous"
  ) {
    return {
      group: 3,
      description:
        "Multiparous without previous CS, single cephalic pregnancy, term, spontaneous labour",
    };
  }

  if (
    parity >= 1 &&
    previousLSCS === false &&
    numberOfFetuses === "Single" &&
    presentation === "Cephalic" &&
    gestationalAge >= 37 &&
    (labourType === "Induced" || deliveryTiming === "Pre Labour CS")
  ) {
    return {
      group: 4,
      description:
        "Multiparous without previous CS, single cephalic pregnancy, term, induced labour or pre-labour CS",
    };
  }

  return {
    group: 10,
    description: "Unclassified case assigned to Group 10 fallback",
  };
};

module.exports = classifyRobsonGroup;