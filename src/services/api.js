// src/services/api.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store.js';
import router from '@/router/index.js';

// 1. Khởi tạo một instance của Axios
const api = axios.create({
  // Đổi port này khớp với backend .NET của bạn nhé
  baseURL: 'https://localhost:7081/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. REQUEST INTERCEPTOR: Can thiệp trước khi gửi API đi
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    // Nếu có token trong store, tự động nhét vào Header Authorization
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR: Can thiệp khi API trả kết quả về
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu lỗi là 401 (Unauthorized) -> Token hết hạn hoặc không hợp lệ
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      
      // Xóa thông tin cũ
      authStore.logout();
      
      // Chuyển hướng người dùng về lại trang login
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;