<template>
  <div class="form-container">
    <div class="form-group">
      <label>Mã hàng hóa <span class="required">*</span></label>
      <input v-model="data.ProductCode" type="text" class="m-input" />
    </div>
    <div class="form-group">
      <label>Tên hàng hóa <span class="required">*</span></label>
      <input v-model="data.ProductName" type="text" class="m-input" />
    </div>
    <div class="form-row">
      <div class="form-group col-6">
        <label>Đơn vị tính</label>
        <input v-model="data.Unit" type="text" class="m-input" placeholder="Cái, Kg, Mét..." />
      </div>
      <div class="form-group col-6">
        <label>Kho mặc định</label>
        <select v-model="data.WarehouseId" class="m-input">
          <option :value="null">-- Chọn kho --</option>
          </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-6">
        <label>Giá mua định mức</label>
        <input v-model="data.PurchasePrice" type="number" class="m-input text-right" />
      </div>
      <div class="form-group col-6">
        <label>Giá bán</label>
        <input v-model="data.SalePrice" type="number" class="m-input text-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['data']);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/form-style.scss" as *;
</style>
