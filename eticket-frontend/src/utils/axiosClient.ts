import axios from 'axios';

// Base URL cho API - lấy từ biến môi trường hoặc config
const API_URL = process.env.NEXT_PUBLIC_API || 'http://localhost:8080';

// Tạo instance axios với các cấu hình mặc định
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Luôn gửi cookies với mỗi request (JSESSIONID, access_token, etc.)
});

// Xử lý request trước khi gửi
axiosClient.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response trước khi trả về
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu trực tiếp
    return response;
  },
  (error) => {
    // Xử lý lỗi API
    const errorResponse = error.response;
    
    // Xử lý khi token hết hạn (401 Unauthorized)
    if (errorResponse?.status === 401) {
      console.log('Session expired or unauthorized');
      
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    
    // Xử lý khi không có quyền truy cập (403 Forbidden)
    if (errorResponse?.status === 403) {
      console.log('Forbidden - Access denied');
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
