<template>
  <div class="middle-section">

    <TopCustomerCard />

    <TopSupplierCard />

    <CashFlowChart />

  </div>
</template>

<script setup>

import TopCustomerCard
from "./TopCustomerCard.vue"

import TopSupplierCard
from "./TopSupplierCard.vue"

import CashFlowChart
from "./CashFlowChart.vue"

</script>

<style scoped>

.middle-section {

  display: grid;

  grid-template-columns: 1fr 1fr 1.2fr;

  gap: 16px;

  padding: 0 24px 20px;
}

/* Responsive */

@media (max-width: 1200px) {

  .middle-section {

    grid-template-columns: 1fr;
  }

}

</style>