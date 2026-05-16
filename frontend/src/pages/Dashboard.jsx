import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { PATIENTS_API } from "../utils/api";
import MetricCard from "../components/MetricCard";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get(PATIENTS_API)
      .then((res) => setPatients(res.data))
      .catch((err) => console.log(err));
  }, []);

  const groupDescriptions = {
    1: "Nulliparous, single cephalic, ≥37 weeks, spontaneous labour",
    2: "Nulliparous, single cephalic, ≥37 weeks, induced labour or CS before labour",
    3: "Multiparous without previous CS, single cephalic, ≥37 weeks, spontaneous labour",
    4: "Multiparous without previous CS, single cephalic, ≥37 weeks, induced labour or CS before labour",
    5: "Previous CS, single cephalic, ≥37 weeks",
    6: "Nulliparous, single breech pregnancy",
    7: "Multiparous, single breech pregnancy",
    8: "Multiple pregnancy",
    9: "Transverse or oblique lie",
    10: "Single cephalic, <37 weeks",
  };

  const dashboardData = useMemo(() => {
    const totalBirths = patients.length;

    const actualCS = patients.filter(
      (p) => p.actualDeliveryOutcome === "C-Section"
    ).length;

    const predictedCS = patients.filter(
      (p) => p.outcome === "High C-Section Risk"
    ).length;

    const caesareans = actualCS > 0 ? actualCS : predictedCS;

    const overallCSRate =
      totalBirths > 0 ? ((caesareans / totalBirths) * 100).toFixed(1) : 0;

    const groupRows = [];

    for (let group = 1; group <= 10; group++) {
      const groupPatients = patients.filter((p) => p.robsonGroup === group);
      const groupTotal = groupPatients.length;

      const groupCSActual = groupPatients.filter(
        (p) => p.actualDeliveryOutcome === "C-Section"
      ).length;

      const groupPredictedHigh = groupPatients.filter(
        (p) => p.outcome === "High C-Section Risk"
      ).length;

      const groupCS = actualCS > 0 ? groupCSActual : groupPredictedHigh;

      const groupSizePercent =
        totalBirths > 0 ? (groupTotal / totalBirths) * 100 : 0;

      const csRate = groupTotal > 0 ? (groupCS / groupTotal) * 100 : 0;

      groupRows.push({
        group,
        groupLabel: `${group}`,
        description: groupDescriptions[group],
        births: groupTotal,
        groupSizePercent: Number(groupSizePercent.toFixed(1)),
        csCount: groupCS,
        csRate: Number(csRate.toFixed(1)),
      });
    }

    return {
      totalBirths,
      caesareans,
      overallCSRate,
      groupRows,
    };
  }, [patients]);

  const pieColors = [
    "#2563eb",
    "#f97316",
    "#22c55e",
    "#ef4444",
    "#8b5cf6",
    "#a16207",
    "#ec4899",
    "#6b7280",
    "#eab308",
    "#06b6d4",
  ];

  const pieData = dashboardData.groupRows
    .filter((g) => g.births > 0)
    .map((g) => ({
      name: `Group ${g.group}`,
      value: g.births,
    }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-2">
            Overview of caesarean section rates using Modified Robson Classification
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold">
          Select Facility
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <MetricCard
          icon="👥"
          title="Total births"
          value={dashboardData.totalBirths}
          subtitle="Selected period"
          color="bg-blue-100 text-blue-700"
        />

        <MetricCard
          icon="✒️"
          title="Caesarean sections"
          value={dashboardData.caesareans}
          subtitle="Actual CS / predicted high-risk"
          color="bg-orange-100 text-orange-700"
        />

        <MetricCard
          icon="◔"
          title="Overall CS rate"
          value={`${dashboardData.overallCSRate}%`}
          subtitle="WHO reference can be configured"
          color="bg-green-100 text-green-700"
        />

        <MetricCard
          icon="☷"
          title="Robson groups"
          value="10"
          subtitle="Groups analysed"
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Caesarean section rate by Robson group
          </h2>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dashboardData.groupRows}>
                <XAxis dataKey="groupLabel" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />

                <Bar
                  yAxisId="left"
                  dataKey="groupSizePercent"
                  name="Group size (%)"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="csRate"
                  name="CS rate (%)"
                  stroke="#f97316"
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Distribution of births by Robson group
          </h2>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={90}
                  outerRadius={140}
                  paddingAngle={2}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Robson group summary
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Group</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">No. of births</th>
                <th className="p-3 text-right">% of total births</th>
                <th className="p-3 text-right">CS rate (%)</th>
              </tr>
            </thead>

            <tbody>
              {dashboardData.groupRows.map((row) => (
                <tr key={row.group} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-bold text-blue-700">
                    {row.group}
                  </td>
                  <td className="p-3">{row.description}</td>
                  <td className="p-3 text-right">{row.births}</td>
                  <td className="p-3 text-right">
                    {row.groupSizePercent}%
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {row.csRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {patients.length === 0 && (
          <p className="text-red-500 text-sm mt-4">
            No patient data available. Add patients from Data Entry page.
          </p>
        )}
      </div>
    </div>
  );
}