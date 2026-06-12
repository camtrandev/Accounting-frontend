<template>
  <div class="document-toolbar">
    <div class="left-content">
      <div class="page-title">
        <h2>Quản lý chứng từ</h2>
        <p>Danh sách toàn bộ hóa đơn, phiếu thu, phiếu chi từ hệ thống</p>
      </div>
    </div>

    <div class="header-actions">
      <button v-if="isAdmin && pendingCount > 0" class="btn-notification-approve" @click="$emit('open-approval')">
        <i class="fas fa-bell animate-swing"></i>
        Bạn có <strong>{{ pendingCount }}</strong> chứng từ cần duyệt
      </button>

      <button class="btn-secondary" @click="$emit('export')" title="Xuất danh sách ra file Excel">
        <span class="icon">📊</span> Xuất Excel
      </button>

    </div>
  </div>
</template>

<script setup>
// 1. Khai báo Props để nhận dữ liệu từ DocumentPage.vue
defineProps({
  isAdmin: {
    type: Boolean,
    default: false
  },
  pendingCount: {
    type: Number,
    default: 0
  }
});

// 2. Khai báo các sự kiện bắn ngược lại cho cha
defineEmits(['create', 'export', 'open-approval']);
</script>

<style scoped>
.document-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.page-title h2 {
  margin: 0 0 4px 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
}

.page-title p {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Nút thông báo duyệt (Màu Cam/Vàng nổi bật) */
.btn-notification-approve {
  background-color: #fff7ed;
  color: #c2410c;
  border: 1px solid #fdba74;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.btn-notification-approve:hover {
  background-color: #ffedd5;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-notification-approve strong {
  background: #f97316;
  color: white;
  padding: 2px 8px;
  border-radius: 99px;
  margin: 0 2px;
}

/* Hiệu ứng rung chuông */
.animate-swing {
  animation: swing 2s infinite;
  transform-origin: top center;
}

@keyframes swing {
  0% {
    transform: rotate(0);
  }

  10% {
    transform: rotate(10deg);
  }

  20% {
    transform: rotate(-10deg);
  }

  30% {
    transform: rotate(6deg);
  }

  40% {
    transform: rotate(-6deg);
  }

  50% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(0);
  }
}

.btn-secondary {
  background-color: #fff;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f7fafc;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.icon {
  font-size: 16px;
}
</style>