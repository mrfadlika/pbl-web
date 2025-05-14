import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Tambahkan withCredentials untuk mendukung cookies dalam permintaan cross-origin
  withCredentials: true
});

// Add token to authenticated requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Hilangkan Content-Type saat mengirim FormData, biarkan browser mengaturnya
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangkap dan log error
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Log error secara detail untuk debugging
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Items API
export const itemsApi = {
  getAll: (params = {}) => apiClient.get('/items', { params }),
  getById: (id) => apiClient.get(`/items/${id}`),
  create: (formData) => {
    const config = {
      headers: {
        // Content-Type dihapus agar browser mengatur boundary untuk multipart/form-data
      },
    };
    return apiClient.post('/items', formData, config);
  },
  update: (id, formData) => {
    const config = {
      headers: {
        // Content-Type dihapus agar browser mengatur boundary untuk multipart/form-data
      },
    };
    return apiClient.put(`/items/${id}`, formData, config);
  },
  delete: (id) => apiClient.delete(`/items/${id}`),
};

// Reports API
export const reportsApi = {
  getAll: (params = {}) => apiClient.get('/reports', { params }),
  getById: (id) => apiClient.get(`/reports/${id}`),
  create: (formData) => {
    const config = {
      headers: {
        // Content-Type dihapus agar browser mengatur boundary untuk multipart/form-data
      },
    };
    return apiClient.post('/reports', formData, config);
  },
  update: (id, formData) => apiClient.put(`/reports/${id}`, formData),
  toggleAdminReview: (id) => apiClient.patch(`/reports/${id}/admin-review`),
  delete: (id) => apiClient.delete(`/reports/${id}`),
};

// Admin API
export const adminApi = {
  login: (credentials) => apiClient.post('/admin/login', credentials),
  logout: () => apiClient.post('/admin/logout'),
  getReports: (params = {}) => apiClient.get('/admin/reports', { params }),
  verifyReport: (id) => apiClient.patch(`/admin/reports/${id}/verify`),
  rejectReport: (id) => apiClient.patch(`/admin/reports/${id}/reject`),
  getDashboardStats: () => apiClient.get('/admin/dashboard'),
  createAdmin: (data) => apiClient.post('/admin/create', data),
};

export default {
  items: itemsApi,
  reports: reportsApi,
  admin: adminApi,
}; 