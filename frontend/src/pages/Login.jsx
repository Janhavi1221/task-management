import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">📋 TaskFlow</h1>
            <p className="text-muted-foreground mt-2">Smart Task Management System</p>
          </div>
          <ThemeToggle />
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <h2 className="text-xl font-semibold text-card-foreground mb-6">Welcome back</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Role</label>
              <div className="flex gap-3">
                {["student", "teacher"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                      role === r
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {r === "teacher" ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity mt-2"
            >
              Log In
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
