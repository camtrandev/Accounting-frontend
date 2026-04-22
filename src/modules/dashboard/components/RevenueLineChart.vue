<template>
  <div class="chart-card">
    <div class="card-header">
      <h3>Doanh thu - Chi phí - Lợi nhuận</h3>
      <select>
        <option>Năm 2026</option>
      </select>
    </div>

    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
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

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

/* Data */
const chartData = {
  labels: [
    "T1","T2","T3","T4","T5","T6",
    "T7","T8","T9","T10","T11","T12"
  ],
  datasets: [
    {
      label: "Doanh thu",
      data: [700,850,900,1000,1100,1150, 1200,1180,1250,1300,1280,1350],
      borderColor: "#2563eb",
      tension: 0.4
    },
    {
      label: "Chi phí",
      data: [400,550,600,650,700,680, 720,750,800,850,820,900],
      borderColor: "#dc2626",
      tension: 0.4
    },
    {
      label: "Lợi nhuận",
      data: [100,150,180,220,250,240, 260,280,300,320,310,350],
      borderColor: "#16a34a",
      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: 10 // Thêm một chút khoảng trống ở đáy cho thoáng
    }
  }
}
</script>

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