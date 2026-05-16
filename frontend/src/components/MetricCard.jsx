export default function MetricCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center gap-5">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-slate-600 font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">{value}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}