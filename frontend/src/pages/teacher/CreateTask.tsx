import { useState } from "react";
import { useApp } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { toast } from "sonner";

export default function CreateTask() {
  const { students, addTask } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const toggleStudent = (id) => {
    setAssignedTo(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate || assignedTo.length === 0) {
      toast.error("Please fill all fields and assign to at least one student.");
      return;
    }
    addTask({ title, description, assignedTo, dueDate, priority, status: "Pending" });
    toast.success("Task created successfully!");
    navigate("/manage-tasks");
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create New Task</h2>
          <p className="text-muted-foreground text-sm mt-1">Assign a task to your students.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the task..." rows={3} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Assign to Students</label>
            <div className="flex flex-wrap gap-2">
              {students.map(s => (
                <button key={s.id} type="button" onClick={() => toggleStudent(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all border ${
                    assignedTo.includes(s.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                  }`}>
                  {assignedTo.includes(s.id) && <FiCheck size={14} />}
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className={inputClass}>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            Create Task
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
