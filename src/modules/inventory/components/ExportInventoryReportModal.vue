<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Xuất báo cáo tổng hợp tồn kho</h3>
        <button class="close-btn" @click="handleClose"><i class="fas fa-times"></i></button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Từ ngày <span class="required">*</span></label>
          <input type="date" v-model="formData.fromDate" class="form-control" />
        </div>
        <div class="form-group">
          <label>Đến ngày <span class="required">*</span></label>
          <input type="date" v-model="formData.toDate" class="form-control" />
        </div>
        <div class="form-group">
          <label>Kho hàng</label>
          <select v-model="formData.warehouseId" class="form-control">
            <option :value="null">-- Tất cả kho --</option>
            <option v-for="w in warehouseList" :key="w.id" :value="w.id">{{ w.name }}</option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-outline" @click="handleClose">Hủy</button>
        <button class="btn-primary" @click="submitExport">
          <i class="fas fa-file-excel"></i> Xác nhận tải
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  warehouseList: { type: Array, default: () => [] }
})

// Khai báo thêm sự kiện 'confirmExport' để ném dữ liệu form lên
const emit = defineEmits(['close', 'confirmExport'])

const formData = reactive({
  fromDate: '',
  toDate: '',
  warehouseId: null
})

const handleClose = () => {
  formData.fromDate = ''
  formData.toDate = ''
  formData.warehouseId = null
  emit('close')
}

const submitExport = () => {
  if (!formData.fromDate || !formData.toDate) {
    alert("Vui lòng chọn đầy đủ Từ ngày và Đến ngày!")
    return
  }
  if (formData.fromDate > formData.toDate) {
    alert("Từ ngày không được lớn hơn Đến ngày!")
    return
  }
  
  // KHÔNG gọi axios ở đây. Bắn dữ liệu (fromDate, toDate, warehouseId) lên component cha
  emit('confirmExport', { ...formData })
}
</script>

<style scoped>
/* CSS cho Modal căn giữa màn hình */
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
  z-index: 1000;
}

.modal-container {
  background: #fff;
  width: 450px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #888;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.required {
  color: red;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50; /* Màu xanh chủ đạo của nút */
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Kế thừa class css bạn đang có hoặc bổ sung */
.btn-outline {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  padding: 8px 16px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:disabled, .btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>