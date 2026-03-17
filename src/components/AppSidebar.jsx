import { useApp } from "@/context/AppContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  FiHome, FiUsers, FiPlusCircle, FiList, FiBarChart2,
  FiCheckSquare, FiLogOut, FiMoon, FiSun,
} from "react-icons/fi";

const teacherLinks = [
  { to: "/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/students", icon: FiUsers, label: "Students" },
  { to: "/create-task", icon: FiPlusCircle, label: "Create Task" },
  { to: "/manage-tasks", icon: FiList, label: "Manage Tasks" },
  { to: "/track-progress", icon: FiBarChart2, label: "Track Progress" },
];

const studentLinks = [
  { to: "/my-tasks", icon: FiCheckSquare, label: "My Tasks" },
];

export default function AppSidebar() {
  const { user, logout, darkMode, toggleDarkMode } = useApp();
  const location = useLocation();
  const links = user?.role === "teacher" ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-lg font-bold text-white">📋</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Smart Task Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {links.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + "/");
            return (
              <NavLink
                key={to}
                to={to}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
                activeClassName=""
              >
                <Icon size={18} className={active ? "text-white" : "text-gray-500 dark:text-gray-400"} />
                <span>{label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md">
            {user?.name?.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group"
          >
            {darkMode ? <FiSun size={18} className="text-gray-500 dark:text-gray-400" /> : <FiMoon size={18} className="text-gray-500 dark:text-gray-400" />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
          >
            <FiLogOut size={18} className="text-red-500 dark:text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
