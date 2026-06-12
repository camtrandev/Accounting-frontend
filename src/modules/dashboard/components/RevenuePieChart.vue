<template>
  <div class="card">
    <div class="header">
      <h3>Cơ cấu doanh thu</h3>
      <select v-model="selectedYear" @change="fetchData">
        <option :value="2026">Năm 2026</option>
        <option :value="2025">Năm 2025</option>
      </select>
    </div>

    <div v-if="dashboardStore.isLoading" class="loading-state">
      Đang tải dữ liệu...
    </div>

    <div v-else class="body">
      <div class="chart">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>

      <div class="legend">
        <div class="item" v-for="(item, index) in dashboardStore.revenueStructure" :key="item.category">
          <span class="dot" :style="{ backgroundColor: colors[index % colors.length] }"></span>
          <div class="info">
            <p>{{ item.category }}</p>
            <span>{{ item.percentage }}% · {{ formatCurrency(item.amount) }}</span>
          </div>
        </div>
        
        <div v-if="dashboardStore.revenueStructure.length === 0" style="text-align:center; width: 100%; color: #999;">
          Chưa có dữ liệu doanh thu
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useDashboardStore } from "../store/dashboardStore"
import { Doughnut } from "vue-chartjs"
import { Chart, ArcElement, Tooltip } from "chart.js"

Chart.register(ArcElement, Tooltip)

const dashboardStore = useDashboardStore()
const selectedYear = ref(2026)

// Bảng màu cho Chart và Legend (Khớp với thiết kế)
const colors = ["#2563eb", "#16a34a", "#f59e0b", "#9333ea", "#ef4444"]

// Hàm helper format tiền (VD: 750.000.000 đ)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value) + " đ"
}

// Hàm fetch dữ liệu khi đổi năm (Tùy chọn)
const fetchData = () => {
  dashboardStore.fetchAllDashboardData(null, selectedYear.value)
}

/* CHUYỂN ĐỔI DATA TỪ API SANG VUE-CHARTJS */
const chartData = computed(() => {
  const rawData = dashboardStore.revenueStructure
  
  // Tách mảng Labels (Tên loại) và Data (Số phần trăm)
  const labels = rawData.map(item => item.category)
  const dataValues = rawData.map(item => item.percentage) // Vẽ theo tỷ lệ %

  return {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors.slice(0, dataValues.length), // Lấy số lượng màu khớp với số lượng data
        borderWidth: 0,
        spacing: 3
      }
    ]
  }
})

/* OPTIONS */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // Tắt legend mặc định vì đã tự code Legend đẹp hơn ở dưới
    tooltip: {
      enabled: true, // Nên bật tooltip để hover xem chi tiết
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
      }
    }
  }
}
</script>

<style scoped>
/* Giữ nguyên CSS cũ của bạn. Chỉ cần chắc chắn .dot có thể nhận backgroundColor inline */
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
.loading-state { text-align: center; padding: 50px; color: #666; width: 100%; }
</style>

<style scoped>
.card {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  height: 360px;
  padding-top: 50px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h3 {
  font-size: 16px;
  font-weight: 600;
}

/* BODY */
.body {
  display: flex;
  align-items: center;
  gap: 30px;
}

/* CHART */
.chart {
  width: 220px;
  height: 220px;
}

/* LEGEND */
.legend {
  flex: 1;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.blue {
  background: #2563eb;
}

.green {
  background: #16a34a;
}

.orange {
  background: #f59e0b;
}

.info p {
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

.info span {
  font-size: 13px;
  color: #6b7280;
}
</style>