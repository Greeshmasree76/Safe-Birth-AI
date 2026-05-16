import { useState } from "react";
import axios from "axios";
import { PATIENTS_API } from "../utils/api";
import HighRiskAlert from "../components/HighRiskAlert";

export default function DataEntry() {
  const [formData, setFormData] = useState({
    facilityName: "SafeBirth Main Hospital",
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

  const [result, setResult] = useState(null);
  const [alertPatient, setAlertPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "border border-slate-300 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      facilityName: "SafeBirth Main Hospital",
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
      const res = await axios.post(PATIENTS_API, formData);

      setResult(res.data);

      if (res.data.outcome === "High C-Section Risk") {
        setAlertPatient(res.data);
      }

      resetForm();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save patient");
    }

    setLoading(false);
  };

  return (
    <div>
      <HighRiskAlert
        patient={alertPatient}
        onClose={() => setAlertPatient(null)}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Data Entry</h1>
        <p className="text-slate-500 mt-2">
          Enter patient details for Robson classification, ML prediction, and
          audit tracking.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          New Patient Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-2 gap-5"
        >
          <select
            name="facilityName"
            value={formData.facilityName}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="SafeBirth Main Hospital">SafeBirth Main Hospital</option>
            <option value="SafeBirth Rural Unit">SafeBirth Rural Unit</option>
            <option value="SafeBirth District Centre">SafeBirth District Centre</option>
            <option value="SafeBirth Teaching Hospital">SafeBirth Teaching Hospital</option>
          </select>

          <input
            name="patientName"
            type="text"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight"
            value={formData.weight}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            name="height"
            type="number"
            placeholder="Height"
            value={formData.height}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            name="gravida"
            type="number"
            placeholder="Gravida"
            value={formData.gravida}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            name="parity"
            type="number"
            placeholder="Parity"
            value={formData.parity}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            name="previousCSCount"
            type="number"
            placeholder="Previous CS Count"
            value={formData.previousCSCount}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="gestationalAge"
            type="number"
            placeholder="Gestational Age"
            value={formData.gestationalAge}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <select
            name="numberOfFetuses"
            value={formData.numberOfFetuses}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Number of Fetuses</option>
            <option value="Single">Single</option>
            <option value="Multiple">Multiple</option>
          </select>

          <select
            name="fetalLie"
            value={formData.fetalLie}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Fetal Lie</option>
            <option value="Longitudinal">Longitudinal</option>
            <option value="Transverse">Transverse</option>
            <option value="Oblique">Oblique</option>
          </select>

          <select
            name="presentation"
            value={formData.presentation}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Presentation</option>
            <option value="Cephalic">Cephalic</option>
            <option value="Breech">Breech</option>
            <option value="Transverse">Transverse</option>
            <option value="Oblique">Oblique</option>
          </select>

          <select
            name="labourType"
            value={formData.labourType}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Labour Type</option>
            <option value="Spontaneous">Spontaneous</option>
            <option value="Induced">Induced</option>
            <option value="No Labour">No Labour</option>
          </select>

          <select
            name="deliveryTiming"
            value={formData.deliveryTiming}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Delivery Timing</option>
            <option value="In Labour">In Labour</option>
            <option value="Pre Labour CS">Pre Labour CS</option>
          </select>

          <label className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl">
            <input
              type="checkbox"
              name="previousLSCS"
              checked={formData.previousLSCS}
              onChange={handleChange}
            />
            Previous LSCS
          </label>

          <label className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl">
            <input
              type="checkbox"
              name="diabetes"
              checked={formData.diabetes}
              onChange={handleChange}
            />
            Diabetes
          </label>

          <label className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl">
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
            className="xl:col-span-2 bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-400"
          >
            {loading ? "Predicting..." : "Classify & Predict Risk"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-8 p-6 rounded-2xl ${
              result.outcome === "High C-Section Risk"
                ? "bg-red-50 text-red-700"
                : result.outcome === "Moderate C-Section Risk"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            <h2 className="text-2xl font-bold">Prediction Result</h2>

            <p className="mt-2">
              <b>Facility:</b> {result.facilityName || formData.facilityName}
            </p>

            <p className="mt-1">
              <b>Robson Group:</b> Group {result.robsonGroup}
            </p>

            <p className="mt-1">
              <b>Description:</b> {result.robsonDescription}
            </p>

            <p className="mt-1">
              <b>Risk Score:</b> {result.riskScore}
            </p>

            <p className="mt-1">
              <b>Outcome:</b> {result.outcome}
            </p>

            <p className="mt-1">
              <b>ML Confidence:</b>{" "}
              {result.mlConfidence ? `${result.mlConfidence}%` : "Fallback"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}