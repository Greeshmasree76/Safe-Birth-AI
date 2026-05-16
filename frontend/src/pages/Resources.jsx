export default function Resources() {
  const resources = [
    {
      title: "Modified Robson Classification",
      description:
        "Classifies pregnant women into 10 mutually exclusive obstetric groups using parity, previous CS, gestational age, fetal presentation, number of fetuses, and labour onset.",
    },
    {
      title: "C-Section Risk Prediction Workflow",
      description:
        "Patient details are classified into a Robson group, passed through the ML prediction pipeline, and stored with risk score and prediction result.",
    },
    {
      title: "Audit Analytics",
      description:
        "Group-wise contribution, CS rate, benchmark comparison, intervention tracking, and outcome monitoring support quality improvement.",
    },
    {
      title: "Data Quality Monitoring",
      description:
        "Detects missing values, invalid parity-gravida combinations, unrealistic gestational age, and duplicate records.",
    },
    {
      title: "Real Data Upgrade Path",
      description:
        "The prototype ML model can be retrained using real hospital data with actual delivery outcomes for improved performance.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Resources</h1>
        <p className="text-slate-500 mt-2">
          Clinical, technical, and audit guidance for SafeBirth AI users.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {resources.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              {item.title}
            </h2>
            <p className="text-slate-600 mt-3 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Recommended Workflow</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            "Enter patient data",
            "Generate Robson group",
            "Predict risk",
            "Record actual outcome",
            "Review audit analytics",
          ].map((step, index) => (
            <div
              key={step}
              className="bg-blue-50 text-blue-800 rounded-2xl p-5 font-bold"
            >
              <p className="text-3xl mb-2">{index + 1}</p>
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Clinical Disclaimer</h2>
        <p>
          SafeBirth AI is a clinical decision-support and audit prototype. It
          should not replace qualified medical judgment. Final delivery decisions
          must be made by licensed healthcare professionals.
        </p>
      </div>
    </div>
  );
}