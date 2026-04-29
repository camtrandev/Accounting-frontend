<script setup>
</script>

<template>
  <router-view />
</template>

<style scoped>
/* Triệt tiêu scroll của trình duyệt */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  /* Đây là dòng quan trọng nhất để mất thanh scroll ngoài */
}

#app {
  height: 100%;
}
</style>