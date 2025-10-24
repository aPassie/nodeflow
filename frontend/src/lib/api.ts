import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  signup: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/signup', data),
};

// User API
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// Task API
export const taskAPI = {
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id: string) => api.get(`/tasks/${id}`),
  createTask: (data: any) => api.post('/tasks', data),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
  updateTaskStatus: (id: string, data: any) => api.patch(`/tasks/${id}/status`, data),
  getDashboardData: () => api.get('/tasks/dashboard'),
};

// Report API
export const reportAPI = {
  downloadPDF: () => api.get('/reports/pdf', { responseType: 'blob' }),
  downloadExcel: () => api.get('/reports/excel', { responseType: 'blob' }),
};

export default api;
