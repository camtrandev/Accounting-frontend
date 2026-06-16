<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" class="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-message">{{ message }}</p>
      <p class="modal-submessage">Hành động này không thể hoàn tác.</p>

      <div class="modal-actions">
        <button class="btn-cancel" @click="close">Hủy bỏ</button>
        <button :class="['btn-confirm', confirmColorClass]" @click="confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Xác nhận?'
  },
  message: {
    type: String,
    default: 'Bạn có chắc chắn muốn thực hiện hành động này?'
  },
  confirmText: {
    type: String,
    default: 'Xác nhận'
  },
  // Nhận class màu sắc (ví dụ: 'btn-danger' cho Huỷ, 'btn-success' cho Duyệt)
  confirmColorClass: {
    type: String,
    default: 'btn-danger'
  }
});

const emit = defineEmits(['close', 'confirm']);

const close = () => {
  emit('close');
};

const confirm = () => {
  emit('confirm');
};
</script>

<style scoped>
/* Nền đen mờ phủ toàn màn hình */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Hộp thoại nội dung */
.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 32px 24px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Icon */
.icon-container {
  margin-bottom: 16px;
}
.warning-icon {
  width: 48px;
  height: 48px;
  color: #ef4444; /* Màu đỏ cảnh báo */
}

/* Text */
.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 12px 0;
}
.modal-message {
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 8px 0;
}
.modal-submessage {
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 24px 0;
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* CSS cho các nút bấm */
button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-confirm {
  color: #fff;
}
/* Màu Đỏ cho nút Huỷ */
.btn-danger {
  background-color: #ef4444;
}
.btn-danger:hover {
  background-color: #dc2626;
}
/* Màu Xanh cho nút Duyệt */
.btn-success {
  background-color: #10b981;
}
.btn-success:hover {
  background-color: #059669;
}
</style>