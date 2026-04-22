<template>
  <div class="filter-wrapper">
    <div class="search-group">
      <div class="input-icon">
        <i class="fas fa-search"></i>
        <input 
          v-model="filterParams.keyword" 
          type="text" 
          placeholder="Tìm theo số chứng từ, đối tượng..."
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="filter-actions">
      <select v-model="filterParams.period" class="select-box" @change="handleSearch">
        <option value="this_month">Tháng này</option>
        <option value="last_month">Tháng trước</option>
        <option value="this_year">Năm nay</option>
        <option value="custom">Tùy chọn...</option>
      </select>

      <select v-model="filterParams.voucherType" class="select-box" @change="handleSearch">
        <option value="all">Tất cả chứng từ</option>
        <option value="receipt">Phiếu Nhập kho</option>
        <option value="issue">Phiếu Xuất kho</option>
        <option value="transfer">Phiếu Chuyển kho</option>
      </select>

      <button class="btn-outline" @click="resetFilter">
        <i class="fas fa-undo"></i> Đặt lại
      </button>
      <button class="btn-primary" @click="handleSearch">
        Lọc dữ liệu
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

// Khai báo sự kiện (Emit) để báo cho component cha biết khi nào cần gọi API
const emit = defineEmits(['search'])

// Trạng thái bộ lọc nội bộ
const filterParams = reactive({
  keyword: '',
  period: 'this_month',
  voucherType: 'all'
})

// Hàm kích hoạt tìm kiếm
const handleSearch = () => {
  // Bắn dữ liệu (payload) lên cho cha
  emit('search', { ...filterParams })
}

// Hàm làm sạch bộ lọc
const resetFilter = () => {
  filterParams.keyword = ''
  filterParams.period = 'this_month'
  filterParams.voucherType = 'all'
  handleSearch()
}
</script>

<style scoped>
.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.search-group {
  flex-grow: 1;
  max-width: 400px;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon i {
  position: absolute;
  left: 12px;
  color: #9ca3af;
}

.input-icon input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 36px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.input-icon input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.select-box {
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0 12px;
  outline: none;
  background-color: white;
  cursor: pointer;
}

.select-box:focus {
  border-color: #7c3aed;
}

.btn-primary {
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  height: 40px;
  cursor: pointer;
  font-weight: 500;
}
.btn-primary:hover { background-color: #6d28d9; }

.btn-outline {
  background-color: transparent;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0 16px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-outline:hover { background-color: #f3f4f6; }
</style>