import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ChatBox from "./components/ChatBox";
import ProtectedRoute from "./components/ProtectedRoute";

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
import AccessDenied from "./pages/AccessDenied";

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleLogin = (user) => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setLoggedIn(false);
  };

  const protect = (path, component) => {
    return (
      <ProtectedRoute currentUser={currentUser} path={path}>
        {component}
      </ProtectedRoute>
    );
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
        <Sidebar language={language} currentUser={currentUser} />

        <div className="flex-1 min-w-0">
          <Topbar
            language={language}
            setLanguage={handleLanguageChange}
            onLogout={handleLogout}
            currentUser={currentUser}
          />

          <main className="p-8">
            <Routes>
              <Route path="/" element={protect("/", <Dashboard language={language} />)} />

              <Route
                path="/data-entry"
                element={protect(
                  "/data-entry",
                  <DataEntry language={language} />
                )}
              />

              <Route
                path="/patients"
                element={protect(
                  "/patients",
                  <Patients language={language} />
                )}
              />

              <Route
                path="/analytics"
                element={protect(
                  "/analytics",
                  <Analytics language={language} />
                )}
              />

              <Route path="/audit" element={protect("/audit", <Audit />)} />

              <Route
                path="/reports"
                element={protect("/reports", <Reports />)}
              />

              <Route
                path="/export"
                element={protect("/export", <ExportData />)}
              />

              <Route
                path="/resources"
                element={protect("/resources", <Resources />)}
              />

              <Route
                path="/support"
                element={protect("/support", <Support />)}
              />

              <Route
                path="/robson"
                element={protect(
                  "/robson",
                  <Robson language={language} />
                )}
              />

              <Route
                path="/profile"
                element={protect(
                  "/profile",
                  <Profile currentUser={currentUser} />
                )}
              />

              <Route
                path="/settings"
                element={protect(
                  "/settings",
                  <Settings language={language} />
                )}
              />

              <Route
                path="/access-denied"
                element={<AccessDenied currentUser={currentUser} />}
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