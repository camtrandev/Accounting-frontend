1. MainLayout.vue (Chuẩn hoàn chỉnh)
<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import AppContainer from './components/AppContainer.vue'
import Chatbots from './components/ChatbotAI/Chatbots.vue'

const isCollapse = ref(false)

const handleToggle = (value) => {
  isCollapse.value = value
}
</script>

<template>
  <div class="layout" :class="{ collapse: isCollapse }">
    <Sidebar @toggle="handleToggle" />

    <div class="main">
      <Topbar />
      <div class="style_container">
        <AppContainer>
        <router-view />
      </AppContainer>
      </div>
      
    </div>
    <Chatbots />
  </div>
</template>

<style scoped>

.layout {
  --sidebar-width: 220px;
  display: flex;
  background: #f8fafc;
  min-height: 100vh;
  width: 100vw; /* Đảm bảo layout không bao giờ vượt quá 100% màn hình */
  overflow-x: hidden; /* Khóa cuộn ngang */
}



.main {
  margin-left: var(--sidebar-width);
  /* SỬA LỖI Ở ĐÂY: Chiều rộng = 100% trừ đi độ rộng của Sidebar */
  width: calc(100% - var(--sidebar-width)); 
  min-height: 100vh;
  /* Giảm padding xuống 24px cho vừa vặn ở zoom 100% */
  padding: 24px; 
  /* Đẩy nội dung xuống 80px để không bị Topbar (cao 60px) đè lên */
  padding-top: 80px; 
  transition: 0.3s;
}

.layout.collapse{
  --sidebar-width:80px;
}

.style_container {
  margin-left: 10px;
}

</style>