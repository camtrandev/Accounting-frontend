<template>
  <div class="login-page bright-theme">
    <div class="background-overlay">
      <div class="grid-lines"></div>
      <div class="light-glow top"></div>
      <div class="light-glow bottom"></div>
    </div>

    <div class="ai-graphic">
      <div class="brain-glow"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" class="brain-icon"><path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8zm0 18v-2"></path><path d="M16 12a4 4 0 1 0-8 0v0"></path><path d="M12 10V6a2 2 0 1 0-4 0v1h2v3"></path><path d="M16 10v-3"></path></svg>
    </div>

    <div class="financial-widgets">
      <div class="widget widget-123">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <div class="text">123</div>
      </div>
      <div class="widget widget-calculator">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="16" y2="10"></line><line x1="12" y1="14" x2="16" y2="14"></line><line x1="12" y1="18" x2="16" y2="18"></line><line x1="8" y1="14" x2="8" y2="18"></line></svg>
        <div class="text">1.23</div>
      </div>
      <div class="widget widget-chart">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M8.5 7.5L3 13"></path><path d="M15.5 7.5l5.5 5.5"></path><path d="M12 10L16 6"></path><path d="M12 10L8 6"></path></svg>
        <div class="text">$ <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></div>
      </div>
      <div class="widget widget-dollar">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      </div>
    </div>

    <div class="login-card-container">
      <div class="login-card">
        <div class="logo-area">
          <div class="logo-chip">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line><line x1="12" y1="9" x2="12" y2="15"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line><line x1="19.07" y1="4.93" x2="17.66" y2="6.34"></line><line x1="6.34" y1="17.66" x2="4.93" y2="19.07"></line></svg>
          </div>
          <h1 class="system-title">ACCOUNTING <span class="light">SERVICES</span></h1>
          <p class="subtitle">S O F T W A R E</p>
        </div>

        <form @submit.prevent="handleLogin" class="cyber-form bright-form">
          <div class="input-field">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              required
              :disabled="isLoading"
              autocomplete="username"
            />
          </div>

          <div class="input-field">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              required
              :disabled="isLoading"
              autocomplete="current-password"
            />
          </div>

          <div class="form-options bright-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" :disabled="isLoading">
              <span class="checkmark"></span>
              Remember me
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <div v-if="errorMessage" class="cyber-error bright-error">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-cyber-login btn-bright-login" :disabled="isLoading">
            <span v-if="isLoading" class="cyber-spinner bright-spinner"></span>
            <span v-else>ĐĂNG NHẬP</span>
          </button>
        </form>

        <div class="account-info-footer bright-footer">
          <p>Tài khoản nội bộ - Vui lòng liên hệ Admin.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Import store (giữ nguyên relative path nếu chưa có alias)
import { useAuthStore } from '../../../stores/auth.store.js'; 

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    // Gọi hàm login từ store
    await authStore.login(username.value, password.value);
    
    // Nếu thành công, chuyển hướng
    const redirectUrl = authStore.returnUrl || '/';
    router.push(redirectUrl);
  } catch (error) {
    // Xử lý lỗi trả về từ .NET API
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Sai Username hoặc Password!';
    } else {
      errorMessage.value = 'Mất kết nối server. Vui lòng thử lại.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Màu chủ đạo Bright Theme */
:root {
  --primary-blue: #0066cc; /* Xanh tài chính đậm, chuyên nghiệp */
  --accent-blue: #667eea; /* Xanh icon nhạt */
  --light-bg: #f7fafc; /* Nền trắng xám nhạt */
  --card-bg: rgba(255, 255, 255, 0.85); /* Trắng mờ */
  --text-main: #1a202c; /* Đen xám đậm */
  --text-sub: #4a5568; /* Đen xám vừa */
  --text-gray: #a0aec0; /* Đen xám nhạt */
  --cyber-red: #d64545; /* Đỏ lỗi chuẩn */
}

/* Reset và cấu hình trang nền SÁNG */
.login-page.bright-theme {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7fafc; /* Nền trắng xám nhạt */
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  overflow: hidden;
  position: relative;
  color: #1a202c; /* Text tối */
}

/* Lớp nền tối với lưới và ánh sáng neon SÁNG */
.background-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
}

