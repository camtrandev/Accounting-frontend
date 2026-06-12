<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

const router = useRouter()
const authStore = useAuthStore()

// Lấy thông tin user linh động
const userName = computed(() => authStore.user?.username || 'Guest')
const userRole = computed(() => authStore.userRole || 'Viewer')
const avatarLetter = computed(() => userName.value.charAt(0).toUpperCase())

// Trạng thái mở/đóng Dropdown
const isDropdownOpen = ref(false)
const userMenuRef = ref(null) // Dùng để xác định vùng click chuột

// Hàm bật/tắt Dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Hàm Đóng dropdown khi click ra ngoài vùng userMenuRef
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Lắng nghe sự kiện click trên toàn trang khi component được tạo
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Hủy lắng nghe khi component bị hủy (tránh rò rỉ bộ nhớ)
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Hàm xử lý Đăng xuất
const handleLogout = () => {
  isDropdownOpen.value = false
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="header">
    <div class="logo">
      
    </div>

    <div class="search-box">
      <input type="text" placeholder="Tìm kiếm..." />
    </div>

    <div class="right">
      <div class="icon">
        🔔
        <span class="badge">3</span>
      </div>

      <div class="icon">
        ⚙️
      </div>

      <div class="user-menu-wrapper" ref="userMenuRef">

        <div class="user-trigger" @click="toggleDropdown">
          <div class="avatar">
            {{ avatarLetter }}
          </div>

          <div class="info">
            <div class="name">{{ userName }}</div>
            <div class="role">{{ userRole }}</div>
          </div>

          <svg class="chevron-icon" :class="{ 'is-open': isDropdownOpen }" xmlns="http://www.w3.org/2000/svg" width="16"
            height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <transition name="fade-slide">
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <div class="dropdown-item" @click="handleLogout">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Đăng xuất
            </div>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;


   background: linear-gradient(
    90deg,
    #e2ddf8 0%,
    #f2f2fc 40%,
    #ffffff 100%
  );
  border-bottom: 1px solid #e9e5ff;


  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  margin-left: calc(var(--sidebar-width) + 40px);
  transition: all 0.3s ease;
  z-index: 999;
}

.logo {
  width: 55px;
  height: 55px;

  background-image: url("../../assets/Image/image-Photoroom.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  margin-right: 4px;
  flex-shrink: 0;
}

.search-box {
  flex: 1;
}

.search-box input {
  width: 100%;
  max-width: 400px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon {
  position: relative;
  font-size: 18px;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: red;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 50%;
}

/* --- STYLE CHO DROPDOWN MENU --- */

.user-menu-wrapper {
  position: relative;
  /* Để dropdown box neo vào khối này */
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
  user-select: none;
}

.user-trigger:hover {
  background: #f3f4f6;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.name {
  font-size: 14px;
  font-weight: 600;
}

.role {
  font-size: 12px;
  color: #6b7280;
}

/* Mũi tên */
.chevron-icon {
  color: #6b7280;
  transition: transform 0.3s ease;
}

.chevron-icon.is-open {
  transform: rotate(180deg);
  /* Lật ngược mũi tên khi mở */
}

/* Khối Menu xổ xuống */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  /* Nằm cách khối cha 10px */
  right: 0;
  min-width: 160px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ef4444;
  /* Màu đỏ cho nút đăng xuất */
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #fee2e2;
  /* Nền đỏ nhạt khi hover */
}

/* Hiệu ứng trượt và mờ dần khi đóng/mở */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>