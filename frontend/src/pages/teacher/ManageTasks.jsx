import { useState } from "react";
import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import { FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { toast } from "sonner";

export default function ManageTasks() {
  const { tasks, students, updateTask, deleteTask, searchQuery, filterStatus, setFilterStatus, filterPriority, setFilterPriority } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const filtered = tasks.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== "All" && t.status !== filterStatus) return false;
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    return true;
  });

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDesc(t.description);
  };

  const saveEdit = () => {
    if (editingId) {
      updateTask(editingId, { title: editTitle, description: editDesc });
      setEditingId(null);
      toast.success("Task updated!");
    }
  };

  const handleDelete = (id) => {
    deleteTask(id);
    toast.success("Task deleted.");
  };

  const getStudentNames = (assignedStudents) =>
    assignedStudents.map(student => 
      student?.name || "Unknown"
    ).join(", ");

  const selectClass = "px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manage Tasks</h2>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} task(s) found</p>
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

        <div className="space-y-3">
          {filtered.map(task => (
            <div key={task._id} className="task-card">
              {editingId === task._id ? (
                <div className="space-y-3">
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                  <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm"><FiCheck size={14} /> Save</button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm"><FiX size={14} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-card-foreground">{task.title}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-4">
                      <button onClick={() => startEdit(task)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(task._id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><FiTrash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full font-medium ${
                      task.status === "Completed" ? "status-completed" : task.status === "In Progress" ? "status-in-progress" : "status-pending"
                    }`}>{task.status}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      task.priority === "High" ? "priority-high" : task.priority === "Medium" ? "priority-medium" : "priority-low"
                    }`}>{task.priority}</span>
                    <span className="text-muted-foreground">Due: {task.dueDate}</span>
                    <span className="text-muted-foreground">→ {getStudentNames(task.assignedTo)}</span>
                  </div>
                </>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No tasks match your filters.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
