import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import { FiArrowLeft, FiClock } from "react-icons/fi";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, tasks } = useApp();

  const student = students.find(s => (s._id && s._id.toString() === id) || (s.id && s.id.toString() === id));
  const studentTasks = tasks.filter(t => {
    // Check if this student is in assignedTo array
    const isAssignedToStudent = t.assignedTo.some(assignedUser => 
      (assignedUser._id && assignedUser._id.toString() === id) || 
      (assignedUser.id && assignedUser.id.toString() === id)
    );
    return isAssignedToStudent;
  });

  if (!student) return <DashboardLayout><p className="text-muted-foreground">Student not found.</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button onClick={() => navigate("/students")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <FiArrowLeft /> Back to Students
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
            {student.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          {studentTasks.length === 0 && <p className="text-muted-foreground text-sm">No tasks assigned.</p>}
          {studentTasks.map(task => (
            <div key={task._id} className={`task-card ${task.status === "Completed" ? "border-l-4 border-l-success" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-card-foreground">{task.title}</h4>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  task.status === "Completed" ? "status-completed" :
                  task.status === "In Progress" ? "status-in-progress" : "status-pending"
                }`}>{task.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className={`px-2 py-0.5 rounded-full ${
                  task.priority === "High" ? "priority-high" : task.priority === "Medium" ? "priority-medium" : "priority-low"
                }`}>{task.priority} Priority</span>
                <span className="flex items-center gap-1"><FiClock size={12} /> Updated {new Date(task.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
