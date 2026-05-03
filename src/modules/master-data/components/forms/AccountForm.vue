<template>
  <div class="form-container">
    <div class="form-group">
      <label>Số hiệu tài khoản <span class="required">*</span></label>
      <input v-model="data.AccountNumber" type="text" class="m-input" placeholder="Ví dụ: 1111" />
    </div>
    <div class="form-group">
      <label>Tên tài khoản <span class="required">*</span></label>
      <input v-model="data.AccountName" type="text" class="m-input" />
    </div>
    <div class="form-row">
      <div class="form-group col-6">
        <label>Tính chất</label>
        <select v-model="data.AccountType" class="m-input">
          <option value="Debit">Dư Nợ</option>
          <option value="Credit">Dư Có</option>
          <option value="Both">Lưỡng tính</option>
        </select>
      </div>
      <div class="form-group col-6">
        <label>Tài khoản tổng hợp</label>
        <input v-model="data.ParentAccountNumber" type="text" class="m-input" placeholder="Mã tài khoản cha" />
      </div>
    </div>
    <div class="form-group">
      <label>Diễn giải</label>
      <textarea v-model="data.Description" class="m-input" rows="3"></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['data']);
</script>