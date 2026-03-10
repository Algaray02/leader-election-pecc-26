import axios from 'axios';

// Create a central axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle responses and unwrap the `data` envelope from our standardized response format
api.interceptors.response.use(
  (response) => {
    // Return standard response structure { data, meta } if available
    return response.data;
  },
  (error) => {
    // Standardize error handling
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(new Error(error.response.data.error.message || 'An error occurred'));
    }
    return Promise.reject(error);
  }
);

export default api;
