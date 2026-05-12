<template>
  <div class="form-container">
    <div class="form-group">
      <label>Mã kho <span class="required">*</span></label>
      <input v-model="data.WarehouseCode" type="text" class="m-input" />
    </div>
    <div class="form-group">
      <label>Tên kho <span class="required">*</span></label>
      <input v-model="data.WarehouseName" type="text" class="m-input" />
    </div>
    <div class="form-group">
      <label>Địa chỉ kho</label>
      <textarea v-model="data.Address" class="m-input" rows="2"></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['data']);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/form-style.scss" as *;
</style>
