<template>
  <div class="card-list">

    <StatCard
      v-for="item in cards"
      :key="item.title"
      v-bind="item"
    />

  </div>
</template>

<script setup>
import StatCard from "./StatCard.vue"

const cards = [

  {
    title: "Tổng doanh thu",
    value: "1.250.000.000 đ",
    change: "+12.5% so với tháng trước",
    trend: "up",
    color: "blue",
    icon: "📊"
  },

  {
    title: "Tổng chi phí",
    value: "850.000.000 đ",
    change: "-8.2% so với tháng trước",
    trend: "down",
    color: "green",
    icon: "📉"
  },

  {
    title: "Lợi nhuận",
    value: "400.000.000 đ",
    change: "+25.3% so với tháng trước",
    trend: "up",
    color: "yellow",
    icon: "💰"
  },

  {
    title: "Tổng tài sản",
    value: "5.750.000.000 đ",
    change: "+5.7% so với tháng trước",
    trend: "up",
    color: "purple",
    icon: "🏦"
  },

  {
    title: "Tiền mặt",
    value: "1.230.000.000 đ",
    change: "+3.1% so với tháng trước",
    trend: "up",
    color: "green",
    icon: "💵"
  }

]
</script>

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