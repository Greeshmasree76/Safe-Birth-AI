import { NavLink } from "react-router-dom";
import { hasAccess, sidebarLinks } from "../utils/roleAccess";

export default function Sidebar({ currentUser }) {
  const allowedLinks = sidebarLinks.filter((link) =>
    hasAccess(currentUser?.role, link.path)
  );

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 sticky top-0 overflow-y-auto">
      <div className="h-20 flex items-center px-6 border-b border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
          SB
        </div>

        <div className="ml-3">
          <h1 className="text-xl font-bold text-blue-700">SafeBirth AI</h1>
          <p className="text-xs text-slate-500">Modified Robson Platform</p>
        </div>
      </div>

      <div className="mx-4 mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-xs text-slate-500">Logged in as</p>
        <p className="font-bold text-slate-900">{currentUser?.name}</p>
        <p className="text-sm text-blue-600 font-semibold">
          {currentUser?.role}
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {allowedLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="mx-4 mt-6 mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">
        <p className="text-xs text-slate-500">System Mode</p>
        <p className="text-sm font-bold text-blue-700 mt-1">
          Robson + ML + Audit
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Role-based access enabled.
        </p>
      </div>
    </aside>
  );
}