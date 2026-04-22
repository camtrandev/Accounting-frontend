<template>
  <div class="bottom-section">
    <div class="left">
      <NotificationCard />
    </div>
    <div class="right">
      <ExpenseRatioCard />
    </div>
  </div>
</template>

<script setup>
import NotificationCard from "./NotificationCard.vue"
import ExpenseRatioCard from "./ExpenseRatioCard.vue"
</script>

<style scoped>
.bottom-section {
  display: grid;
  /* Chia tỷ lệ: Thẻ thông báo chiếm 2.5 phần, tỷ lệ chi phí chiếm 1 phần */
  grid-template-columns: 2.5fr 1fr;
  gap: 24px;
  padding: 0 24px 30px;
  align-items: stretch; /* Đảm bảo 2 thẻ cao bằng nhau */
}

/* Responsive */
@media (max-width: 1200px) {
  .bottom-section {
    grid-template-columns: 1fr;
  }
}
</style>