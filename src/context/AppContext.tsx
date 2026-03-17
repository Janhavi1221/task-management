import React, { createContext, useContext, useState, useCallback } from "react";
import { initialStudents, initialTasks } from "@/data/mockData";

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [students] = useState(initialStudents);
  const [tasks, setTasks] = useState(initialTasks);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const login = useCallback((name, role) => {
    const studentMatch = role === "student" ? students.find(s => s.name.toLowerCase() === name.toLowerCase()) : null;
    setUser({
      id: studentMatch ? studentMatch.id : "teacher1",
      name: studentMatch ? studentMatch.name : name,
      role,
    });
  }, [students]);

  const logout = useCallback(() => setUser(null), []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  }, []);

  const addTask = useCallback((task) => {
    const now = new Date().toISOString();
    setTasks(prev => [...prev, {
      ...task,
      id: "t" + Date.now(),
      comments: [],
      createdAt: now,
      updatedAt: now,
    }]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTaskStatus = useCallback((taskId, status) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  }, []);

  const addComment = useCallback((taskId, text) => {
    if (!user) return;
    const comment = {
      id: "c" + Date.now(),
      taskId,
      userId: user.id,
      userName: user.name,
      text,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, comment], updatedAt: new Date().toISOString() } : t));
  }, [user]);

  return (
    <AppContext.Provider value={{
      user, login, logout, students, tasks,
      addTask, updateTask, deleteTask, updateTaskStatus, addComment,
      darkMode, toggleDarkMode,
      searchQuery, setSearchQuery, filterStatus, setFilterStatus, filterPriority, setFilterPriority,
    }}>
      {children}
    </AppContext.Provider>
  );
};
