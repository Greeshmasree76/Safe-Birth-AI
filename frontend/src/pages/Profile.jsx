export default function Profile() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-2">
          Hospital staff profile and platform access details.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            DR
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Dr. Priya Sharma
            </h2>
            <p className="text-slate-500">Gynecologist</p>
            <p className="text-slate-500 mt-1">SafeBirth AI Hospital Unit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="bg-slate-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Role</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Doctor
            </h3>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Access Level</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Clinical Dashboard
            </h3>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">System Mode</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Robson + ML + Audit
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Platform Capabilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Patient data entry",
            "Modified Robson group classification",
            "ML-based prototype prediction",
            "High-risk alerts",
            "Group-wise audit analytics",
            "Benchmark comparison",
            "Intervention tracking",
            "PDF reporting",
            "Telugu/English support",
            "Data quality monitoring",
          ].map((item) => (
            <div
              key={item}
              className="bg-blue-50 text-blue-800 p-4 rounded-xl font-semibold"
            >
              ✅ {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 text-red-700 rounded-2xl p-6">
        <h2 className="font-bold text-xl mb-2">Clinical Disclaimer</h2>
        <p>
          This platform is a clinical decision-support prototype. Final delivery
          decisions must be made by qualified healthcare professionals.
        </p>
      </div>
    </div>
  );
}