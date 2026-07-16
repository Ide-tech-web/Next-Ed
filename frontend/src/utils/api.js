// API Configuration and Axios Instance

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
  logout: (refreshToken) => api.post('/logout/', { refresh_token: refreshToken }),
  getProfile: () => api.get('/profile/'),
  googleLogin: (credential) => api.post('/auth/google/', { credential }),
  requestPasswordReset: (email) => api.post('/password-reset/', { email }),
  confirmPasswordReset: (data) => api.post('/password-reset-confirm/', data),
  changePassword: (data) => api.put('/change-password/', data),
};

// Course APIs
export const courseAPI = {
  getAll: (params) => api.get('/courses/', { params }),
  getById: (id) => api.get(`/courses/${id}/`),
  getMaterials: (id) => api.get(`/courses/${id}/materials/`),
  create: (data) => api.post('/courses/', data),
  update: (id, data) => api.put(`/courses/${id}/`, data),
  delete: (id) => api.delete(`/courses/${id}/`),
};

// Note APIs
export const noteAPI = {
  getAll: (params) => api.get('/notes/', { params }),
  create: (data) => {
    return api.post('/notes/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/notes/${id}/`),
};

// Exercise APIs
export const exerciseAPI = {
  getAll: (params) => api.get('/exercises/', { params }),
  create: (data) => {
     return api.post('/exercises/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/exercises/${id}/`),
};

// Exam APIs
export const examAPI = {
  getAll: (params) => api.get('/exams/', { params }),
  create: (data) => {
     return api.post('/exams/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/exams/${id}/`),
};

// Correction APIs
export const correctionAPI = {
  getAll: (params) => api.get('/corrections/', { params }),
  create: (data) => {
     return api.post('/corrections/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Progress APIs
export const progressAPI = {
  getMyProgress: () => api.get('/progress/'),
  markComplete: (lessonId) => api.post('/progress/', { lesson: lessonId, completed: true }),
  update: (id, data) => api.patch(`/progress/${id}/`, data),
};

// Question APIs
export const questionAPI = {
  getMyQuestions: (params) => api.get('/questions/', { params }),
  getAllQuestions: (params) => api.get('/questions/', { params }),
  create: (data) => api.post('/questions/', data),
  getById: (id) => api.get(`/questions/${id}/`),
};

// Response APIs
export const responseAPI = {
  getByQuestion: (questionId) => api.get('/responses/', { params: { question: questionId } }),
  create: (data) => api.post('/responses/', data),
};

// Lesson APIs
export const lessonAPI = {
  getAll: (params) => api.get('/lessons/', { params }),
  create: (data) => api.post('/lessons/', data),
  update: (id, data) => api.put(`/lessons/${id}/`, data),
  delete: (id) => api.delete(`/lessons/${id}/`),
};

// Admin Management APIs (Admin-only)
export const adminAPI = {
  getUsers: (params) => api.get('/admin-management/', { params }),
  getStudents: () => api.get('/admin-management/', { params: { role: 'STUDENT' } }),
  getStaff: () => api.get('/admin-management/', { params: { role__in: 'DELEGATE,ADMIN' } }),
  createStaff: (data) => api.post('/admin-management/', data),
  getUserDetail: (id) => api.get(`/admin-management/${id}/`),
  deleteUser: (id) => api.delete(`/admin-management/${id}/`),
};

export default api;
