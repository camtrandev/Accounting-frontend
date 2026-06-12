<template>
  <div class="card chart-card">
    <div class="card-header">
      <h3>Dòng tiền</h3>
      <select v-model="selectedYear" @change="fetchData">
        <option :value="2026">Năm 2026</option>
        <option :value="2025">Năm 2025</option>
      </select>
    </div>

    <div v-if="dashboardStore.isLoading" class="loading-state">
      Đang tải biểu đồ...
    </div>

    <div v-else class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useDashboardStore } from "../../store/dashboardStore"
import { Bar } from "vue-chartjs"
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js"

// Phải register BarElement cho biểu đồ cột
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

const dashboardStore = useDashboardStore()
const selectedYear = ref(2026)

const fetchData = () => {
  dashboardStore.fetchAllDashboardData(null, selectedYear.value)
}

/* MAP DATA VÀO COMBO CHART */
const chartData = computed(() => {
  const rawData = dashboardStore.cashFlowChart || []

  const cashIn = rawData.map(item => item.cashIn || 0)
  const cashOut = rawData.map(item => item.cashOut || 0)
  const netCashFlow = rawData.map(item => item.netCashFlow || 0)

  return {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        type: "line", // Biến dataset này thành biểu đồ đường
        label: "Dòng tiền thuần",
        data: netCashFlow,
        borderColor: "#3b82f6", // Xanh dương
        backgroundColor: "#ffffff", // Điểm nối màu trắng
        borderWidth: 2,
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4, // Tạo độ cong mượt mà
        order: 1 // Hiển thị đè lên trên cột
      },
      {
        type: "bar",
        label: "Tiền thu",
        data: cashIn,
        backgroundColor: "#22c55e", // Xanh lá
        borderRadius: 2,
        order: 2
      },
      {
        type: "bar",
        label: "Tiền chi",
        data: cashOut,
        backgroundColor: "#ef4444", // Đỏ
        borderRadius: 2,
        order: 3
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'center',
      labels: { usePointStyle: true, boxWidth: 8 }
    }
  },
  scales: {
    y: {
      title: { display: true, text: "Triệu đồng" },
      ticks: {
        // Thu gọn số 0 cho đẹp trên trục Y
        callback: function (value) {
          return value / 1000000;
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Điều chỉnh height theo UI */
.loading-state {
  text-align: center;
  color: #999;
  padding: 50px 0;
}
</style>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

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
}

select {
  font-family: "Times New Roman", Times, serif;
  background-color: #f3f4f6;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  outline: none;
  cursor: pointer;
}

.chart-container {
  position: relative;
  height: 320px;
  /* Cố định chiều cao cho chart */
  width: 100%;
}
</style>