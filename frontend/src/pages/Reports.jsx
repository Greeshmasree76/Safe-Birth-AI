import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { PATIENTS_API } from "../utils/api";
import FilterBar from "../components/FilterBar";

export default function Reports() {
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

  const summary = useMemo(() => {
    const total = filteredPatients.length;

    const actualCS = filteredPatients.filter(
      (p) => p.actualDeliveryOutcome === "C-Section"
    ).length;

    const predictedHigh = filteredPatients.filter(
      (p) => p.outcome === "High C-Section Risk"
    ).length;

    const csCount = actualCS > 0 ? actualCS : predictedHigh;

    const csRate = total > 0 ? ((csCount / total) * 100).toFixed(1) : "0.0";

    const groupSummary = [];

    for (let group = 1; group <= 10; group++) {
      const groupPatients = filteredPatients.filter(
        (p) => p.robsonGroup === group
      );

      const groupTotal = groupPatients.length;

      const groupCSActual = groupPatients.filter(
        (p) => p.actualDeliveryOutcome === "C-Section"
      ).length;

      const groupPredictedHigh = groupPatients.filter(
        (p) => p.outcome === "High C-Section Risk"
      ).length;

      const groupCS = actualCS > 0 ? groupCSActual : groupPredictedHigh;

      const groupCSRate =
        groupTotal > 0 ? ((groupCS / groupTotal) * 100).toFixed(1) : "0.0";

      const contribution =
        csCount > 0 ? ((groupCS / csCount) * 100).toFixed(1) : "0.0";

      groupSummary.push({
        group,
        total: groupTotal,
        cs: groupCS,
        csRate: groupCSRate,
        contribution,
      });
    }

    return {
      total,
      csCount,
      csRate,
      groupSummary,
    };
  }, [filteredPatients]);

  const downloadAuditPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SafeBirth AI - Modified Robson Audit Report", 14, 18);

    doc.setFontSize(10);
    doc.text(`Facility: ${facility}`, 14, 28);
    doc.text(`Date Range: ${startDate || "All"} to ${endDate || "All"}`, 14, 35);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: [
        ["Total Births / Patients", summary.total],
        ["C-Sections / High-Risk Cases", summary.csCount],
        ["Overall CS / High-Risk Rate", `${summary.csRate}%`],
        ["Robson Groups Analysed", 10],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Group", "Total", "CS / High Risk", "CS Rate", "Contribution"]],
      body: summary.groupSummary.map((g) => [
        `Group ${g.group}`,
        g.total,
        g.cs,
        `${g.csRate}%`,
        `${g.contribution}%`,
      ]),
    });

    doc.setFontSize(9);
    doc.text(
      "Note: If actual delivery outcomes are not recorded, high-risk predictions are used as proxy values.",
      14,
      doc.lastAutoTable.finalY + 12
    );

    doc.save("SafeBirth_Robson_Audit_Report.pdf");
  };

  const resetFilters = () => {
    setFacility("All Facilities");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 mt-2">
            Generate facility-wise and date-wise Modified Robson audit reports.
          </p>
        </div>

        <button
          onClick={downloadAuditPDF}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Download Full Audit PDF
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Total Records</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">
            {summary.total}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">CS / High Risk</p>
          <h2 className="text-4xl font-bold text-red-500 mt-2">
            {summary.csCount}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">CS Rate</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {summary.csRate}%
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Facilities</p>
          <h2 className="text-2xl font-bold text-emerald-600 mt-2">
            {facility}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">
          Group-wise Audit Summary
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Robson Group</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">CS / High Risk</th>
                <th className="p-3 text-right">CS Rate</th>
                <th className="p-3 text-right">Contribution</th>
              </tr>
            </thead>

            <tbody>
              {summary.groupSummary.map((g) => (
                <tr key={g.group} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-bold text-blue-700">
                    Group {g.group}
                  </td>
                  <td className="p-3 text-right">{g.total}</td>
                  <td className="p-3 text-right">{g.cs}</td>
                  <td className="p-3 text-right">{g.csRate}%</td>
                  <td className="p-3 text-right font-bold">
                    {g.contribution}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl text-yellow-800">
        <b>Interpretation Note:</b> For publish-level reporting, actual delivery
        outcomes should be recorded. Until then, predicted high-risk values are
        used as proxy indicators.
      </div>
    </div>
  );
}