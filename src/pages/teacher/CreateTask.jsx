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

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create New Task</h2>
          <p className="text-muted-foreground text-sm mt-1">Assign a new task to students.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the task requirements"
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Assign To</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {students.map(student => (
                <label
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={assignedTo.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {student.avatar}
                    </div>
                    <span className="text-sm text-foreground">{student.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <FiCheck size={16} />
              Create Task
            </button>
            <button
              type="button"
              onClick={() => navigate("/manage-tasks")}
              className="px-6 py-2.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
