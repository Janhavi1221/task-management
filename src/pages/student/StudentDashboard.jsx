import { useState } from "react";
import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import { FiClock, FiSend, FiMessageCircle } from "react-icons/fi";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { user, tasks, updateTaskStatus, addComment, searchQuery, filterStatus, setFilterStatus, filterPriority, setFilterPriority } = useApp();
  const [openComments, setOpenComments] = useState(null);
  const [commentText, setCommentText] = useState("");

  const myTasks = tasks.filter(t => t.assignedTo.includes(user?.id || "")).filter(t => {
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
          <div className="flex flex-col sm:flex-row gap-2">
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

        <div className="grid gap-4">
          {myTasks.map(task => (
            <div key={task.id} className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === "Completed" ? "status-completed" :
                      task.status === "In Progress" ? "status-in-progress" : "status-pending"
                    }`}>{task.status}</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === "High" ? "priority-high" :
                      task.priority === "Medium" ? "priority-medium" : "priority-low"
                    }`}>{task.priority}</span>
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2">{task.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FiClock size={12} />
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <select 
                    value={task.status} 
                    onChange={e => handleStatusChange(task.id, e.target.value)}
                    className={selectClass}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  
                  <button
                    onClick={() => setOpenComments(openComments === task.id ? null : task.id)}
                    className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle size={14} />
                    Comments ({task.comments.length})
                  </button>
                </div>
              </div>

              {openComments === task.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-3 mb-3">
                    {task.comments.map(comment => (
                      <div key={comment.id} className="bg-muted rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-card-foreground">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                      onKeyPress={e => e.key === 'Enter' && handleAddComment(task.id)}
                    />
                    <button
                      onClick={() => handleAddComment(task.id)}
                      className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <FiSend size={14} />
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
