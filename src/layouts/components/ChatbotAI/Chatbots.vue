<script setup>
import { ref } from 'vue'
import ChatbotAsk from './chatbotAsk.vue'
import imgBotGreen from '@/assets/Image/imgBotGreen.jpg'

// State quản lý việc mở/đóng chatbot
const isChatOpen = ref(false)

// State quản lý việc hiển thị icon bot
const isIconsVisible = ref(true)

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}

const hideChat = () => {
  isChatOpen.value = false
}

// Hàm xử lý ẩn/hiện cụm icon
const toggleIcons = () => {
  isIconsVisible.value = !isIconsVisible.value
  // Tự động đóng cửa sổ chat nếu người dùng chọn ẩn icon
  if (!isIconsVisible.value) {
    hideChat()
  }
}
</script>

<template>
  <div class="global-chatbots">

    <transition name="fade-slide">
      <ChatbotAsk v-show="isChatOpen" @hide="hideChat" @close="hideChat" />
    </transition>

    <div class="bot-controls">

      <button class="toggle-visibility-btn" @click="toggleIcons"
        :title="isIconsVisible ? 'Ẩn Chatbot' : 'Hiện Chatbot'">
        {{ isIconsVisible ? '✖' : '💬' }}
      </button>

      <transition name="fade-slide">
        <div v-show="isIconsVisible" class="bot-icons-container">
          <div class="bot-trigger" @click="toggleChat">
            <img :src="imgBotGreen" alt="Bot Kế toán" />
            <div v-if="isChatOpen" class="active-indicator"></div>
          </div>
        </div>
      </transition>

    </div>

  </div>
</template>

<style scoped>
/* CSS cho Icon ở góc */
.global-chatbots {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* Flexbox để sắp xếp nút toggle và cụm icon theo chiều dọc */
.bot-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Căn giữa nút toggle với icon */
  gap: 10px;
}

/* Style cho nút ẩn/hiện */
.toggle-visibility-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 10;
  font-size: 12px;
}

.toggle-visibility-btn:hover {
  background-color: #f3f4f6;
  transform: scale(1.1);
  color: #374151;
}

.bot-icons-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bot-trigger {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  position: relative;
  background: white;
  border: 2px solid white;
}

.bot-trigger:hover {
  transform: scale(1.1);
}

.bot-trigger img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.active-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 15px;
  background-color: #22c55e;
  border-radius: 50%;
  border: 2px solid white;
}

/* Hiệu ứng trượt cho cửa sổ chat và cụm icon */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
</style>