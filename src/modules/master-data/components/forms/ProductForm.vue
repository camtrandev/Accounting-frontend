<template>
  <div class="form-container">
    <div class="form-row">
      <div class="form-group col-4">
        <label>Mã hàng hóa <span class="required">*</span></label>
        <input v-model="data.ItemCode" type="text" class="m-input uppercase" :class="{ 'disabled-input': isEditMode }"
          :disabled="isEditMode" placeholder="Ví dụ: HH001" />
      </div>
      <div class="form-group col-8">
        <label>Tên hàng hóa <span class="required">*</span></label>
        <input v-model="data.ItemName" type="text" class="m-input" placeholder="Tên vật tư, hàng hóa, dịch vụ..." />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col-6">
        <label>Tính chất <span class="required">*</span></label>
        <select v-model="data.ItemType" class="m-input">
          <option :value="1">1 - Vật tư hàng hóa</option>
          <option :value="2">2 - Dịch vụ</option>
        </select>
      </div>
      <div class="form-group col-6">
        <label>Đơn vị tính</label>
        <input v-model="data.Unit" type="text" class="m-input" placeholder="Cái, Kg, Mét..." />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col-6">
        <label>Phương pháp tính giá xuất</label>
        <select v-model="data.CostMethod" class="m-input">
          <option :value="1">1 - Bình quân gia quyền</option>
          <option :value="2">2 - Nhập trước xuất trước (FIFO)</option>
          <option :value="3">3 - Đích danh</option>
        </select>
      </div>
      <div class="form-group col-6">
        <label>Kho ngầm định</label>
        <select v-model="data.DefaultWarehouseId" class="m-input">
          <option :value="null" disabled>-- Chọn kho mặc định --</option>
          <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
            {{ wh.warehouseCode || wh.warehouse_code }} - {{ wh.warehouseName || wh.warehouse_name }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col-6">
        <label>TK Kho mặc định</label>
        <input v-model="data.DefaultAccountStock" type="text" class="m-input" placeholder="VD: 1561" />
      </div>
      <div class="form-group col-6">
        <label>TK Doanh thu mặc định</label>
        <input v-model="data.DefaultAccountRevenue" type="text" class="m-input" placeholder="VD: 5111" />
      </div>
    </div>

    <div class="form-group">
      <label>
        <input type="checkbox" v-model="data.IsActive" :true-value="1" :false-value="0" />
        Đang theo dõi (Kích hoạt)
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
      ItemCode: '',
      ItemName: '',
      ItemType: 1,
      Unit: '',
      CostMethod: 1,
      DefaultAccountStock: '1561',
      DefaultAccountRevenue: '5111',
      DefaultWarehouseId: null,
      IsActive: 1
    })
  },
  // Nhận thêm danh sách kho từ Component cha để hiển thị dropdown
  warehouses: {
    type: Array,
    default: () => []
  }
});

// Nhận diện chế độ Sửa: Nếu object data truyền vào đã có Id thì tự động khóa ô Mã Hàng Hóa
const isEditMode = computed(() => !!props.data.Id || !!props.data.id);
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

.col-6 {
  flex: 1;
}

.col-8 {
  flex: 0 0 66.666%;
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
</style>