import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

export default function StudentsPage() {
  const { students, tasks } = useApp();
  const navigate = useNavigate();

  const getStudentStats = (studentId) => {
    const assigned = tasks.filter(t => t.assignedTo.includes(studentId));
    return {
      total: assigned.length,
      completed: assigned.filter(t => t.status === "Completed").length,
      pending: assigned.filter(t => t.status === "Pending").length,
      inProgress: assigned.filter(t => t.status === "In Progress").length,
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground text-sm mt-1">View and manage all students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => {
            const stats = getStudentStats(student.id);
            const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            return (
              <button
                key={student.id}
                onClick={() => navigate(`/students/${student.id}`)}
                className="task-card text-left w-full group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                  <FiChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex gap-3 text-xs">
                  <span className="status-completed px-2 py-0.5 rounded-full">{stats.completed} Done</span>
                  <span className="status-in-progress px-2 py-0.5 rounded-full">{stats.inProgress} Active</span>
                  <span className="status-pending px-2 py-0.5 rounded-full">{stats.pending} Pending</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
