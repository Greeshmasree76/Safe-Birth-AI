import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { INTERVENTIONS_API, PATIENTS_API } from "../utils/api";

export default function Audit() {
  const [patients, setPatients] = useState([]);
  const [interventions, setInterventions] = useState([]);

  const [newIntervention, setNewIntervention] = useState({
    interventionName: "",
    targetRobsonGroup: "",
    beforeCSRate: "",
    afterCSRate: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const benchmarkRates = {
    1: 12,
    2: 25,
    3: 6,
    4: 15,
    5: 60,
    6: 80,
    7: 70,
    8: 55,
    9: 95,
    10: 35,
  };

  const fetchData = async () => {
    try {
      const patientRes = await axios.get(PATIENTS_API);
      setPatients(patientRes.data);

      const interventionRes = await axios.get(INTERVENTIONS_API);
      setInterventions(interventionRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePatient = async (id, updates) => {
    try {
      const res = await axios.patch(`${PATIENTS_API}/${id}`, updates);

      setPatients((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update patient outcome");
    }
  };

  const createIntervention = async (e) => {
    e.preventDefault();

    try {
      await axios.post(INTERVENTIONS_API, {
        interventionName: newIntervention.interventionName,
        targetRobsonGroup: Number(newIntervention.targetRobsonGroup),
        beforeCSRate: Number(newIntervention.beforeCSRate),
        afterCSRate: Number(newIntervention.afterCSRate),
        startDate: newIntervention.startDate,
        endDate: newIntervention.endDate,
        notes: newIntervention.notes,
      });

      setNewIntervention({
        interventionName: "",
        targetRobsonGroup: "",
        beforeCSRate: "",
        afterCSRate: "",
        startDate: "",
        endDate: "",
        notes: "",
      });

      fetchData();
    } catch (error) {
      console.log(error);
      alert("Failed to save intervention");
    }
  };

  const analytics = useMemo(() => {
    const groups = {};

    for (let i = 1; i <= 10; i++) {
      groups[i] = {
        group: i,
        total: 0,
        actualCS: 0,
        actualNormal: 0,
        pending: 0,
        maternalComplications: 0,
        neonatalComplications: 0,
        nicuAdmissions: 0,
        pph: 0,
        stillbirths: 0,
        apgarSum: 0,
        apgarCount: 0,
      };
    }

    patients.forEach((p) => {
      const group = p.robsonGroup || "Unclassified";

      if (!groups[group]) {
        groups[group] = {
          group,
          total: 0,
          actualCS: 0,
          actualNormal: 0,
          pending: 0,
          maternalComplications: 0,
          neonatalComplications: 0,
          nicuAdmissions: 0,
          pph: 0,
          stillbirths: 0,
          apgarSum: 0,
          apgarCount: 0,
        };
      }

      groups[group].total += 1;

      if (p.actualDeliveryOutcome === "C-Section") {
        groups[group].actualCS += 1;
      } else if (p.actualDeliveryOutcome === "Normal") {
        groups[group].actualNormal += 1;
      } else {
        groups[group].pending += 1;
      }

      if (p.maternalComplications) groups[group].maternalComplications += 1;
      if (p.neonatalComplications) groups[group].neonatalComplications += 1;
      if (p.nicuAdmission) groups[group].nicuAdmissions += 1;
      if (p.postpartumHemorrhage) groups[group].pph += 1;
      if (p.stillbirth) groups[group].stillbirths += 1;

      if (p.apgarScore !== null && p.apgarScore !== undefined) {
        groups[group].apgarSum += Number(p.apgarScore);
        groups[group].apgarCount += 1;
      }
    });

    const totalCS = patients.filter(
      (p) => p.actualDeliveryOutcome === "C-Section"
    ).length;

    const groupList = Object.values(groups).map((g) => {
      const csRate = g.total > 0 ? (g.actualCS / g.total) * 100 : 0;
      const contribution =
        totalCS > 0 ? (g.actualCS / totalCS) * 100 : 0;

      const avgApgar =
        g.apgarCount > 0 ? (g.apgarSum / g.apgarCount).toFixed(1) : "-";

      return {
        ...g,
        csRate,
        contribution,
        avgApgar,
        benchmark: benchmarkRates[g.group] || 0,
        benchmarkDifference: csRate - (benchmarkRates[g.group] || 0),
      };
    });

    const groupsWithCS = groupList.filter((g) => g.actualCS > 0);

    const mostContributor =
      groupsWithCS.length > 0
        ? groupsWithCS.reduce((a, b) =>
            a.contribution > b.contribution ? a : b
          )
        : null;

    const leastContributor =
      groupsWithCS.length > 0
        ? groupsWithCS.reduce((a, b) =>
            a.contribution < b.contribution ? a : b
          )
        : null;

    return {
      groupList,
      totalCS,
      mostContributor,
      leastContributor,
    };
  }, [patients]);

  const dataQuality = useMemo(() => {
    const requiredFields = [
      "age",
      "gravida",
      "parity",
      "gestationalAge",
      "numberOfFetuses",
      "fetalLie",
      "presentation",
      "labourType",
      "deliveryTiming",
      "robsonGroup",
    ];

    let missingCount = 0;
    let invalidCount = 0;

    patients.forEach((p) => {
      requiredFields.forEach((field) => {
        if (
          p[field] === undefined ||
          p[field] === null ||
          p[field] === ""
        ) {
          missingCount += 1;
        }
      });

      if (Number(p.parity) > Number(p.gravida)) {
        invalidCount += 1;
      }

      if (Number(p.gestationalAge) < 20 || Number(p.gestationalAge) > 43) {
        invalidCount += 1;
      }

      if (Number(p.age) < 12 || Number(p.age) > 55) {
        invalidCount += 1;
      }
    });

    const duplicateKeys = {};
    let duplicateCount = 0;

    patients.forEach((p) => {
      const key = `${p.patientName}-${p.age}-${p.gestationalAge}`;

      duplicateKeys[key] = (duplicateKeys[key] || 0) + 1;
    });

    Object.values(duplicateKeys).forEach((count) => {
      if (count > 1) duplicateCount += count - 1;
    });

    const totalChecks = patients.length * requiredFields.length + patients.length * 3;
    const issueCount = missingCount + invalidCount + duplicateCount;

    const qualityScore =
      totalChecks > 0
        ? Math.max(0, 100 - Math.round((issueCount / totalChecks) * 100))
        : 0;

    return {
      missingCount,
      invalidCount,
      duplicateCount,
      qualityScore,
    };
  }, [patients]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Robson Audit & Quality Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Contribution analysis, benchmark comparison, intervention tracking,
          outcome monitoring, and data quality audit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <p className="text-sm text-slate-500">Actual C-Sections</p>
          <h2 className="text-4xl font-bold text-red-500 mt-2">
            {analytics.totalCS}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <p className="text-sm text-slate-500">Highest Contributor</p>
          <h2 className="text-2xl font-bold text-cyan-600 mt-2">
            {analytics.mostContributor
              ? `Group ${analytics.mostContributor.group}`
              : "-"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {analytics.mostContributor
              ? `${analytics.mostContributor.contribution.toFixed(1)}% of CS`
              : "Add actual outcomes"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <p className="text-sm text-slate-500">Lowest Contributor</p>
          <h2 className="text-2xl font-bold text-emerald-600 mt-2">
            {analytics.leastContributor
              ? `Group ${analytics.leastContributor.group}`
              : "-"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {analytics.leastContributor
              ? `${analytics.leastContributor.contribution.toFixed(1)}% of CS`
              : "Add actual outcomes"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <p className="text-sm text-slate-500">Data Quality Score</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {dataQuality.qualityScore}%
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          1. Group-wise C-Section Contribution
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Robson Group</th>
                <th className="p-3 text-left">Total Patients</th>
                <th className="p-3 text-left">Actual CS</th>
                <th className="p-3 text-left">CS Rate</th>
                <th className="p-3 text-left">Contribution to Total CS</th>
              </tr>
            </thead>

            <tbody>
              {analytics.groupList.map((g) => (
                <tr key={g.group} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-600">
                    Group {g.group}
                  </td>
                  <td className="p-3">{g.total}</td>
                  <td className="p-3">{g.actualCS}</td>
                  <td className="p-3">{g.csRate.toFixed(1)}%</td>
                  <td className="p-3 font-bold">
                    {g.contribution.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {analytics.totalCS === 0 && (
          <p className="text-sm text-red-500 mt-4">
            No actual C-section outcomes recorded yet. Update actual delivery
            outcome below to activate contribution analysis.
          </p>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          2. Benchmark Comparison
        </h2>

        <p className="text-sm text-slate-500 mb-4">
          Benchmarks are editable reference values for comparison. Replace them
          later with district, hospital network, or published benchmark data.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Group</th>
                <th className="p-3 text-left">Your CS Rate</th>
                <th className="p-3 text-left">Benchmark</th>
                <th className="p-3 text-left">Difference</th>
                <th className="p-3 text-left">Interpretation</th>
              </tr>
            </thead>

            <tbody>
              {analytics.groupList.map((g) => (
                <tr key={g.group} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-600">
                    Group {g.group}
                  </td>
                  <td className="p-3">{g.csRate.toFixed(1)}%</td>
                  <td className="p-3">{g.benchmark}%</td>
                  <td
                    className={`p-3 font-bold ${
                      g.benchmarkDifference > 0
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {g.benchmarkDifference.toFixed(1)}%
                  </td>
                  <td className="p-3">
                    {g.benchmarkDifference > 10
                      ? "Needs review"
                      : g.benchmarkDifference > 0
                      ? "Slightly higher"
                      : "Within benchmark"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          3. Intervention Tracking
        </h2>

        <form
          onSubmit={createIntervention}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <input
            placeholder="Intervention name"
            value={newIntervention.interventionName}
            onChange={(e) =>
              setNewIntervention({
                ...newIntervention,
                interventionName: e.target.value,
              })
            }
            className="bg-slate-100 p-3 rounded-xl"
            required
          />

          <input
            type="number"
            placeholder="Target Robson Group"
            value={newIntervention.targetRobsonGroup}
            onChange={(e) =>
              setNewIntervention({
                ...newIntervention,
                targetRobsonGroup: e.target.value,
              })
            }
            className="bg-slate-100 p-3 rounded-xl"
            required
          />

          <input
            type="number"
            placeholder="Before CS Rate %"
            value={newIntervention.beforeCSRate}
            onChange={(e) =>
              setNewIntervention({
                ...newIntervention,
                beforeCSRate: e.target.value,
              })
            }
            className="bg-slate-100 p-3 rounded-xl"
            required
          />

          <input
            type="number"
            placeholder="After CS Rate %"
            value={newIntervention.afterCSRate}
            onChange={(e) =>
              setNewIntervention({
                ...newIntervention,
                afterCSRate: e.target.value,
              })
            }
            className="bg-slate-100 p-3 rounded-xl"
            required
          />

          <input
            type="date"
            value={newIntervention.startDate}
            onChange={(e) =>
              setNewIntervention({
                ...newIntervention,
                startDate: e.target.value,
              })
            }
            className="bg-slate-100 p-3 rounded-xl"
          />

          <input
            type="date"
            value={newIntervention.endDate}
            onChange={(e) =>
              setNewIntervention({
                ...newIntervention,
                endDate: e.target.value,
              })
            }
            className="bg-slate-100 p-3 rounded-xl"
          />

          <input
            placeholder="Notes"
            value={newIntervention.notes}
            onChange={(e) =>
              setNewIntervention({
                ...newIntervention,
                notes: e.target.value,
              })
            }
            className="bg-slate-100 p-3 rounded-xl"
          />

          <button className="bg-cyan-500 text-white p-3 rounded-xl font-bold">
            Save Intervention
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interventions.map((item) => {
            const improvement = item.beforeCSRate - item.afterCSRate;

            return (
              <div key={item._id} className="bg-slate-50 p-5 rounded-2xl">
                <h3 className="font-bold text-slate-800">
                  {item.interventionName}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Target: Group {item.targetRobsonGroup}
                </p>
                <p className="mt-3">
                  Before: <b>{item.beforeCSRate}%</b>
                </p>
                <p>
                  After: <b>{item.afterCSRate}%</b>
                </p>
                <p
                  className={`font-bold mt-2 ${
                    improvement > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {improvement > 0
                    ? `Improved by ${improvement}%`
                    : `Worsened by ${Math.abs(improvement)}%`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          4. Outcome & Care Quality Tracking
        </h2>

        <p className="text-sm text-slate-500 mb-4">
          Update actual delivery outcomes after delivery. This converts the app
          from prediction-only into clinical audit mode.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Group</th>
                <th className="p-3 text-left">Actual Outcome</th>
                <th className="p-3 text-left">Maternal Comp.</th>
                <th className="p-3 text-left">NICU</th>
                <th className="p-3 text-left">Apgar</th>
              </tr>
            </thead>

            <tbody>
              {patients.slice(0, 25).map((p) => (
                <tr key={p._id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{p.patientName}</td>
                  <td className="p-3 font-bold text-cyan-600">
                    Group {p.robsonGroup || "-"}
                  </td>
                  <td className="p-3">
                    <select
                      value={p.actualDeliveryOutcome || "Pending"}
                      onChange={(e) =>
                        updatePatient(p._id, {
                          actualDeliveryOutcome: e.target.value,
                        })
                      }
                      className="bg-slate-100 p-2 rounded-lg"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Normal">Normal</option>
                      <option value="C-Section">C-Section</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={p.maternalComplications || false}
                      onChange={(e) =>
                        updatePatient(p._id, {
                          maternalComplications: e.target.checked,
                        })
                      }
                    />
                  </td>

                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={p.nicuAdmission || false}
                      onChange={(e) =>
                        updatePatient(p._id, {
                          nicuAdmission: e.target.checked,
                        })
                      }
                    />
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={p.apgarScore ?? ""}
                      onChange={(e) =>
                        updatePatient(p._id, {
                          apgarScore:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                      className="bg-slate-100 p-2 rounded-lg w-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          5. Data Quality Monitoring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Quality Score</p>
            <h3 className="text-4xl font-bold text-blue-600">
              {dataQuality.qualityScore}%
            </h3>
          </div>

          <div className="bg-yellow-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Missing Fields</p>
            <h3 className="text-4xl font-bold text-yellow-600">
              {dataQuality.missingCount}
            </h3>
          </div>

          <div className="bg-red-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Invalid Values</p>
            <h3 className="text-4xl font-bold text-red-600">
              {dataQuality.invalidCount}
            </h3>
          </div>

          <div className="bg-purple-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Duplicates</p>
            <h3 className="text-4xl font-bold text-purple-600">
              {dataQuality.duplicateCount}
            </h3>
          </div>
        </div>

        <div className="mt-6 bg-slate-50 p-5 rounded-2xl">
          <h3 className="font-bold mb-2">Validation Rules Used</h3>
          <ul className="list-disc ml-5 text-slate-700 space-y-1">
            <li>Required Robson fields must not be missing.</li>
            <li>Parity should not be greater than gravida.</li>
            <li>Gestational age should be between 20 and 43 weeks.</li>
            <li>Age should be between 12 and 55 years.</li>
            <li>Duplicate check uses patient name, age, and gestational age.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}