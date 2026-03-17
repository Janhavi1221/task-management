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

  const getStudentNames = (ids) =>
    ids.map(id => students.find(s => s.id === id)?.name || "Unknown").join(", ");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manage Tasks</h2>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} task(s) found</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map(task => (
            <div key={task.id} className="bg-card rounded-xl border border-border p-5">
              {editingId === task.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                  <textarea
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                      <FiCheck size={14} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-accent transition-colors flex items-center gap-2">
                      <FiX size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
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
                      <span>Assigned to: {getStudentNames(task.assignedTo)}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 rounded-lg bg-muted border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 rounded-lg bg-muted border border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <FiTrash2 size={14} />
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
