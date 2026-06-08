<script setup>
import DashboardToolbar from "../components/DashboardToolbar.vue"
import StatCardList from "../components/StatCardList.vue"
import ChartSection from "../components/ChartSection.vue"
import MiddleSection from "../components/Business_Insights/MiddleSection.vue"
import BottomSection from "../components/Business_Insights_footer/BottomSection.vue"
</script>

<template>
  <div class="dashboard-page">


    <!-- Toolbar -->
    <DashboardToolbar />


    <StatCardList />

    <ChartSection />

    <MiddleSection />

  </div>
</template>



<style scoped>
.dashboard-page {
  background: #f5f6f8;
  min-height: 100vh;
}
</style>
