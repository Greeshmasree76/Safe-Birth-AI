import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Charts({ stats }) {
  const pieData = [
    { name: "High Risk", value: stats.highRisk },
    { name: "Moderate Risk", value: stats.moderate },
    { name: "Normal", value: stats.normal },
  ];

  const barData = [
    { name: "Total", total: stats.total },
    { name: "High", total: stats.highRisk },
    { name: "Moderate", total: stats.moderate },
    { name: "Normal", total: stats.normal },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Risk Distribution</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Patient Analytics</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#06b6d4" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}