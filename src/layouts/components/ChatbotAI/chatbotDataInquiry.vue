<script setup>
import { ref, watch, nextTick } from 'vue'
import imgBotBlue from '@/assets/Image/imgBotBlue.png'

// hiệu ứng loading dữ liệu chưa có
const isLoading = ref(false)

const emit = defineEmits(['hide', 'close'])

const inputText = ref('')
const chatBodyRef = ref(null)

// State quản lý lịch sử chat RIÊNG của bot này
const messages = ref([
  { role: 'bot', text: 'Chào sếp! Tôi là Trợ lý Dữ liệu. Sếp muốn xem báo cáo doanh thu hay chi phí hôm nay?' }
])

watch(messages, async () => {
  await nextTick()
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}, { deep: true })

const handleSend = async () => {
  if (!inputText.value.trim() || isLoading.value) return
  
  const userText = inputText.value
  inputText.value = ''
  
  // 1. Lưu câu hỏi của user vào giao diện
  messages.value.push({ role: 'user', text: userText })
  
  // Bật trạng thái Loading để hiện 3 dấu chấm
  isLoading.value = true
  scrollToBottom() // Cuộn xuống để nhìn thấy hiệu ứng loading

  try {
    // 2. GỌI API THẬT BẰNG AXIOS Ở ĐÂY (Sẽ hướng dẫn ở Phần 2)
    // Code Fake API Tạm thời để test hiệu ứng Loading:
    await new Promise(resolve => setTimeout(resolve, 2000)) // Giả vờ đợi backend xử lý 2s
    
    const fakeApiResponse = `Theo Thông tư 200, nghiệp vụ "${userText}" được hạch toán vào...`
    
    // 3. Có kết quả thì đẩy vào mảng tin nhắn
    messages.value.push({ 
      role: 'bot', 
      text: fakeApiResponse 
    })
  } catch (error) {
    // Xử lý lỗi nếu gọi API thất bại (Sẽ làm ở Phần 2)
    messages.value.push({ role: 'bot', text: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.' })
  } finally {
    // Dù thành công hay thất bại cũng phải tắt Loading
    isLoading.value = false
    scrollToBottom()
  }
}


const handleClear = () => {
  messages.value = [{ role: 'bot', text: 'Chào sếp! Tôi là Trợ lý Dữ liệu.' }]
  emit('close')
}
</script>

<template>
  <div class="chat-window point-to-bot2">
    <div class="chat-header">
      <div class="bot-info">
        <img :src="imgBotBlue" class="avatar" />
        <span class="bot-name">Trợ lý Dữ liệu (Báo cáo/Truy vấn)</span>
      </div>
      <div class="chat-actions">
        <button @click="emit('hide')" title="Tạm ẩn">-</button>
        <button @click="handleClear" title="Xóa lịch sử & Đóng">×</button>
      </div>
    </div>

    <div class="chat-body" ref="chatBodyRef">
      <div v-for="(msg, index) in messages" :key="index" class="message-wrapper" :class="msg.role">
        <div class="message-bubble">{{ msg.text }}</div>
      </div>

      <div v-if="isLoading" class="message-wrapper bot">
        <div class="message-bubble typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <div class="chat-footer">
      <input v-model="inputText" @keyup.enter="handleSend" type="text" placeholder="Hỏi doanh thu, công nợ..." />
      <button @click="handleSend" class="send-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  position: fixed;
  right: 95px;
  bottom: 20px;
  width: 450px;
  height: 65vh;
  min-height: 400px;
  max-height: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  z-index: 9999;
}

.chat-window::after {
  content: '';
  position: absolute;
  right: -12px;
  border-width: 12px 0 12px 12px;
  border-style: solid;
  border-color: transparent transparent transparent #ffffff;
  filter: drop-shadow(4px 0px 2px rgba(0,0,0,0.05));
}

.chat-window.point-to-bot1::after { 
  bottom: 85px; 
}
.chat-window.point-to-bot2::after { 
  bottom: 15px; 
}

.chat-header {
  padding: 15px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bot-info .avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.bot-info .bot-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.chat-actions button {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.2s;
}

.chat-actions button:hover {
  color: #ef4444;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fdfdfd;
}

.message-wrapper {
  display: flex;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.bot {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.message-wrapper.user .message-bubble {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 2px;
}

.message-wrapper.bot .message-bubble {
  background: #e2e8f0;
  color: #1e293b;
  border-bottom-left-radius: 2px;
}

.chat-footer {
  padding: 12px 15px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 10px;
  background: white;
  border-radius: 0 0 16px 16px;
  align-items: center;
}

.chat-footer input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.chat-footer input:focus {
  border-color: #3b82f6;
}

.chat-footer .send-btn {
  background: #3b82f6;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-footer .send-btn svg {
  width: 16px;
  height: 16px;
}


/*HIỆU ỨNG TYPING 3 DẤU CHẤM (LOADING)  */

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px !important; /* Ghi đè padding mặc định của bong bóng chat */
  min-height: 15px;
}

.typing-indicator span {
  display: block;
  width: 6px;
  height: 6px;
  background-color: #64748b; /* Màu xám nhạt */
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  } 
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  .chat-window {
    right: 15px;
    bottom: 95px;
    width: calc(100vw - 30px);
    height: 60vh;
  }

  .chat-window::after {
    right: 22px;
    bottom: -11px !important;
    border-width: 12px 12px 0 12px;
    border-color: #ffffff transparent transparent transparent;
  }
}


</style>