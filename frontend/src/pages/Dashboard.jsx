import { useState, useEffect } from "react";
import axios from "axios";
import DashboardCards from "../components/DashboardCards";
import Charts from "../components/Charts";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    weight: "",
    height: "",
    gravida: "",
    parity: "",
    previousLSCS: false,
    previousCSCount: 0,
    gestationalAge: "",
    numberOfFetuses: "",
    fetalLie: "",
    presentation: "",
    labourType: "",
    deliveryTiming: "",
    diabetes: false,
    hypertension: false,
  });

  const [patients, setPatients] = useState([]);
  const [result, setResult] = useState("");
  const [robsonGroup, setRobsonGroup] = useState("");
  const [robsonDescription, setRobsonDescription] = useState("");
  const [riskScore, setRiskScore] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = {
    total: patients.length,
    highRisk: patients.filter((p) => p.outcome === "High C-Section Risk").length,
    moderate: patients.filter((p) => p.outcome === "Moderate C-Section Risk").length,
    normal: patients.filter((p) => p.outcome === "Normal Delivery Likely").length,
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patients");
      setPatients(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      age: "",
      weight: "",
      height: "",
      gravida: "",
      parity: "",
      previousLSCS: false,
      previousCSCount: 0,
      gestationalAge: "",
      numberOfFetuses: "",
      fetalLie: "",
      presentation: "",
      labourType: "",
      deliveryTiming: "",
      diabetes: false,
      hypertension: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/patients",
        formData
      );

      setResult(res.data.outcome);
      setRobsonGroup(res.data.robsonGroup);
      setRobsonDescription(res.data.robsonDescription);
      setRiskScore(res.data.riskScore);

      await fetchPatients();
      resetForm();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-800">
        Hospital Dashboard
      </h1>

      <p className="text-gray-500 mb-8">
        Research-level Modified Robson Criteria based C-section risk prediction system
      </p>

      <DashboardCards stats={stats} />

      <Charts stats={stats} />

      <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          New Patient Prediction
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            name="patientName"
            type="text"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight"
            value={formData.weight}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            name="height"
            type="number"
            placeholder="Height"
            value={formData.height}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            name="gravida"
            type="number"
            placeholder="Gravida"
            value={formData.gravida}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            name="parity"
            type="number"
            placeholder="Parity"
            value={formData.parity}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            name="previousCSCount"
            type="number"
            placeholder="Previous CS Count"
            value={formData.previousCSCount}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <input
            name="gestationalAge"
            type="number"
            placeholder="Gestational Age"
            value={formData.gestationalAge}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <select
            name="numberOfFetuses"
            value={formData.numberOfFetuses}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          >
            <option value="">Select Number of Fetuses</option>
            <option value="Single">Single</option>
            <option value="Multiple">Multiple</option>
          </select>

          <select
            name="fetalLie"
            value={formData.fetalLie}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          >
            <option value="">Select Fetal Lie</option>
            <option value="Longitudinal">Longitudinal</option>
            <option value="Transverse">Transverse</option>
            <option value="Oblique">Oblique</option>
          </select>

          <select
            name="presentation"
            value={formData.presentation}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          >
            <option value="">Select Presentation</option>
            <option value="Cephalic">Cephalic</option>
            <option value="Breech">Breech</option>
            <option value="Transverse">Transverse</option>
            <option value="Oblique">Oblique</option>
          </select>

          <select
            name="labourType"
            value={formData.labourType}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          >
            <option value="">Select Labour Type</option>
            <option value="Spontaneous">Spontaneous</option>
            <option value="Induced">Induced</option>
            <option value="No Labour">No Labour</option>
          </select>

          <select
            name="deliveryTiming"
            value={formData.deliveryTiming}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
            required
          >
            <option value="">Select Delivery Timing</option>
            <option value="In Labour">In Labour</option>
            <option value="Pre Labour CS">Pre Labour CS</option>
          </select>

          <label className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl">
            <input
              type="checkbox"
              name="previousLSCS"
              checked={formData.previousLSCS}
              onChange={handleChange}
            />
            Previous LSCS
          </label>

          <label className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl">
            <input
              type="checkbox"
              name="diabetes"
              checked={formData.diabetes}
              onChange={handleChange}
            />
            Diabetes
          </label>

          <label className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl">
            <input
              type="checkbox"
              name="hypertension"
              checked={formData.hypertension}
              onChange={handleChange}
            />
            Hypertension
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-xl text-white font-bold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01]"
            }`}
          >
            {loading ? "Predicting..." : "Predict Delivery Risk"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 p-6 rounded-2xl text-center ${
              result === "High C-Section Risk"
                ? "bg-red-100 text-red-700"
                : result === "Moderate C-Section Risk"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <h2 className="text-2xl font-bold">Prediction Result</h2>

            <p className="text-lg mt-2">
              Modified Robson Group:{" "}
              <span className="font-bold">Group {robsonGroup}</span>
            </p>

            <p className="text-sm mt-2">
              {robsonDescription}
            </p>

            <p className="text-lg mt-2">
              Risk Score: <span className="font-bold">{riskScore}</span>
            </p>

            <p className="text-xl mt-2 font-bold">{result}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          Recent Patient Records
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Robson Group</th>
                <th className="p-3 text-left">Risk Score</th>
                <th className="p-3 text-left">Outcome</th>
              </tr>
            </thead>

            <tbody>
              {patients.slice(0, 5).map((p) => (
                <tr key={p._id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{p.patientName}</td>
                  <td className="p-3">{p.age}</td>
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
    </div>
  );
}