
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
    // Lấy RoleName đã được giải mã
    userRole: (state) => state.user?.role || 'Viewer', 
  },

  actions: {
    async login(username, password) {
      try {
        // 1. Gọi API thẳng từ đây
        const response = await axios.post(API_URL + 'login', { username, password });
        
        // Dữ liệu Backend trả về nằm trong response.data
        const responseData = response.data;

        // 2. Map đúng cấu trúc Backend của bạn: responseData.data.token
        if (responseData.success && responseData.data && responseData.data.token) {
            const token = responseData.data.token;
            
            // 3. Giải mã JWT để lấy Username và Role (Claims từ .NET)
            const decodedToken = parseJwt(token);
            
            const userInfo = {
                username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                userId: decodedToken['UserId']
            };

            // 4. Lưu State
            this.token = token;
            this.user = userInfo;

            // 5. Lưu LocalStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userInfo));

            return true;
        } else {
            throw new Error("Dữ liệu trả về không hợp lệ!");
        }
      } catch (error) {
        this.logout();
        throw error; // Ném lỗi ra để Login.vue bắt và báo đỏ
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});