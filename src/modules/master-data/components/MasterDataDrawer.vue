<template>
  <div class="drawer-overlay" @click.self="$emit('close')">
    <div class="drawer-content">
      <div class="drawer-header">
        <h3 class="text-xl font-bold">
          {{ initialData ? 'Sửa' : 'Thêm mới' }} {{ currentTitle }}
        </h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="drawer-body">
        <component 
          :is="currentFormComponent" 
          :data="formData" 
        />
      </div>

      <div class="drawer-footer">
        <button class="btn-secondary" @click="$emit('close')">Hủy bỏ</button>
        <button class="btn-primary" @click="handleSave">
          <i class="fas fa-save mr-2"></i> Lưu dữ liệu
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMasterDataStore } from '../store/masterData.store';

// 1. Import tất cả 5 Form bạn vừa tạo
import AccountForm from './forms/AccountForm.vue';
import CustomerForm from './forms/CustomerForm.vue';
import SupplierForm from './forms/SupplierForm.vue';
import ProductForm from './forms/ProductForm.vue';
import WarehouseForm from './forms/WarehouseForm.vue';

const props = defineProps(['type', 'initialData']);
const emit = defineEmits(['close', 'save-success']);
const store = useMasterDataStore();

// Khởi tạo dữ liệu form (Nếu sửa thì lấy data cũ, nếu thêm thì để trống)
const formData = ref(props.initialData ? { ...props.initialData } : {});

// 2. Bản đồ ánh xạ giữa Type và Component Form
const formMap = {
  ACCOUNT: { component: AccountForm, title: 'tài khoản' },
  CUSTOMER: { component: CustomerForm, title: 'khách hàng' },
  SUPPLIER: { component: SupplierForm, title: 'nhà cung cấp' },
  PRODUCT: { component: ProductForm, title: 'vật tư hàng hóa' },
  WAREHOUSE: { component: WarehouseForm, title: 'kho' }
};

// Lấy Component tương ứng
const currentFormComponent = computed(() => formMap[props.type]?.component);

// Lấy Tiêu đề tương ứng
const currentTitle = computed(() => formMap[props.type]?.title || 'danh mục');

// 3. Logic xử lý Lưu dữ liệu
const handleSave = async () => {
  try {
    // Gọi action lưu từ store (Xử lý cả Add và Update)
    const success = await store.saveItem(props.type, formData.value);
    
    if (success) {
      emit('save-success'); // Thông báo cho trang chính load lại bảng
    }
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    alert("Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu.");
  }
};

// Theo dõi nếu initialData thay đổi (khi người dùng bấm từ dòng này sang dòng khác)
watch(() => props.initialData, (newVal) => {
  formData.value = newVal ? { ...newVal } : {};
}, { deep: true });
</script>

<style lang="scss" scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.drawer-content {
  width: 500px; /* Độ rộng form chuẩn kế toán */
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  animation: slideIn 0.3s ease-out;
}

.drawer-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.drawer-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto; /* Cho phép cuộn nếu form dài */
}

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Nút bấm chuẩn UI */
.btn-primary {
  background: #2563eb;
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
  &:hover { background: #1d4ed8; }
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  padding: 8px 20px;
  border-radius: 4px;
  &:hover { background: #f9fafb; }
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>