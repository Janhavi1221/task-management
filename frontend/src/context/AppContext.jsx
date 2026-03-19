import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from 'sonner';
import { authAPI, usersAPI, tasksAPI } from "../lib/api";

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
        setStudents(response.data || response);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    }
  }, [user]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data || response);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    try {
      setLoading(true);
      const response = await authAPI.signup({ name, email, password, role });
      
      // Show success message
      toast.success(response.message || 'Signed up successfully');
      
      // Don't auto-login, just show success
      return response;
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (name, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ name, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      // Show success message
      toast.success(response.message || 'Logged in successfully');
      
      // Return the user data so the component can handle navigation
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed');
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

  const addTask = useCallback(async (task) => {
    try {
      const response = await tasksAPI.createTask(task);
      setTasks(prev => [...prev, (response.data || response)]);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const response = await tasksAPI.updateTask(id, updates);
      setTasks(prev => prev.map(t => t._id === id ? (response.data || response) : t));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksAPI.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error;
    }
  }, [updateTask]);

  const addComment = useCallback(async (taskId, text) => {
    try {
      const response = await tasksAPI.addComment(taskId, { text });
      setTasks(prev => prev.map(t => t._id === taskId ? (response.data || response) : t));
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user, signup, login, logout, students, tasks, loading,
      addTask, updateTask, deleteTask, updateTaskStatus, addComment,
      darkMode, toggleDarkMode,
      searchQuery, setSearchQuery, filterStatus, setFilterStatus, filterPriority, setFilterPriority,
      fetchStudents, fetchTasks,
    }}>
      {children}
    </AppContext.Provider>
  );
};
