import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authAPI, usersAPI, tasksAPI } from "../lib/api";

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
}

interface AppContextType {
  user: User | null;
  login: (name: string, role: string) => Promise<void>;
  logout: () => void;
  students: any[];
  tasks: any[];
  loading: boolean;
  addTask: (task: any) => Promise<void>;
  updateTask: (id: string, updates: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  fetchStudents: () => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [loading, setLoading] = useState(false);

  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchStudents();
      fetchTasks();
    }
  }, [user]);

  const fetchStudents = useCallback(async () => {
    if (user?.role === 'teacher') {
      try {
        const response = await usersAPI.getStudents();
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    }
  }, [user]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, []);

  const login = useCallback(async (name: string, role: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ name, role });
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setStudents([]);
    setTasks([]);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  }, []);

  const addTask = useCallback(async (task: any) => {
    try {
      const response = await tasksAPI.createTask(task);
      setTasks(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: any) => {
    try {
      const response = await tasksAPI.updateTask(id, updates);
      setTasks(prev => prev.map(t => t._id === id ? response.data : t));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await tasksAPI.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error;
    }
  }, [updateTask]);

  const addComment = useCallback(async (taskId: string, text: string) => {
    try {
      const response = await tasksAPI.addComment(taskId, { text });
      setTasks(prev => prev.map(t => t._id === taskId ? response.data : t));
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout, students, tasks, loading,
      addTask, updateTask, deleteTask, updateTaskStatus, addComment,
      darkMode, toggleDarkMode,
      searchQuery, setSearchQuery, filterStatus, setFilterStatus, filterPriority, setFilterPriority,
      fetchStudents, fetchTasks,
    }}>
      {children}
    </AppContext.Provider>
  );
};
