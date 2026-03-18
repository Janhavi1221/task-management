const API_BASE_URL = (globalThis as any).VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  login: (credentials: { name: string; role: string }) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getMe: () => apiRequest('/auth/me'),
};

// Users API
export const usersAPI = {
  getStudents: () => apiRequest('/users/students'),
  getStudentById: (id: string) => apiRequest(`/users/students/${id}`),
  createStudent: (studentData: { name: string; email: string }) => apiRequest('/users/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),
};

// Tasks API
export const tasksAPI = {
  getTasks: () => apiRequest('/tasks'),
  getTask: (id: string) => apiRequest(`/tasks/${id}`),
  createTask: (taskData: any) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  updateTask: (id: string, taskData: any) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  }),
  deleteTask: (id: string) => apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  }),
  addComment: (id: string, comment: { text: string }) => apiRequest(`/tasks/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  }),
};
