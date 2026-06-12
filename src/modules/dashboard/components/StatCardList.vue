<template>
  <div class="card-list">
    <div v-if="dashboardStore.isLoading" class="loading-state">
      Đang tải dữ liệu...
    </div>

    <StatCard
      v-else
      v-for="item in cards"
      :key="item.title"
      v-bind="item"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import StatCard from "./StatCard.vue"
import { useDashboardStore } from "../store/dashboardStore.js"
// Khởi tạo store
const dashboardStore = useDashboardStore()

// Hàm helper format tiền tệ (VD: 1.250.000 đ)
const formatCurrency = (value) => {
  if (!value) return "0 đ"
  return new Intl.NumberFormat('vi-VN').format(value) + " đ"
}

// Hàm helper format phần trăm (VD: +12.5% hoặc -8.2%)
const formatChange = (percent) => {
  if (percent === 0 || !percent) return "0% so với tháng trước"
  const sign = percent > 0 ? "+" : ""
  return `${sign}${percent}% so với tháng trước`
}

// Computed property để tự động cập nhật cards khi dữ liệu trong store thay đổi
const cards = computed(() => {
  const kpis = dashboardStore.kpis

  return [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(kpis.totalRevenue?.value),
      change: formatChange(kpis.totalRevenue?.percentageChange),
      trend: kpis.totalRevenue?.percentageChange >= 0 ? "up" : "down",
      color: "blue",
      icon: "📊"
    },
    {
      title: "Tổng chi phí",
      value: formatCurrency(kpis.totalExpense?.value),
      change: formatChange(kpis.totalExpense?.percentageChange),
      trend: kpis.totalExpense?.percentageChange >= 0 ? "up" : "down", 
      color: "green", // Chú ý: trong file gốc của bạn màu nền là green
      icon: "📉"
    },
    {
      title: "Lợi nhuận",
      value: formatCurrency(kpis.profit?.value),
      change: formatChange(kpis.profit?.percentageChange),
      trend: kpis.profit?.percentageChange >= 0 ? "up" : "down",
      color: "yellow",
      icon: "💰"
    },
    {
      title: "Tổng tài sản",
      value: formatCurrency(kpis.totalAssets?.value),
      change: formatChange(kpis.totalAssets?.percentageChange),
      trend: kpis.totalAssets?.percentageChange >= 0 ? "up" : "down",
      color: "purple",
      icon: "🏦"
    },
    {
      title: "Tiền mặt",
      value: formatCurrency(kpis.cash?.value),
      change: formatChange(kpis.cash?.percentageChange),
      trend: kpis.cash?.percentageChange >= 0 ? "up" : "down",
      color: "green",
      icon: "💵"
    }
  ]
})

// Gọi API ngay khi component được mounted
onMounted(() => {
  // Bạn có thể truyền month, year vào đây nếu màn hình có bộ lọc thời gian. 
  // Để trống thì API tự động lấy tháng/năm hiện tại theo thiết kế Backend
  dashboardStore.fetchAllDashboardData()
})
</script>

<style scoped>
/* Giữ nguyên CSS cũ của bạn cho .card-list */
.loading-state {
  text-align: center;
  color: #666;
  padding: 20px;
  width: 100%;
}
</style>
<style scoped>

.card-list {

  display: grid;

  grid-template-columns: repeat(5, 1fr);

  gap: 16px;

  padding: 0 24px 20px;
  margin-top: 15px;
}

/* Responsive */

@media (max-width: 1200px) {
  .card-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>