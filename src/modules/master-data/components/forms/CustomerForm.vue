<template>
  <div class="form-container">
    <div class="form-row">
      <div class="form-group col-6">
        <label>Mã khách hàng <span class="required">*</span></label>
        <input v-model="data.PartnerCode" type="text" class="m-input uppercase"
          :class="{ 'disabled-input': isEditMode }" :disabled="isEditMode" placeholder="Ví dụ: KH001" />
      </div>
      <div class="form-group col-6">
        <label>Mã số thuế</label>
        <input v-model="data.TaxCode" type="text" class="m-input" placeholder="Mã số thuế doanh nghiệp" />
      </div>
    </div>

    <div class="form-group">
      <label>Tên khách hàng <span class="required">*</span></label>
      <input v-model="data.PartnerName" type="text" class="m-input" placeholder="Tên cá nhân hoặc công ty" />
    </div>

    <div class="form-group">
      <label>Địa chỉ</label>
      <input v-model="data.Address" type="text" class="m-input" placeholder="Địa chỉ xuất hóa đơn" />
    </div>

    <div class="form-row">
      <div class="form-group col-6">
        <label>Hạn mức nợ</label>
        <input v-model="data.DebtLimit" type="number" class="m-input text-right" min="0" placeholder="0.00" />
      </div>
      <div class="form-group col-6">
        <label>Phân loại đối tác <span class="required">*</span></label>
        <select v-model="data.PartnerType" class="m-input disabled-input" disabled>
          <option :value="1">1 - Khách hàng</option>
          <option :value="2">2 - Nhà cung cấp</option>
          <option :value="3">3 - Cả hai</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      PartnerCode: '',
      TaxCode: '',
      PartnerName: '',
      Address: '',
      PartnerType: 1,
      DebtLimit: 0
    })
  }
});

// Nhận diện chế độ Sửa: Nếu object data truyền vào đã có Id thì tự động khóa ô Mã khách hàng
const isEditMode = computed(() => !!props.data.Id || !!props.data.id);
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.col-6 {
  flex: 1;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 13px;
  color: #374151;
}

.required {
  color: #ef4444;
}

.m-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

.m-input:focus:not(:disabled) {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.m-input.text-right {
  text-align: right;
}

.uppercase {
  text-transform: uppercase;
}

.disabled-input {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #6b7280;
}
</style>