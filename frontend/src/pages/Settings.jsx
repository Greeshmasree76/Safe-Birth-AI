export default function Settings() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl">
          <h2 className="font-bold">Hospital Name</h2>
          <p>SafeBirth AI Hospital Dashboard</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl">
          <h2 className="font-bold">Prediction Mode</h2>
          <p>Rule-Based Risk Prediction</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl">
          <h2 className="font-bold">Next Upgrade</h2>
          <p>Modified Robson Classification + ML Model</p>
        </div>
      </div>
    </div>
  );
}