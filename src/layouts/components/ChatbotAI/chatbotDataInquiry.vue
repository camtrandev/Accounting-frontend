<script setup>
import { ref, watch, nextTick } from 'vue'
import imgBotBlue from '@/assets/Image/imgBotBlue.png'
import axios from 'axios'

const isLoading = ref(false)

// Thiết lập timeout 4 phút cho tất cả các request dùng axios
axios.defaults.timeout = 240000;

const emit = defineEmits(['hide', 'close'])

const inputText = ref('')
const chatBodyRef = ref(null)

// State quản lý lịch sử chat RIÊNG của bot này
const messages = ref([
  { role: 'bot', text: 'Chào sếp! Tôi là Trợ lý Dữ liệu. Sếp muốn xem báo cáo doanh thu hay chi phí hôm nay?' }
])

// Tự động cuộn xuống cuối khi có tin nhắn mới
watch(messages, async () => {
  await nextTick()
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}, { deep: true })

const scrollToBottom = async () => {
  await nextTick()
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}

const handleSend = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userText = inputText.value.trim()
  inputText.value = ''

  // 1. Lưu câu hỏi của user vào giao diện
  messages.value.push({ role: 'user', text: userText })

  // Bật trạng thái Loading để hiện 3 dấu chấm
  isLoading.value = true
  scrollToBottom() // Cuộn xuống để nhìn thấy hiệu ứng loading

  try {
    // 2. GỌI API CHUẨN XÁC THEO SWAGGER MỚI (/query-data)
    const response = await axios.post('https://localhost:7047/api/Chat/query-data',
      {
        question: userText // Body chỉ truyền "question"
      },
      {
        headers: {
          'Content-Type': 'application/json', // Bắt buộc để tránh lỗi 415 từ .NET
          'Accept': 'application/json, text/plain, */*'
        }
      }
    )

    // 3. XỬ LÝ KẾT QUẢ THÀNH CÔNG (Tương thích cả trả về String hoặc Object)
    let botReply = '';

    if (typeof response.data === 'string') {
      botReply = response.data;
    } else if (typeof response.data === 'object' && response.data !== null) {
      botReply = response.data.answer || response.data.Answer || response.data.result || response.data.message || JSON.stringify(response.data);
    } else {
      botReply = "Không có dữ liệu trả về từ hệ thống.";
    }

    messages.value.push({
      role: 'bot',
      text: botReply
    })

  } catch (error) {
    console.error("Lỗi gọi AI:", error)

    // Xử lý lỗi linh hoạt, chặn crash app
    let errorMsg = '⚠️ Lỗi không xác định.';
    if (error.response && error.response.data) {
      errorMsg = typeof error.response.data === 'string'
        ? error.response.data
        : (error.response.data.message || error.response.data.title || JSON.stringify(error.response.data));

      if (typeof errorMsg === 'string' && errorMsg.includes("hạn mức sử dụng mô hình Pro")) {
        messages.value.push({
          role: 'bot',
          text: "⚠️ Bạn đã đạt đến hạn mức sử dụng mô hình Pro. Các câu trả lời sẽ sử dụng các mô hình khác cho đến khi hạn mức được đặt lại. Hãy nâng cấp để có hạn mức cao hơn."
        });
      }
      else if (typeof errorMsg === 'string' && errorMsg.includes("given key was not present in the dictionary")) {
        messages.value.push({
          role: 'bot',
          text: "⚠️ Hệ thống đang cấu hình lại API Key. Vui lòng thử lại sau giây lát!"
        });
      }
      else {
        messages.value.push({ role: 'bot', text: `⚠️ Lỗi từ server: Hệ thống đang quá tải hoặc gặp sự cố (${error.response.status}).` });
      }
    } else {
      messages.value.push({
        role: 'bot',
        text: '⚠️ Không thể kết nối đến Máy chủ AI. Vui lòng kiểm tra lại mạng hoặc API đang tắt.'
      })
    }
  } finally {
    // Dù thành công hay thất bại cũng phải tắt Loading
    isLoading.value = false
    scrollToBottom()
  }
}

const handleClear = () => {
  messages.value = [{ role: 'bot', text: 'Chào sếp! Tôi là Trợ lý Dữ liệu. Sếp muốn xem báo cáo doanh thu hay chi phí hôm nay?' }]
  emit('close')
}

// Hàm biến đổi text thô của AI thành HTML có format (In đậm, xuống dòng, v.v.)
const formatMessage = (text) => {
  if (!text) return '';

  let formatted = typeof text === 'string' ? text : JSON.stringify(text);

  // 1. Chuyển đổi xuống dòng thành thẻ <br>
  formatted = formatted.replace(/\n/g, '<br>');

  // 2. Chuyển đổi in đậm từ **text** thành <strong>text</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 3. Chuyển đổi gạch đầu dòng (Dấu * hoặc - đứng đầu dòng)
  formatted = formatted.replace(/(?:^|<br>)[*-]\s+(.*?)(?=<br>|$)/g, '<br>• $1');

  // 4. Highlight màu đỏ cho các từ khóa Kế toán/Thuế/Dữ liệu (Tuỳ chọn)
  const lawKeywords = /(Thông tư \d+(\/\d+\/TT-BTC)?|Điều \d+|Khoản \d+|Luật Quản lý thuế|VAS \d+|VSA \d+|Chuẩn mực \w+ \w+)/gi;
  formatted = formatted.replace(lawKeywords, '<span class="highlight-law">$&</span>');

  return formatted;
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

        <div v-if="msg.role === 'user'" class="message-bubble">{{ msg.text }}</div>

        <div v-else class="message-bubble bot-response" v-html="formatMessage(msg.text)"></div>

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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
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
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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
  filter: drop-shadow(4px 0px 2px rgba(0, 0, 0, 0.05));
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

/*HIỆU ỨNG TYPING 3 DẤU CHẤM (LOADING) */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px !important;
  min-height: 15px;
}

.typing-indicator span {
  display: block;
  width: 6px;
  height: 6px;
  background-color: #64748b;
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

  0%,
  80%,
  100% {
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

/* CSS FORMAT CHO VĂN BẢN AI TRẢ VỀ */
.bot-response :deep(strong) {
  color: #0f172a;
  font-weight: 700;
}

.bot-response :deep(.highlight-law) {
  color: #ef4444;
  font-weight: 600;
  background-color: #fee2e2;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #fca5a5;
  display: inline-block;
  margin: 2px 0;
}

.bot-response :deep(br) {
  content: "";
  display: block;
  margin-top: 8px;
}
</style>