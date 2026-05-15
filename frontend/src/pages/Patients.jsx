import { useEffect, useState } from "react";
import axios from "axios";

export default function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        Patient Records
      </h1>

      <p className="text-gray-500 mb-6">
        Patient records with Modified Robson Group, risk score, and delivery risk prediction.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">GA</th>
              <th className="p-3 text-left">Fetuses</th>
              <th className="p-3 text-left">Lie</th>
              <th className="p-3 text-left">Presentation</th>
              <th className="p-3 text-left">Labour</th>
              <th className="p-3 text-left">Robson</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-left">Outcome</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p._id} className="border-b hover:bg-slate-50">
                <td className="p-3">{p.patientName}</td>
                <td className="p-3">{p.age}</td>
                <td className="p-3">{p.gestationalAge}</td>
                <td className="p-3">{p.numberOfFetuses || "-"}</td>
                <td className="p-3">{p.fetalLie || "-"}</td>
                <td className="p-3">{p.presentation}</td>
                <td className="p-3">{p.labourType}</td>
                <td className="p-3 font-bold text-cyan-600">
                  {p.robsonGroup ? `Group ${p.robsonGroup}` : "Not classified"}
                </td>
                <td className="p-3">{p.riskScore ?? "-"}</td>
                <td
                  className={`p-3 font-bold ${
                    p.outcome === "High C-Section Risk"
                      ? "text-red-500"
                      : p.outcome === "Moderate C-Section Risk"
                      ? "text-yellow-600"
                      : "text-emerald-600"
                  }`}
                >
                  {p.outcome}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}