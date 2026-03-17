import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";

export default function TrackProgress() {
  const { students, tasks } = useApp();

  // Flatten: one row per student-task pair
  const rows = tasks.flatMap(task =>
    task.assignedTo.map(studentId => {
      const student = students.find(s => s.id === studentId);
      const completion = task.status === "Completed" ? 100 : task.status === "In Progress" ? 50 : 0;
      return { taskId: task.id, studentName: student?.name || "Unknown", taskTitle: task.title, status: task.status, completion };
    })
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Track Progress</h2>
          <p className="text-muted-foreground text-sm mt-1">Monitor all student-task progress.</p>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Task</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Completion</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={`${row.taskId}-${row.studentName}-${i}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-card-foreground font-medium">{row.studentName}</td>
                    <td className="py-3 px-4 text-card-foreground">{row.taskTitle}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === "Completed" ? "status-completed" : row.status === "In Progress" ? "status-in-progress" : "status-pending"
                      }`}>{row.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${
                            row.completion === 100 ? "bg-success" : row.completion === 50 ? "bg-primary" : "bg-muted-foreground/30"
                          }`} style={{ width: `${row.completion}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{row.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
