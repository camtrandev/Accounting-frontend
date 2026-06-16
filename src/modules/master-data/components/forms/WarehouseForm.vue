<template>
  <div class="form-container">
    <div class="form-row">
      <div class="form-group col-4">
        <label>Mã kho <span class="required">*</span></label>
        <input v-model="data.WarehouseCode" type="text" class="m-input uppercase"
          :class="{ 'disabled-input': isEditMode }" :disabled="isEditMode" placeholder="Ví dụ: KHO01" />
      </div>
      <div class="form-group col-8">
        <label>Tên kho <span class="required">*</span></label>
        <input v-model="data.WarehouseName" type="text" class="m-input" placeholder="Tên chi nhánh, kho chứa..." />
      </div>
    </div>

    <div class="form-group">
      <label>Người quản lý / Thủ kho</label>
      <input v-model="data.ManagerName" type="text" class="m-input" placeholder="Họ và tên người quản lý kho..." />
    </div>

    <div class="form-group">
      <label>Địa chỉ kho</label>
      <textarea v-model="data.Address" class="m-input" rows="2"
        placeholder="Nhập địa chỉ chi tiết của kho..."></textarea>
    </div>

    <div class="form-group">
      <label>
        <input type="checkbox" v-model="data.IsActive" :true-value="1" :false-value="0" />
        Đang hoạt động (Kích hoạt)
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      WarehouseCode: '',
      WarehouseName: '',
      Address: '',
      ManagerName: '',
      IsActive: 1
    })
  }
});

// Nhận diện chế độ Sửa: Nếu object data truyền vào đã có Id thì tự động khóa ô Mã Kho
const isEditMode = computed(() => !!props.data.Id || !!props.data.id || !!props.data.warehouse_code);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/form-style.scss" as *;

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.col-4 {
  flex: 0 0 33.333%;
}

.col-8 {
  flex: 1;
}

.uppercase {
  text-transform: uppercase;
}

.disabled-input {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #6b7280;
}

input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

textarea.m-input {
  resize: vertical;
}
</style>