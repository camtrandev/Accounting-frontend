<template>
  <div class="container">
    <slot />
  </div>
</template>

<style scoped>
.container{

  min-height: calc(100vh - 60px);

  background: #f8fafc;
  transition: 0.3s;
  
}
</style>