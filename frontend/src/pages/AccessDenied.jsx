export default function AccessDenied({ currentUser }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-10 max-w-xl text-center">
        <div className="text-6xl mb-4">🔒</div>

        <h1 className="text-3xl font-bold text-red-600">
          Access Denied
        </h1>

        <p className="text-slate-600 mt-4">
          Your current role does not have permission to open this section.
        </p>

        <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-2xl">
          <p>
            <b>Logged in as:</b> {currentUser?.role || "Unknown"}
          </p>
          <p>
            <b>User:</b> {currentUser?.name || "Unknown"}
          </p>
        </div>

        <p className="text-sm text-slate-500 mt-6">
          Contact Admin if this access is required.
        </p>
      </div>
    </div>
  );
}