.grid-lines {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: linear-gradient(rgba(0, 102, 204, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 102, 204, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}

.light-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15; /* Giảm độ mờ */
}

.light-glow.top {
  top: -150px; left: -150px; width: 600px; height: 600px;
  background-color: #0077ff;
}

.light-glow.bottom {
  bottom: -150px; right: -150px; width: 600px; height: 600px;
  background-color: #e0f2fe;
}

/* Đồ họa AI mờ bên trái (SÁNG) */
.ai-graphic {
  position: absolute;
  left: 5%; top: 50%;
  transform: translateY(-50%);
  opacity: 0.3; /* Làm mờ hơn nh chút */
  z-index: 1;
}

.brain-icon {
  filter: none; /* Bỏ drop shadow neon */
}

.brain-glow {
  position: absolute;
  top: 40%; left: 45%;
  width: 50px; height: 50px;
  background-color: #ffd700;
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.4;
}

/* Widgets tài chính mờ bên phải (SÁNG) */
.financial-widgets {
  position: absolute;
  right: 5%; top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 30px;
  opacity: 0.25; /* Làm mờ */
  z-index: 1;
}

.widget {
  background-color: rgba(255, 255, 255, 0.6);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(0, 102, 204, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0066cc; /* Xanh đậm */
  font-weight: bold;
}

.widget .text {
  font-size: 18px;
}

/* Card đăng nhập Glassmorphism SÁNG */
.login-card-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.85); /* Nền trắng mờ */
  backdrop-filter: blur(15px); /* Hiệu ứng kính mờ */
  padding: 50px 40px;
  border-radius: 20px;
  border: 1px solid rgba(0, 102, 204, 0.1); /* Đường viền mờ màu xanh đậm nhạt */
  box-shadow: 0 10px 40px rgba(0, 50, 100, 0.08); /* Shadow mềm mại hơn */
  text-align: center;
}

/* Logo Area (SÁNG) */
.logo-area {
  margin-bottom: 40px;
}

.logo-chip {
  color: #0066cc; /* Xanh đậm */
  margin-bottom: 15px;
  display: inline-block;
  filter: none; /* Bỏ glow */
}

.system-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #1a202c; /* Text đen xám đậm */
  text-shadow: none;
}

.system-title .light {
  font-weight: 300;
  color: #718096; /* Text đen xám vừa */
}

.subtitle {
  margin: 5px 0 0 0;
  color: #718096; /* Text đen xám vừa */
  font-size: 14px;
  letter-spacing: 4px;
}

/* Form (SÁNG) */
.cyber-form.bright-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.input-field {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  pointer-events: none;
  transition: color 0.2s;
  color: #a0aec0; /* Icon đen xám nhạt */
}

.input-field input {
  width: 100%;
  padding: 16px 15px 16px 50px;
  background-color: #fff; /* Nền trắng sạch */
  border: 1px solid #e2e8f0; /* Viền xám nhạt chuẩn */
  border-radius: 8px;
  font-size: 16px;
  color: #1a202c; /* Text đen xám đậm */
  transition: all 0.2s;
}

.input-field input:focus {
  outline: none;
  border-color: #0066cc; /* Viền focus xanh đậm */
  box-shadow: 0 0 8px rgba(0, 102, 204, 0.1);
}

.input-field input:focus + .input-icon {
  color: #0066cc; /* Icon focus xanh đậm */
}

.input-field input:disabled {
  opacity: 0.6;
  background-color: #edf2f7; /* Nền disabled xám nhạt */
  cursor: not-allowed;
}

/* Form Options (SÁNG) */
.form-options.bright-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #4a5568; /* Text đen xám vừa */
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  padding-left: 25px;
  user-select: none;
}

.remember-me input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0; left: 0;
  height: 18px; width: 18px;
  background-color: #fff;
  border: 1px solid #cbd5e0; /* Viền xám nhạt */
  border-radius: 4px;
  transition: all 0.2s;
}

.remember-me:hover input ~ .checkmark {
  border-color: #0066cc;
}

.remember-me input:checked ~ .checkmark {
  background-color: #0066cc; /* Nền xanh đậm */
  border-color: #0066cc;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px; top: 2px;
  width: 5px; height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked ~ .checkmark:after {
  display: block;
}

.remember-me:disabled {
  opacity: 0.6;
}

.forgot-link {
  color: #4a5568; /* Text đen xám vừa */
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #0066cc; /* Text xanh đậm */
}

/* Error Message (SÁNG) */
.cyber-error.bright-error {
  color: #d64545; /* Đỏ lỗi chuẩn */
  background-color: rgba(214, 69, 69, 0.08); /* Nền đỏ lỗi mờ */
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid rgba(214, 69, 69, 0.15);
  text-shadow: none;
}

/* Button Cyber Login (SÁNG) */
.btn-cyber-login.btn-bright-login {
  background-color: #0066cc; /* Nền xanh đậm solid cho chuyên nghiệp */
  color: #fff; /* Text trắng */
  border: 1px solid #0066cc;
  padding: 16px;
  border-radius: 8px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
}

.btn-cyber-login.btn-bright-login:hover:not(:disabled) {
  background-color: #fff; /* Hover chuyển sang nền trắng */
  color: #0066cc; /* Hover text xanh đậm */
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.2);
}

.btn-cyber-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #cbd5e0;
  background-color: #cbd5e0;
  color: #fff;
  box-shadow: none;
}

/* Spinner (SÁNG) */
.cyber-spinner.bright-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff; /* Spinner trắng trên nền xanh button */
}

@keyframes cyber-spin {
  to { transform: rotate(360deg); }
}

/* Footer Info (SÁNG) */
.account-info-footer.bright-footer {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #a0aec0; /* Text đen xám nhạt */
  border-top: 1px solid rgba(160, 174, 192, 0.1);
  padding-top: 25px;
}
</style>