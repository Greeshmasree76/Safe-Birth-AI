export default function Topbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur border-b flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Hospital Dashboard</h2>
        <p className="text-sm text-slate-500">AI-based C-section risk monitoring</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="w-80 bg-slate-100 rounded-xl px-4 py-3 outline-none"
          placeholder="Search patients..."
        />
        <div className="w-11 h-11 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
          DR
        </div>
      </div>
    </header>
  );
}