import { useState } from "react";
import axios from "axios";

import { AUTH_API } from "../utils/api";
import { users } from "../utils/roleAccess";
import { translations } from "../utils/translations";

export default function Login({ onLogin, language, setLanguage }) {
  const t = translations[language];

  const [selectedRole, setSelectedRole] = useState("doctor");
  const [mode, setMode] = useState("login");

  const [loginData, setLoginData] = useState({
    email: users.doctor.email,
    password: users.doctor.password,
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setError("");
    setSuccess("");

    if (mode === "login") {
      setLoginData({
        email: users[roleKey].email,
        password: users[roleKey].password,
      });
    }

    if (mode === "register") {
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");

    if (newMode === "login") {
      setLoginData({
        email: users[selectedRole].email,
        password: users[selectedRole].password,
      });
    }

    if (newMode === "register") {
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const selectedUserRole = users[selectedRole];

      const res = await axios.post(`${AUTH_API}/login`, {
        email: loginData.email,
        password: loginData.password,
        role: selectedUserRole.role,
      });

      onLogin(res.data.user, res.data.token);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const selectedUserRole = users[selectedRole];

      if (!registerData.name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      if (!registerData.email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      if (registerData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (registerData.password !== registerData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${AUTH_API}/register`, {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: selectedUserRole.role,
        title: selectedUserRole.title,
      });

      setSuccess("Registration successful. Logging you in...");
      onLogin(res.data.user, res.data.token);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }

    setLoading(false);
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
              type="button"
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

            <h2 className="text-3xl font-bold mt-4">
              {mode === "login" ? t.loginTitle : "Register Account"}
            </h2>

            <p className="text-cyan-100 mt-2">
              {mode === "login" ? "Logging in as" : "Registering as"}{" "}
              <span className="font-bold">{users[selectedRole].role}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`p-3 rounded-xl font-bold ${
                mode === "login"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-white/15 text-white"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`p-3 rounded-xl font-bold ${
                mode === "register"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-white/15 text-white"
              }`}
            >
              Register
            </button>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                placeholder={t.email}
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
                required
              />

              <input
                type="password"
                placeholder={t.password}
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
                required
              />

              {error && <p className="text-red-300 text-sm">{error}</p>}
              {success && <p className="text-green-300 text-sm">{success}</p>}

              <button
                disabled={loading}
                className="w-full p-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 disabled:bg-slate-400"
              >
                {loading
                  ? "Logging in..."
                  : `Login as ${users[selectedRole].role}`}
              </button>
            </form>
          )}

          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    name: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
                required
              />

              {error && <p className="text-red-300 text-sm">{error}</p>}
              {success && <p className="text-green-300 text-sm">{success}</p>}

              <button
                disabled={loading}
                className="w-full p-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 disabled:bg-slate-400"
              >
                {loading
                  ? "Registering..."
                  : `Register as ${users[selectedRole].role}`}
              </button>
            </form>
          )}

          <div className="mt-6 text-xs text-white/70 bg-black/20 p-4 rounded-2xl">
            <p className="font-bold mb-2">
              {users[selectedRole].role} Demo Credential
            </p>

            <p>
              <b>Email:</b> {users[selectedRole].email}
            </p>

            <p>
              <b>Password:</b> {users[selectedRole].password}
            </p>


          </div>

        </div>
      </div>
    </div>
  );
}