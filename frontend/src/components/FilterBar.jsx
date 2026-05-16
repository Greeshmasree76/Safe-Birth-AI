export default function FilterBar({
  facility,
  setFacility,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
}) {
  const facilities = [
    "All Facilities",
    "SafeBirth Main Hospital",
    "SafeBirth Rural Unit",
    "SafeBirth District Centre",
    "SafeBirth Teaching Hospital",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={facility}
          onChange={(e) => setFacility(e.target.value)}
          className="bg-slate-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
        >
          {facilities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-slate-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-slate-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={onReset}
          className="bg-slate-900 text-white p-3 rounded-xl font-bold"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}