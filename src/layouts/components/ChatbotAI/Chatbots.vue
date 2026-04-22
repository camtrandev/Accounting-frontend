<script setup>
import { ref } from 'vue'
import ChatbotAsk from './chatbotAsk.vue'
import ChatbotDataInquiry from './chatbotDataInquiry.vue'

import imgBotGreen from '@/assets/Image/imgBotGreen.jpg'
import imgBotBlue from '@/assets/Image/imgBotBlue.png'

// State quản lý việc bot nào đang mở: 'ask', 'data', hoặc null
const activeBot = ref(null)

const toggleChat = (botType) => {
  activeBot.value = activeBot.value === botType ? null : botType
}

const hideChat = () => {
  activeBot.value = null
}
</script>

<template>
  <div class="global-chatbots">
    
    <transition name="fade-slide">
      <ChatbotAsk 
        v-show="activeBot === 'ask'" 
        @hide="hideChat" 
        @close="hideChat" 
      />
    </transition>

    <transition name="fade-slide">
      <ChatbotDataInquiry 
        v-show="activeBot === 'data'" 
        @hide="hideChat" 
        @close="hideChat" 
      />
    </transition>

    <div class="bot-icons-container">
      <div class="bot-trigger" @click="toggleChat('ask')">
        <img :src="imgBotGreen" alt="Bot Kế toán" />
        <div v-if="activeBot === 'ask'" class="active-indicator"></div>
      </div>
      
      <div class="bot-trigger" @click="toggleChat('data')">
        <img :src="imgBotBlue" alt="Bot Dữ liệu" />
        <div v-if="activeBot === 'data'" class="active-indicator"></div>
      </div>
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

.bot-icons-container { display: flex; flex-direction: column; gap: 15px; }
.bot-trigger {
  width: 60px; height: 60px; border-radius: 50%; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s;
  position: relative; background: white; border: 2px solid white;
}
.bot-trigger:hover { transform: scale(1.1); }
.bot-trigger img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

.active-indicator {
  position: absolute; top: 0; right: 0; width: 15px; height: 15px;
  background-color: #22c55e; border-radius: 50%; border: 2px solid white;
}

/* Hiệu ứng trượt */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateX(20px) scale(0.95); }
</style>