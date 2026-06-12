<template>
  <div class="chart-card">
    <div class="card-header">
      <h3>Doanh thu - Chi phí - Lợi nhuận</h3>
      <select v-model="selectedYear" @change="fetchData">
        <option :value="2026">Năm 2026</option>
        <option :value="2025">Năm 2025</option>
      </select>
    </div>

    <div v-if="dashboardStore.isLoading" class="loading-state">
      Đang tải biểu đồ...
    </div>

    <div v-else class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useDashboardStore } from "../store/dashboardStore" // Đường dẫn store
import { Line } from "vue-chartjs"
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const dashboardStore = useDashboardStore()
const selectedYear = ref(2026)

// Hàm fetch dữ liệu khi đổi năm (Tùy chọn)
const fetchData = () => {
  dashboardStore.fetchAllDashboardData(null, selectedYear.value)
}

/* CHUYỂN ĐỔI DATA TỪ API SANG CHART.JS */
const chartData = computed(() => {
  const rawData = dashboardStore.revenueExpenseChart

  // Rút trích dữ liệu. Nếu chưa có data thì mảng rỗng
  const revenues = rawData.map(item => item.revenue || 0)
  const expenses = rawData.map(item => item.expense || 0)
  const profits = rawData.map(item => item.profit || 0)

  return {
    labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
    datasets: [
      {
        label: "Doanh thu",
        data: revenues,
        borderColor: "#2563eb",
        tension: 0.4
      },
      {
        label: "Chi phí",
        data: expenses,
        borderColor: "#dc2626",
        tension: 0.4
      },
      {
        label: "Lợi nhuận",
        data: profits,
        borderColor: "#16a34a",
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { bottom: 10 }
  }
}
</script>

<style scoped>
/* Giữ nguyên CSS cũ của bạn */
.loading-state { text-align: center; padding: 50px; color: #666; }
</style>

<style scoped>
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  height: 400px;
  
  /* Thêm Flexbox để kiểm soát chiều cao nội dung bên trong */
  display: flex;
  flex-direction: column;
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0; /* Đảm bảo header không bị ép nhỏ lại */
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0; /* Xóa margin mặc định của h3 để căn chỉnh chuẩn hơn */
  line-height: 32px; /* Căn giữa theo chiều dọc với thẻ select */
}

select {
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  padding: 0 8px;
}

/* Container bọc biểu đồ */
.chart-wrapper {
  position: relative; /* Yêu cầu bắt buộc của Chart.js khi maintainAspectRatio: false */
  flex-grow: 1; /* Cho phép biểu đồ chiếm toàn bộ phần chiều cao còn lại */
  min-height: 0; /* Ngăn chặn lỗi tràn layout trong Flexbox */
  width: 100%;
}
</style>