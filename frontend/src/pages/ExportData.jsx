import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { PATIENTS_API } from "../utils/api";
import FilterBar from "../components/FilterBar";

export default function ExportData() {
  const [patients, setPatients] = useState([]);
  const [facility, setFacility] = useState("All Facilities");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get(PATIENTS_API)
      .then((res) => setPatients(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const facilityMatch =
        facility === "All Facilities" ||
        (p.facilityName || "SafeBirth Main Hospital") === facility;

      const created = new Date(p.createdAt);
      const startMatch = startDate ? created >= new Date(startDate) : true;

      const endMatch = endDate
        ? created <= new Date(`${endDate}T23:59:59`)
        : true;

      return facilityMatch && startMatch && endMatch;
    });
  }, [patients, facility, startDate, endDate]);

  const convertToCSV = (data) => {
    const headers = [
      "facilityName",
      "patientName",
      "age",
      "gravida",
      "parity",
      "gestationalAge",
      "presentation",
      "labourType",
      "robsonGroup",
      "riskScore",
      "outcome",
      "actualDeliveryOutcome",
      "mlConfidence",
      "createdAt",
    ];

    const rows = data.map((p) =>
      headers
        .map((key) => {
          const value = p[key] ?? "";
          return `"${String(value).replaceAll('"', '""')}"`;
        })
        .join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const csv = convertToCSV(filteredPatients);
    downloadFile(csv, "SafeBirth_Patient_Data.csv", "text/csv");
  };

  const downloadJSON = () => {
    const json = JSON.stringify(filteredPatients, null, 2);
    downloadFile(json, "SafeBirth_Patient_Data.json", "application/json");
  };

  const resetFilters = () => {
    setFacility("All Facilities");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Export Data</h1>
        <p className="text-slate-500 mt-2">
          Export filtered patient records for research, audit, and ML retraining.
        </p>
      </div>

      <FilterBar
        facility={facility}
        setFacility={setFacility}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={downloadCSV}
          className="bg-blue-600 text-white p-6 rounded-2xl font-bold text-xl"
        >
          Download CSV
        </button>

        <button
          onClick={downloadJSON}
          className="bg-slate-900 text-white p-6 rounded-2xl font-bold text-xl"
        >
          Download JSON
        </button>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Filtered Records</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">
            {filteredPatients.length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Export Preview</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Facility</th>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Group</th>
                <th className="p-3 text-left">Prediction</th>
                <th className="p-3 text-left">Actual Outcome</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.slice(0, 20).map((p) => (
                <tr key={p._id} className="border-b hover:bg-slate-50">
                  <td className="p-3">
                    {p.facilityName || "SafeBirth Main Hospital"}
                  </td>
                  <td className="p-3">{p.patientName}</td>
                  <td className="p-3">Group {p.robsonGroup || "-"}</td>
                  <td className="p-3">{p.outcome}</td>
                  <td className="p-3">{p.actualDeliveryOutcome || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500 mt-4">
          Preview shows first 20 filtered records. Export downloads all filtered
          records.
        </p>
      </div>
    </div>
  );
}