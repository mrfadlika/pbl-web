import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const STORAGE_URL = 'http://127.0.0.1:8000';

export const getStorageUrl = (path) => {
  if (!path) return '';
  
  if (path.startsWith('http')) return path;
  
  if (path.startsWith('/storage')) {
    return `${STORAGE_URL}${path}`;
  }
  
  return `${STORAGE_URL}/storage/${path}`;
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Mengaktifkan withCredentials untuk mendukung cookies dalam permintaan cross-origin
  withCredentials: false // Ubah dari true ke false untuk menghindari persyaratan CORS yang ketat
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
    // Menggunakan Promise dan XMLHttpRequest untuk menangani upload yang lebih baik
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Setup event handlers
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          resolve({
            data: JSON.parse(xhr.responseText),
            status: xhr.status,
            statusText: xhr.statusText
          });
        } else {
          // Error
          reject({
            response: {
              data: JSON.parse(xhr.responseText),
              status: xhr.status,
              headers: xhr.getAllResponseHeaders()
            }
          });
        }
      };
      
      xhr.onerror = function() {
        reject({
          message: 'Network Error',
          request: xhr
        });
      };
      
      // Setup request
      xhr.open('POST', `${API_URL}/items`, true);
      
      // Add headers
      xhr.setRequestHeader('Accept', 'application/json');
      
      // Log untuk debugging
      console.log("FormData yang akan dikirim:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Send request
      xhr.send(formData);
    });
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
  getStorageUrl,
}; 