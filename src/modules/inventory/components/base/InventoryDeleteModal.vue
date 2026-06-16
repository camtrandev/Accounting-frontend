<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content animate-pop-in">
      
      <div class="modal-header">
        <div class="icon-wrapper bg-red-100">
          <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
        </div>
        <h3 class="modal-title">Cảnh báo xóa dữ liệu Kho</h3>
      </div>

      <div class="modal-body">
        <p class="main-message">
          Bạn đang yêu cầu xóa vĩnh viễn chứng từ số 
          <span class="highlight-voucher">{{ voucherNumber || 'Không xác định' }}</span>.
        </p>
        
        <div class="alert-box">
          <i class="fas fa-info-circle info-icon"></i>
          <div class="alert-text">
            <strong>Lưu ý nghiêm ngặt:</strong>
            <p>Hành động này sẽ gỡ bỏ toàn bộ dòng hàng hóa thuộc chứng từ này khỏi hệ thống. Thao tác này <b>tuyệt đối không thể hoàn tác</b>!</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="emit('close')">
          Quay lại
        </button>
        <button class="btn btn-delete" @click="emit('confirm')">
          <i class="fas fa-trash-alt"></i> Đồng ý xóa
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
  voucherNumber: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);
</script>

<style scoped>
/* Lớp mờ nền */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

/* Khung nội dung chính */
.modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

/* Hiệu ứng nảy lên mượt mà */
.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes popIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Căn chỉnh Header */
.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px 10px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

/* Căn chỉnh Body */
.modal-body {
  padding: 0 24px 24px;
  text-align: center;
}

.main-message {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 20px;
  line-height: 1.5;
}

.highlight-voucher {
  color: #dc2626;
  font-weight: 700;
  background-color: #fee2e2;
  padding: 2px 8px;
  border-radius: 4px;
}

/* Hộp cảnh báo nghiệp vụ */
.alert-box {
  background-color: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  text-align: left;
}

.info-icon {
  color: #f59e0b;
  font-size: 1.25rem;
  margin-right: 12px;
  margin-top: 2px;
}

.alert-text {
  font-size: 0.875rem;
  color: #92400e;
}

.alert-text strong {
  display: block;
  margin-bottom: 4px;
  color: #b45309;
}

.alert-text p {
  margin: 0;
}

/* Căn chỉnh Footer (Nút bấm) */
.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
}

.btn {
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
}

.btn-delete {
  background-color: #dc2626;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);
}

.btn-delete:hover {
  background-color: #b91c1c;
}

.btn-delete i {
  margin-right: 8px;
}

/* Tiện ích text color nền của icon */
.bg-red-100 { background-color: #fee2e2; }
.text-red-600 { color: #dc2626; }
</style>