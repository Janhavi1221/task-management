import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import { FiUsers, FiList, FiCheckCircle, FiClock } from "react-icons/fi";

export default function TeacherDashboard() {
  const { students, tasks } = useApp();

  const stats = [
    { label: "Total Students", value: students.length, icon: FiUsers, color: "text-primary" },
    { label: "Total Tasks", value: tasks.length, icon: FiList, color: "text-accent" },
    { label: "Completed", value: tasks.filter(t => t.status === "Completed").length, icon: FiCheckCircle, color: "text-success" },
    { label: "Pending", value: tasks.filter(t => t.status === "Pending").length, icon: FiClock, color: "text-warning" },
  ];

  const recentTasks = [...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your summary.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-muted ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent tasks */}
        <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-semibold text-card-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentTasks.map(task => (
              <div key={task._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === "Completed" ? "status-completed" :
                    task.status === "In Progress" ? "status-in-progress" : "status-pending"
                  }`}>{task.status}</span>
                  <span className="text-sm text-card-foreground">{task.title}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  task.priority === "High" ? "priority-high" :
                  task.priority === "Medium" ? "priority-medium" : "priority-low"
                }`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
