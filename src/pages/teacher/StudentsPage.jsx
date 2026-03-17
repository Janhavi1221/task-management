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
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted rounded-lg p-2">
                    <p className="text-lg font-semibold text-card-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="bg-muted rounded-lg p-2">
                    <p className="text-lg font-semibold text-success">{stats.completed}</p>
                    <p className="text-xs text-muted-foreground">Done</p>
                  </div>
                  <div className="bg-muted rounded-lg p-2">
                    <p className="text-lg font-semibold text-warning">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
