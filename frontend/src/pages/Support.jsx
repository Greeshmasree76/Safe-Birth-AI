import { useState } from "react";

export default function Support() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitSupport = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage("");
  };

  const faqs = [
    {
      q: "Why are some records shown as predicted instead of actual CS?",
      a: "Actual delivery outcome must be updated after delivery. Until then, the system uses risk prediction as a proxy indicator.",
    },
    {
      q: "Can this be used with real hospital data?",
      a: "Yes, but real data should be anonymized, validated, and used with proper consent and security controls.",
    },
    {
      q: "Is the ML model clinically validated?",
      a: "No. The current ML model is a prototype trained on simulated Robson-style data. It should be retrained with real hospital outcomes.",
    },
    {
      q: "Why do data quality issues appear?",
      a: "Missing Robson fields, invalid age, invalid gestational age, duplicate records, or parity greater than gravida can reduce data quality.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Support</h1>
        <p className="text-slate-500 mt-2">
          Platform help, issue reporting, and user guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Contact Support</h2>

          <form onSubmit={submitSupport} className="space-y-4">
            <input
              className="w-full bg-slate-100 p-3 rounded-xl outline-none"
              value="Dr. Priya Sharma"
              readOnly
            />

            <input
              className="w-full bg-slate-100 p-3 rounded-xl outline-none"
              value="SafeBirth AI Hospital Unit"
              readOnly
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or requirement..."
              className="w-full bg-slate-100 p-3 rounded-xl outline-none h-40"
              required
            />

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
              Submit Request
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-emerald-600 font-bold">
              Support request saved locally for demo. Backend ticketing can be
              added later.
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">System Checklist</h2>

          <div className="space-y-3">
            {[
              "ML service health check active",
              "Backend API connected",
              "MongoDB Atlas connected",
              "Frontend deployed",
              "PDF reports enabled",
              "Export tools enabled",
              "Robson audit enabled",
              "Data quality monitoring enabled",
            ].map((item) => (
              <div
                key={item}
                className="bg-green-50 text-green-700 p-3 rounded-xl font-semibold"
              >
                ✅ {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-slate-50 p-5 rounded-2xl">
              <h3 className="font-bold text-slate-900">{faq.q}</h3>
              <p className="text-slate-600 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}