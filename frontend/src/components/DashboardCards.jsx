export default function DashboardCards({ stats }) {
  const cards = [
    {
      title: "Total Patients",
      value: stats.total,
      subtitle: "Registered Cases",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      title: "High Risk",
      value: stats.highRisk,
      subtitle: "Critical Cases",
      gradient: "from-red-500 to-pink-600",
    },
    {
      title: "Moderate Risk",
      value: stats.moderate,
      subtitle: "Needs Monitoring",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      title: "Normal",
      value: stats.normal,
      subtitle: "Stable Cases",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-6 text-white shadow-xl`}
        >
          <p className="text-sm opacity-80">{card.title}</p>

          <h2 className="text-4xl font-bold mt-3">
            {card.value}
          </h2>

          <p className="mt-4 text-sm opacity-90">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}