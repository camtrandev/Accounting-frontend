<template>
  <div class="card">
    <div class="card-header">
      <h3>
        Thông báo
        <span class="badge">{{ notifications.length }}</span>
      </h3>
      <a href="#" class="view-all">Xem tất cả</a>
    </div>

    <div class="list">
      <div 
        v-for="item in notifications" 
        :key="item.id" 
        :class="['item', item.type]"
      >
        <div class="icon">
          {{ item.iconChar }}
        </div>

        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
          <div class="time">{{ item.time }}</div>
        </div>

        <div class="action-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Sau này bạn chỉ cần gán: notifications.value = responseDataFromAPI
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    iconChar: '!',
    title: 'Hóa đơn quá hạn',
    desc: '5 hóa đơn chưa được thanh toán',
    time: '2 giờ trước'
  },
  {
    id: 2,
    type: 'info',
    iconChar: 'i',
    title: 'Công nợ đến hạn',
    desc: '3 khoản công nợ đến hạn trong hôm nay',
    time: '4 giờ trước'
  },
  {
    id: 3,
    type: 'success',
    iconChar: '✓',
    title: 'Báo cáo tháng',
    desc: 'Đã hoàn thành báo cáo tài chính tháng 4',
    time: '1 ngày trước'
  }
])
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h3 {
  font-family: "Times New Roman", Times, serif;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
}

.badge {
  background: #ef4444;
  color: white;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 8px;
}

.view-all {
  font-family: sans-serif;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

/* List - Chuyển sang Grid/Flex ngang */
.list {
  display: flex;
  gap: 16px; /* Khoảng cách giữa các thông báo */
}

.item {
  flex: 1; /* Chia đều không gian cho 3 khối */
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 8px;
  position: relative;
}

/* Icon */
.icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

/* Colors */
.warning { background: #fafafa; }
.warning .icon { background: #fb923c; color: white; }

.info { background: #fafafa; }
.info .icon { background: #3b82f6; color: white; }

.success { background: #fafafa; }
.success .icon { background: #10b981; color: white; }

.content {
  flex: 1;
  font-family: sans-serif;
}

.title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.desc {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
  line-height: 1.4;
}

.time {
  font-size: 11px;
  color: #9ca3af;
}

.action-icon {
  cursor: pointer;
  margin-top: 2px;
}
</style>