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
    <aside className="w-64 min-h-screen flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">
          📋 TaskFlow
        </h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Smart Task Manager</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
              activeClassName=""
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground">
            {user?.name?.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-sidebar-accent/50 transition-colors"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
