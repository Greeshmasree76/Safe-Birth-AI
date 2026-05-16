import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ChatBox from "./components/ChatBox";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataEntry from "./pages/DataEntry";
import Patients from "./pages/Patients";
import Analytics from "./pages/Analytics";
import Audit from "./pages/Audit";
import Reports from "./pages/Reports";
import ExportData from "./pages/ExportData";
import Resources from "./pages/Resources";
import Support from "./pages/Support";
import Robson from "./pages/Robson";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        language={language}
        setLanguage={handleLanguageChange}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar language={language} />

        <div className="flex-1 min-w-0">
          <Topbar
            language={language}
            setLanguage={handleLanguageChange}
            onLogout={handleLogout}
          />

          <main className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard language={language} />} />
              <Route
                path="/data-entry"
                element={<DataEntry language={language} />}
              />
              <Route
                path="/patients"
                element={<Patients language={language} />}
              />
              <Route
                path="/analytics"
                element={<Analytics language={language} />}
              />
              <Route path="/audit" element={<Audit />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/export" element={<ExportData />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/support" element={<Support />} />
              <Route path="/robson" element={<Robson language={language} />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/settings"
                element={<Settings language={language} />}
              />
            </Routes>
          </main>
        </div>

        <ChatBox language={language} />
      </div>
    </BrowserRouter>
  );
}

export default App;