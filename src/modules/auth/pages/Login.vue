<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
    await authStore.login(username.value, password.value);
    const redirectUrl = authStore.returnUrl || '/';
    router.push(redirectUrl);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Sai Tên đăng nhập hoặc Mật khẩu!';
    } else {
      errorMessage.value = 'Mất kết nối đến máy chủ. Vui lòng thử lại.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card-container">
      <div class="login-card">
        <div class="logo-area">
          <div class="logo-wrapper">
            <img src="../../../assets/Image/image-Photoroom.png" alt="Logo" class="system-logo" />
          </div>
          <h1 class="system-title">ĐĂNG NHẬP</h1>
          <p class="subtitle">HỆ THỐNG PHẦN MỀM KẾ TOÁN</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-field">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <input
              v-model="username"
              type="text"
              placeholder="Tên đăng nhập"
              required
              :disabled="isLoading"
              autocomplete="username"
            />
          </div>

          <div class="input-field">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input
              v-model="password"
              type="password"
              placeholder="Mật khẩu"
              required
              :disabled="isLoading"
              autocomplete="current-password"
            />
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" :disabled="isLoading">
              <span class="checkmark"></span>
              Ghi nhớ đăng nhập
            </label>
            <a href="#" class="forgot-link">Quên mật khẩu?</a>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-login" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>ĐĂNG NHẬP</span>
          </button>
        </form>

        <div class="account-info-footer">
          <p>Hệ thống nội bộ - Vui lòng liên hệ Quản trị viên nếu mất tài khoản.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-color: #6366f1; /* Tím Indigo đồng bộ với nút menu Active trên Dashboard */
  --primary-hover: #4f46e5;
  --bg-page: #f8fafc;       /* Nền xám sáng nhẹ của Dashboard */
  --text-main: #1e293b;     /* Màu chữ đen xám đậm */
  --text-muted: #64748b;    /* Màu phụ */
  --border-color: #e2e8f0;  /* Màu viền nhẹ tinh tế */
}

.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, sans-serif;
  position: relative;
  color: #1e293b;
}

.login-card-container {
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.login-card {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  
  /* Đổ bóng dịch mạnh sang X và Y (35px, 30px và 65px, 50px) */
  /* Làm cho bóng sâu hơn bằng cách giảm độ âm của spread-radius và tăng blur + opacity */
  box-shadow: 
    /* Bóng tiếp xúc nhỏ để tạo cảm giác contact */
    8px 8px 20px rgba(0, 0, 0, 0.03),
    /* Bóng sâu chính 1: xâu và đậm hơn hẳn (-5px thay vì -10px, opacity 0.22) */
    35px 30px 70px -5px rgba(15, 23, 42, 0.22),
    /* Bóng sâu chính 2: lan tỏa sâu nhất (-10px thay vì -15px, blur 120px, opacity 0.18) */
    65px 50px 120px -10px rgba(15, 23, 42, 0.18);
    
  text-align: center;
}
/* Khu vực Logo & Tiêu đề */
.logo-area {
  margin-bottom: 35px;
}

.logo-wrapper {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
}

.system-logo {
  max-height: 60px;
  object-fit: contain;
}

.system-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 6px 0 0 0;
  color: #64748b;
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 500;
}

/* Form xử lý */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-field {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  pointer-events: none;
  color: #94a3b8;
  transition: color 0.2s;
}

.input-field input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #1e293b;
  transition: all 0.2s;
}

.input-field input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.input-field input:focus + .input-icon {
  color: #6366f1;
}

.input-field input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Lựa chọn ghi nhớ / quên mk */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #475569;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding-left: 22px;
  user-select: none;
}

.remember-me input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 1px; left: 0;
  height: 16px; width: 16px;
  background-color: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  transition: all 0.15s;
}

.remember-me:hover input ~ .checkmark {
  border-color: #6366f1;
}

.remember-me input:checked ~ .checkmark {
  background-color: #6366f1;
  border-color: #6366f1;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px; top: 1px;
  width: 4px; height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked ~ .checkmark:after {
  display: block;
}

.forgot-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Thông báo lỗi */
.error-message {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #fee2e2;
  text-align: left;
}

/* Nút bấm chuyên nghiệp */
.btn-login {
  background-color: #6366f1;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  letter-spacing: 0.5px;
}

.btn-login:hover:not(:disabled) {
  background-color: #4f46e5;
}

.btn-login:disabled {
  opacity: 0.6;
  background-color: #94a3b8;
  cursor: not-allowed;
}

/* Hiệu ứng loading quay */
.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Chân trang */
.account-info-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}
</style>