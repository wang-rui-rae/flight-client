import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// request interceptors
http.interceptors.request.use(
  (config) => {
    // add tokens
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptors
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // eror process
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = 'Bad reqeust - please reset';
          break;
        case 401:
          error.message = 'Unauthorized - please login';
          // localStorage.removeItem('authToken');
          // window.location.href = '/login';
          break;
        case 403:
          error.message = 'Forbidden';
          break;
        case 404:
          error.message = `Resource not found: ${error.response.config.url}`;
          break;
        case 500:
          error.message = 'Internal Server Error';
          break;
        default:
          error.message = `Unknown error occurred ${error.response.status}`;
      } 
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default http;