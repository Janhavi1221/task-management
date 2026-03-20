const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || `HTTP ${response.status}: ${response.statusText}`;
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  signup: (userData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getMe: () => apiRequest('/auth/me'),
};

// Users API
export const usersAPI = {
  getStudents: () => apiRequest('/users/students'),
  getStudentById: (id) => apiRequest(`/users/students/${id}`),
  createStudent: (studentData) => apiRequest('/users/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),
  deleteStudent: (id) => apiRequest(`/users/students/${id}`, {
    method: 'DELETE',
  }),
};

// Tasks API
export const tasksAPI = {
  getTasks: () => apiRequest('/tasks'),
  getTask: (id) => apiRequest(`/tasks/${id}`),
  createTask: (taskData) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  updateTask: (id, taskData) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  }),
  deleteTask: (id) => apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  }),
  addComment: (id, comment) => apiRequest(`/tasks/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  }),
};
