export const users = {
  admin: {
    role: "Admin",
    name: "Admin Manager",
    email: "admin@safebirth.ai",
    password: "admin123",
    title: "Hospital Administrator",
  },

  doctor: {
    role: "Doctor",
    name: "Dr. Priya Sharma",
    email: "doctor@safebirth.ai",
    password: "doctor123",
    title: "Gynecologist",
  },

  nurse: {
    role: "Nurse/Staff",
    name: "Nurse Anjali",
    email: "nurse@safebirth.ai",
    password: "nurse123",
    title: "Hospital Staff",
  },

  analyst: {
    role: "Data Analyst",
    name: "Data Analyst",
    email: "analyst@safebirth.ai",
    password: "analyst123",
    title: "Clinical Data Analyst",
  },
};

export const roleAccess = {
  Admin: [
    "/",
    "/data-entry",
    "/patients",
    "/analytics",
    "/audit",
    "/reports",
    "/export",
    "/resources",
    "/support",
    "/robson",
    "/profile",
    "/settings",
  ],

  Doctor: [
    "/",
    "/data-entry",
    "/patients",
    "/analytics",
    "/audit",
    "/reports",
    "/resources",
    "/support",
    "/robson",
    "/profile",
  ],

  "Nurse/Staff": [
    "/",
    "/data-entry",
    "/patients",
    "/resources",
    "/support",
    "/profile",
  ],

  "Data Analyst": [
    "/",
    "/analytics",
    "/audit",
    "/reports",
    "/export",
    "/resources",
    "/support",
    "/robson",
    "/profile",
  ],
};

export const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "Data Entry", path: "/data-entry", icon: "✏️" },
  { name: "Analysis", path: "/analytics", icon: "📊" },
  { name: "Robson Audit", path: "/audit", icon: "🧾" },
  { name: "Reports", path: "/reports", icon: "📑" },
  { name: "Export Data", path: "/export", icon: "⬇️" },
  { name: "Robson Groups", path: "/robson", icon: "👥" },
  { name: "Resources", path: "/resources", icon: "📘" },
  { name: "Support", path: "/support", icon: "❔" },
  { name: "Patient Records", path: "/patients", icon: "📄" },
  { name: "Profile", path: "/profile", icon: "👩‍⚕️" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
];

export const hasAccess = (role, path) => {
  if (!role) return false;

  const allowedRoutes = roleAccess[role] || [];

  return allowedRoutes.includes(path);
};