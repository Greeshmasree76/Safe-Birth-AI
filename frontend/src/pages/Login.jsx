import { useState } from "react";
import { users } from "../utils/roleAccess";
import { translations } from "../utils/translations";

export default function Login({ onLogin, language, setLanguage }) {
  const t = translations[language];

  const [selectedRole, setSelectedRole] = useState("doctor");
  const [email, setEmail] = useState(users.doctor.email);
  const [password, setPassword] = useState(users.doctor.password);
  const [error, setError] = useState("");

  const roleCards = [
    {
      key: "admin",
      icon: "🛡️",
      title: "Admin",
      subtitle: "Full system control",
      access: "All pages, settings, reports, exports",
      color: "from-purple-500 to-indigo-600",
    },
    {
      key: "doctor",
      icon: "👩‍⚕️",
      title: "Doctor",
      subtitle: "Clinical decision support",
      access: "Patients, prediction, audit, reports",
      color: "from-blue-500 to-cyan-500",
    },
    {
      key: "nurse",
      icon: "🏥",
      title: "Nurse / Staff",
      subtitle: "Patient registration",
      access: "Data entry and patient records",
      color: "from-emerald-500 to-teal-600",
    },
    {
      key: "analyst",
      icon: "📊",
      title: "Data Analyst",
      subtitle: "Audit and reporting",
      access: "Analytics, reports, export, audit",
      color: "from-orange-500 to-red-500",
    },
  ];

  const selectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(users[roleKey].email);
    setPassword(users[roleKey].password);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users[selectedRole];

    if (email === user.email && password === user.password) {
      onLogin(user);
    } else {
      setError("Invalid login details for selected role");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black">SafeBirth AI</h1>
            <p className="text-cyan-100 mt-2">
              Modified Robson C-Section Risk Prediction & Audit Platform
            </p>
          </div>

          <button
            onClick={() => setLanguage(language === "en" ? "te" : "en")}
            className="px-5 py-3 bg-white/15 rounded-xl font-semibold"
          >
            {language === "en" ? "తెలుగు" : "English"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
          {roleCards.map((role) => (
            <button
              key={role.key}
              onClick={() => selectRole(role.key)}
              className={`text-left rounded-3xl p-6 border transition shadow-xl ${
                selectedRole === role.key
                  ? "border-cyan-300 bg-white/20 scale-[1.02]"
                  : "border-white/10 bg-white/10 hover:bg-white/15"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-3xl mb-5`}
              >
                {role.icon}
              </div>

              <h2 className="text-2xl font-bold">{role.title}</h2>
              <p className="text-cyan-100 mt-1">{role.subtitle}</p>

              <div className="mt-5 bg-black/20 p-4 rounded-2xl">
                <p className="text-sm text-white/80">{role.access}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center mx-auto text-2xl font-black">
              SB
            </div>

            <h2 className="text-3xl font-bold mt-4">{t.loginTitle}</h2>

            <p className="text-cyan-100 mt-2">
              Logging in as{" "}
              <span className="font-bold">{users[selectedRole].role}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
            />

            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
            />

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button className="w-full p-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300">
              Login as {users[selectedRole].role}
            </button>
          </form>

          <div className="mt-6 text-xs text-white/70 bg-black/20 p-4 rounded-2xl">
            <p className="font-bold mb-2">Demo Credentials</p>
            <p>Admin: admin@safebirth.ai / admin123</p>
            <p>Doctor: doctor@safebirth.ai / doctor123</p>
            <p>Nurse: nurse@safebirth.ai / nurse123</p>
            <p>Analyst: analyst@safebirth.ai / analyst123</p>
          </div>
        </div>
      </div>
    </div>
  );
}