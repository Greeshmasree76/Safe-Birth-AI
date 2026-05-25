export default function Profile({ currentUser }) {
  const capabilities = {
    Admin: [
      "Manage all platform modules",
      "Access all patient records",
      "Download reports",
      "Export datasets",
      "View audit dashboards",
      "Access settings",
    ],

    Doctor: [
      "Enter patient data",
      "View risk prediction",
      "Update delivery outcomes",
      "View Robson audit",
      "Download reports",
      "Monitor high-risk patients",
    ],

    "Nurse/Staff": [
      "Register patients",
      "Enter basic clinical details",
      "View patient records",
      "Access resources",
      "Submit support requests",
    ],

    "Data Analyst": [
      "View analytics dashboard",
      "Analyze Robson audit",
      "Download reports",
      "Export CSV/JSON data",
      "Monitor data quality",
      "Compare benchmarks",
    ],
  };

  const list = capabilities[currentUser?.role] || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-2">
          Role-based profile and access details.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {currentUser?.role === "Admin"
              ? "AD"
              : currentUser?.role === "Doctor"
              ? "DR"
              : currentUser?.role === "Nurse/Staff"
              ? "NS"
              : "DA"}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {currentUser?.name}
            </h2>
            <p className="text-slate-500">{currentUser?.title}</p>
            <p className="text-blue-600 font-semibold mt-1">
              {currentUser?.role}
            </p>
            <p className="text-slate-500 mt-1">{currentUser?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="bg-slate-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Role</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {currentUser?.role}
            </h3>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl">
            <p className="text-sm text-slate-500">Access Type</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Role-Based Access
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
        <h2 className="text-2xl font-bold mb-4">Allowed Access</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((item) => (
            <div
              key={item}
              className="bg-blue-50 text-blue-800 p-4 rounded-xl font-semibold"
            >
              ✅ {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 text-yellow-800 rounded-2xl p-6">
        <h2 className="font-bold text-xl mb-2">Security Note</h2>
        <p>
          This version uses frontend demo authentication for project
          demonstration. Production hospital use requires backend JWT
          authentication, encrypted passwords, audit logs, and secure role
          management.
        </p>
      </div>
    </div>
  );
}