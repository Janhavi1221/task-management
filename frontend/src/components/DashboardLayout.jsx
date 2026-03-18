import AppSidebar from "@/components/AppSidebar";
import { useApp } from "@/context/AppContext";
import { FiSearch, FiBell, FiSettings } from "react-icons/fi";

export default function DashboardLayout({ children }) {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="flex min-h-screen w-full bg-amber-50 dark:from-green-900 dark:to-green-800">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Professional Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks, students, or anything..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group">
              <FiBell size={18} className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            
            {/* Settings */}
            <button className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group">
              <FiSettings size={18} className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              U
            </div>
          </div>
        </header>

        {/* Professional Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
