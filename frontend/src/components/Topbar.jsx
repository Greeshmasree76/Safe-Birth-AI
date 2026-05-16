export default function Topbar({ language, setLanguage, onLogout }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          SafeBirth AI
        </h2>
        <p className="text-sm text-slate-500">
          Modified Robson C-Section Risk Prediction & Audit Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          placeholder="Search patients, reports, Robson groups..."
          className="w-96 bg-slate-100 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={() => setLanguage(language === "en" ? "te" : "en")}
          className="px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold"
        >
          {language === "en" ? "తెలుగు" : "English"}
        </button>

        <button
          onClick={onLogout}
          className="px-4 py-3 rounded-xl bg-red-500 text-white font-semibold"
        >
          Logout
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            DR
          </div>

          <div className="hidden xl:block">
            <p className="font-bold text-slate-900">Dr. Priya Sharma</p>
            <p className="text-xs text-slate-500">Gynecologist</p>
          </div>
        </div>
      </div>
    </header>
  );
}