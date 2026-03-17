import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(name, role);
    navigate(role === "teacher" ? "/dashboard" : "/my-tasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-green-900 dark:to-green-800 p-4">
      <div className="w-full max-w-md slide-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">📋</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">TaskFlow</h1>
          <p className="text-gray-600 dark:text-gray-400">Smart Task Management System</p>
        </div>
        
        {/* Login Card */}
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Enter your credentials to access your workspace</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["student", "teacher"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      role === r
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {r === "teacher" ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
            >
              Sign In to Workspace
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
