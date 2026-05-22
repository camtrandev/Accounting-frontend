<template>
  <div class="filter-wrapper">
    <div class="search-group">
      <div class="input-icon">
        <i class="fas fa-search"></i>
        <input v-model="filterParams.searchText" type="text" placeholder="Tìm theo số chứng từ, đối tượng..."
          @keyup.enter="handleSearch" />
      </div>
    </div>

    <div class="filter-actions">
      <select v-model="filterParams.period" class="select-box" @change="handleSearch">
        <option value="last_7_days">7 ngày qua</option>
        <option value="last_31_days">31 ngày qua</option>
        <option value="last_month">Tháng trước</option>
        <option value="last_3_months">3 tháng trước</option>
        <option value="this_year">Năm nay</option>
      </select>

      <select v-model="filterParams.voucherType" class="select-box" @change="handleSearch">
        <option value="">Tất cả chứng từ</option>
        <option value="receipt">Phiếu Nhập kho</option>
        <option value="issue">Phiếu Xuất kho</option>
        <option value="transfer">Phiếu Chuyển kho</option>
      </select>

      <button class="btn-outline" @click="resetFilter" title="Xóa bộ lọc">
        <i class="fas fa-undo"></i> Đặt lại
      </button>

      <button class="btn-primary" @click="handleSearch">
        Lọc dữ liệu
      </button>

      <button class="btn-export" @click="isExportModalOpen = true" title="Tải báo cáo Excel">
        <i class="fas fa-file-excel"></i> Xuất Excel
      </button>
    </div>

    <ExportInventoryReportModal :isOpen="isExportModalOpen" :warehouseList="warehouses"
      @close="isExportModalOpen = false" @confirmExport="handleConfirmExport" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import ExportInventoryReportModal from './ExportInventoryReportModal.vue'
import { useInventoryStore } from '../store/inventory.store'


const inventoryStore = useInventoryStore()
// Chỉ giữ lại emit search vì logic export hiện do Modal đảm nhiệm gọi API
const emit = defineEmits(['search', 'export'])

// Quản lý trạng thái đóng/mở form
const isExportModalOpen = ref(false)

const warehouses = computed(() => inventoryStore.warehouses)

// Hàm này chạy khi bấm "Xác nhận tải" ở Modal
const handleConfirmExport = (formDataFromModal) => {
  isExportModalOpen.value = false; // Đóng modal đi
  emit('export', formDataFromModal); // Bắn dữ liệu lên Dashboard
}

// Hàm hỗ trợ format ngày chuẩn YYYY-MM-DD để gửi xuống Backend API
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Hàm tính toán khoảng thời gian
const getDateRange = (period) => {
  const today = new Date()
  let fromDate = new Date()
  let toDate = new Date() // Mặc định toDate là hôm nay

  switch (period) {
    case 'last_7_days':
      fromDate.setDate(today.getDate() - 7)
      break
    case 'last_31_days':
      fromDate.setDate(today.getDate() - 31)
      break
    case 'last_month':
      // Ngày đầu tiên của tháng trước
      fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      // Ngày cuối cùng của tháng trước (truyền 0 vào ngày của tháng hiện tại)
      toDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'last_3_months':
      // Tính lùi lại đúng 3 tháng từ ngày hôm nay
      fromDate.setMonth(today.getMonth() - 3)
      break
    case 'this_year':
      // Mùng 1 tháng 1 của năm nay
      fromDate = new Date(today.getFullYear(), 0, 1)
      break
    default:
      break
  }

  return {
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate)
  }
}

const filterParams = reactive({
  searchText: '',
  period: 'last_7_days',
  voucherType: ''
})

const handleSearch = () => {
  const dateRange = getDateRange(filterParams.period)
  
  emit('search', { 
    ...filterParams,
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate
  })
}

const resetFilter = () => {
  filterParams.searchText = ''
  filterParams.period = 'last_7_days'
  filterParams.voucherType = ''
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

.btn-export {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  height: 40px;
  cursor: pointer;
  font-weight: 500;
}

.btn-export:hover {
  opacity: 0.9;
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

.btn-primary:hover {
  background-color: #6d28d9;
}

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

.btn-outline:hover {
  background-color: #f3f4f6;
}
</style>