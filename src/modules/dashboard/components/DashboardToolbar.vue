<template>
  <div class="toolbar">
    
    <div class="left">
      <h1>Trang Chủ</h1>
      <p>Tổng quan tình hình hoạt động tài chính của doanh nghiệp</p>
    </div>

    <div class="right">
      <select class="month" v-model="selectedPeriod" @change="onPeriodChange">
        <option v-for="option in periodOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <button 
        class="export" 
        @click="handleExport" 
        :disabled="dashboardStore.isLoading"
      >
        <span v-if="dashboardStore.isLoading">Đang xử lý...</span>
        <span v-else>Xuất báo cáo</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '../store/dashboardStore' // Chú ý sửa lại đường dẫn theo project của bạn

const dashboardStore = useDashboardStore()

const periodOptions = ref([])
const selectedPeriod = ref("")

// Hàm tự động sinh danh sách tháng từ 2026 đến thời điểm hiện tại
const generatePeriods = () => {
  const options = []
  const startYear = 2026
  
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const endYear = Math.max(currentYear, startYear)

  for (let y = startYear; y <= endYear; y++) {
    for (let m = 1; m <= 12; m++) {
      // Dừng lại nếu vượt quá tháng hiện tại của năm nay
      if (y === currentYear && m > currentMonth) break;
      
      options.push({
        label: `Tháng ${m}, ${y}`,
        value: `${m}-${y}` // Lưu format "MM-YYYY"
      })
    }
  }
  
  // Đảo ngược mảng để tháng mới nhất nằm trên cùng
  return options.reverse()
}

onMounted(() => {
  periodOptions.value = generatePeriods()
  
  if (periodOptions.value.length > 0) {
    // Tự động chọn tháng mới nhất
    selectedPeriod.value = periodOptions.value[0].value
    // Gọi API lần đầu tiên khi vào trang
    onPeriodChange()
  }
})

// Trigger khi người dùng chọn tháng khác
const onPeriodChange = () => {
  if (!selectedPeriod.value) return
  const [m, y] = selectedPeriod.value.split('-')
  
  // Gọi Store đi fetch toàn bộ dữ liệu mới
  dashboardStore.fetchAllDashboardData(parseInt(m), parseInt(y))
}

// Trigger khi bấm xuất file Excel
const handleExport = () => {
  if (!selectedPeriod.value) return
  const [m, y] = selectedPeriod.value.split('-')
  
  // Gọi hàm download file
  dashboardStore.downloadDashboardReport(parseInt(m), parseInt(y))
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

/* Left */
.left h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.left p {
  font-size: 13px;
  color: #6b7280;
}

/* Right */
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Month */
.month {
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  outline: none;
  cursor: pointer;
}

/* Export */
.export {
  height: 36px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.export:hover {
  opacity: 0.9;
}

.export:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>