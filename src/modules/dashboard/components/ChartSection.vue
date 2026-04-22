<template>
  <div class="chart-section">

    <div class="left">

      <RevenueLineChart />

    </div>

    <div class="right">

      <RevenuePieChart />

    </div>

  </div>
</template>

<script setup>

import RevenueLineChart
from "./RevenueLineChart.vue"

import RevenuePieChart
from "./RevenuePieChart.vue"

</script>

<style scoped>

.chart-section {

  display: grid;

  grid-template-columns: 2fr 1fr;

  gap: 16px;

  padding: 0 24px 20px;
}

/* Responsive */

@media (max-width: 1200px) {

  .chart-section {

    grid-template-columns: 1fr;
  }

}

</style>