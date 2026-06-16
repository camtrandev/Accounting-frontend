<template>
  <div class="form-container">
    <div class="form-row">
      <div class="form-group col-6">
        <label>Mã nhà cung cấp <span class="required">*</span></label>
        <input v-model="data.PartnerCode" type="text" class="m-input uppercase"
          :class="{ 'disabled-input': isEditMode }" :disabled="isEditMode" placeholder="Ví dụ: NCC001" />
      </div>
      <div class="form-group col-6">
        <label>Mã số thuế</label>
        <input v-model="data.TaxCode" type="text" class="m-input" placeholder="Mã số thuế doanh nghiệp" />
      </div>
    </div>

    <div class="form-group">
      <label>Tên nhà cung cấp <span class="required">*</span></label>
      <input v-model="data.PartnerName" type="text" class="m-input" placeholder="Tên công ty hoặc đối tác" />
    </div>

    <div class="form-group">
      <label>Địa chỉ</label>
      <input v-model="data.Address" type="text" class="m-input" placeholder="Địa chỉ văn phòng / kho" />
    </div>

    <div class="form-row">
      <div class="form-group col-6">
        <label>Hạn mức nợ (VNĐ)</label>
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
      PartnerType: 2, // Mặc định gán là 2 (Nhà cung cấp) theo DB schema
      DebtLimit: 0
    })
  }
});

// Nhận diện chế độ Sửa: Nếu object data truyền vào đã có Id thì tự động khóa ô Mã NCC
const isEditMode = computed(() => !!props.data.Id || !!props.data.id);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/form-style.scss" as *;

.uppercase {
  text-transform: uppercase;
}

.disabled-input {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #6b7280;
}
</style>