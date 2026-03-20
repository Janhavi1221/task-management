import { useState } from "react";
import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import { FiClock, FiSend, FiMessageCircle } from "react-icons/fi";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { user, tasks, updateTaskStatus, addComment, searchQuery, filterStatus, setFilterStatus, filterPriority, setFilterPriority } = useApp();
  const [openComments, setOpenComments] = useState(null);
  const [commentText, setCommentText] = useState("");

  const myTasks = tasks.filter(t => {
    // Check if current user is in assignedTo array (now populated with objects)
    const isAssignedToMe = t.assignedTo.some(assignedStudent => 
      (assignedStudent._id && assignedStudent._id.toString() === user?.id) || 
      (assignedStudent.id && assignedStudent.id.toString() === user?.id)
    );
    
    if (!isAssignedToMe) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== "All" && t.status !== filterStatus) return false;
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    return true;
  });

  const handleStatusChange = (taskId, status) => {
    updateTaskStatus(taskId, status);
    toast.success(`Task marked as ${status}`);
  };

  const handleAddComment = (taskId) => {
    if (!commentText.trim()) return;
    addComment(taskId, commentText);
    setCommentText("");
    toast.success("Comment added!");
  };

  const selectClass = "px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
            <p className="text-muted-foreground text-sm mt-1">{myTasks.length} task(s) assigned to you</p>
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectClass}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className={selectClass}>
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myTasks.map(task => (
            <div key={task._id} className={`task-card ${task.status === "Completed" ? "border-l-4 border-l-success" : ""}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-card-foreground">{task.title}</h4>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                  task.priority === "High" ? "priority-high" : task.priority === "Medium" ? "priority-medium" : "priority-low"
                }`}>{task.priority}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <FiClock size={12} />
                <span>Due: {task.dueDate}</span>
                <span className={`ml-auto px-2.5 py-0.5 rounded-full font-medium ${
                  task.status === "Completed" ? "status-completed" : task.status === "In Progress" ? "status-in-progress" : "status-pending"
                }`}>{task.status}</span>
              </div>

              {task.status !== "Completed" && (
                <div className="flex gap-2 mb-3">
                  {task.status !== "In Progress" && (
                    <button onClick={() => handleStatusChange(task._id, "In Progress")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      Mark In Progress
                    </button>
                  )}
                  <button onClick={() => handleStatusChange(task._id, "Completed")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-success/10 text-success hover:bg-success/20 transition-colors">
                    Mark Completed
                  </button>
                </div>
              )}

              <button onClick={() => setOpenComments(openComments === task._id ? null : task._id)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <FiMessageCircle size={13} />
                {task.comments.length} comment(s)
              </button>

              {openComments === task._id && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  {task.comments.map(c => (
                    <div key={c.id} className="bg-muted rounded-lg p-2.5">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-card-foreground">{c.userName}</span>
                        <span className="text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-card-foreground">{c.text}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                      onKeyDown={e => e.key === "Enter" && handleAddComment(task._id)}
                    />
                    <button onClick={() => handleAddComment(task._id)}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                      <FiSend size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {myTasks.length === 0 && <p className="text-center text-muted-foreground py-8">No tasks match your filters.</p>}
      </div>
    </DashboardLayout>
  );
}
