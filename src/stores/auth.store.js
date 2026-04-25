
import { defineStore } from 'pinia';
import axios from 'axios';

// Thay cổng 7081 bằng đúng cổng chạy .NET của bạn nhé
const API_URL = 'https://localhost:7047/api/auth/';

// Hàm giải mã JWT Token (Không cần cài thêm thư viện)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    returnUrl: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    // Trả về role, nếu không có thì mặc định là Viewer
    userRole: (state) => state.user?.role || 'Viewer', 
  },

  actions: {
    async login(username, password) {
      try {
        const response = await axios.post(API_URL + 'login', { username, password });
        const responseData = response.data;

        if (responseData.success && responseData.data?.token) {
          const token = responseData.data.token;
          const decodedToken = parseJwt(token);
          
          // Debug xem decodedToken có gì nếu bạn chưa chắc chắn các key
          // console.log('Decoded JWT:', decodedToken);

          const userInfo = {
            // Sử dụng Optional Chaining để tránh crash nếu key không tồn tại
            username: decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            role: decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            userId: decodedToken?.['UserId'] || decodedToken?.['nameid'] // Thường .NET dùng nameid cho UserId
          };

          this.token = token;
          this.user = userInfo;

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userInfo));

          return true;
        } else {
          throw new Error(responseData.message || "Đăng nhập thất bại!");
        }
      } catch (error) {
        // Nếu lỗi 401 hoặc lỗi kết nối, đừng logout ngay lập tức nếu đang ở trang login
        // Chỉ cần throw error để UI hiển thị thông báo
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Có thể thêm: router.push('/login') nếu bạn muốn logout cứng từ store
    }
  }
});