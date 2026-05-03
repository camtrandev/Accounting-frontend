<template>
  <div class="form-container">
    <div class="form-row">
      <div class="form-group col-6">
        <label>Mã nhà cung cấp <span class="required">*</span></label>
        <input v-model="data.SupplierCode" type="text" class="m-input" />
      </div>
      <div class="form-group col-6">
        <label>Mã số thuế</label>
        <input v-model="data.TaxCode" type="text" class="m-input" />
      </div>
    </div>
    <div class="form-group">
      <label>Tên nhà cung cấp <span class="required">*</span></label>
      <input v-model="data.SupplierName" type="text" class="m-input" />
    </div>
    <div class="form-group">
      <label>Địa chỉ</label>
      <input v-model="data.Address" type="text" class="m-input" />
    </div>
    <div class="form-row">
      <div class="form-group col-6">
        <label>Số điện thoại</label>
        <input v-model="data.Phone" type="text" class="m-input" />
      </div>
      <div class="form-group col-6">
        <label>Hạn mức nợ (VNĐ)</label>
        <input v-model="data.DebtLimit" type="number" class="m-input text-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['data']);
</script>