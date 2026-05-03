<template>
  <div class="form-container">
    <div class="form-row">
      <div class="form-group col-6">
        <label>Mã khách hàng <span class="required">*</span></label>
        <input 
          v-model="data.CustomerCode" 
          type="text" 
          class="m-input" 
          placeholder="Ví dụ: KH001"
        />
      </div>
      <div class="form-group col-6">
        <label>Mã số thuế</label>
        <input 
          v-model="data.TaxCode" 
          type="text" 
          class="m-input" 
          placeholder="Mã số thuế doanh nghiệp"
        />
      </div>
    </div>

    <div class="form-group">
      <label>Tên khách hàng <span class="required">*</span></label>
      <input 
        v-model="data.CustomerName" 
        type="text" 
        class="m-input" 
        placeholder="Tên cá nhân hoặc công ty"
      />
    </div>

    <div class="form-group">
      <label>Địa chỉ</label>
      <input 
        v-model="data.Address" 
        type="text" 
        class="m-input" 
        placeholder="Địa chỉ xuất hóa đơn"
      />
    </div>

    <div class="form-row">
      <div class="form-group col-6">
        <label>Số điện thoại</label>
        <input 
          v-model="data.PhoneNumber" 
          type="text" 
          class="m-input" 
        />
      </div>
      <div class="form-group col-6">
        <label>Email</label>
        <input 
          v-model="data.Email" 
          type="email" 
          class="m-input" 
          placeholder="example@gmail.com"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col-6">
        <label>Nhóm khách hàng</label>
        <select v-model="data.CustomerGroupId" class="m-input">
          <option :value="null">-- Chọn nhóm --</option>
          <option value="1">Khách lẻ</option>
          <option value="2">Khách đại lý</option>
          <option value="3">Khách VIP</option>
        </select>
      </div>
      <div class="form-group col-6">
        <label>Số tài khoản ngân hàng</label>
        <input 
          v-model="data.BankAccount" 
          type="text" 
          class="m-input" 
        />
      </div>
    </div>

    <div class="form-group">
      <label>Ghi chú</label>
      <textarea 
        v-model="data.Description" 
        class="m-input" 
        rows="2"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
/**
 * Data được truyền từ MasterDataDrawer qua props
 * để đảm bảo tính phản hồi (Reactivity)
 */
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped>
/* Các style này nên đưa vào masterData.scss để dùng chung */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 13px;
}
.required {
  color: red;
}
.m-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline: none;
}
.m-input:focus {
  border-color: #2563eb;
}
</style>