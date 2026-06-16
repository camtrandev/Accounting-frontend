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
        <component :is="currentFormComponent" :data="formData" />
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

// Import tất cả 5 Form 
import AccountForm from './forms/AccountForm.vue';
import CustomerForm from './forms/CustomerForm.vue';
import SupplierForm from './forms/SupplierForm.vue';
import ProductForm from './forms/ProductForm.vue';
import WarehouseForm from './forms/WarehouseForm.vue';

const props = defineProps(['type', 'initialData']);
const emit = defineEmits(['close', 'save-success']);
const store = useMasterDataStore();

// ==========================================
// 1. Hàm tạo dữ liệu trắng chuẩn theo DB Schema
// ==========================================
const getEmptyData = (type) => {
  switch (type) {
    case 'CUSTOMER':
      // Khớp chuẩn trường trong DB bảng partners
      return { PartnerType: 1, DebtLimit: 0, PartnerCode: '', PartnerName: '' };
    case 'SUPPLIER':
      return { PartnerType: 2, DebtLimit: 0, PartnerCode: '', PartnerName: '' };
    default:
      return {};
  }
};

// =========================================================================
// 1. Hàm chuẩn hóa tránh lệch thuộc tính chữ Hoa/Thường giữa API và Form con
// =========================================================================
const normalizeData = (raw, type) => {
  if (!raw) return getEmptyData(type);
  
  return {
    // Định dạng ID linh hoạt
    Id: raw.Id || raw.id,
    
    // Nhóm Khách hàng / Nhà cung cấp (Partners)
    PartnerCode: raw.PartnerCode || raw.partnerCode || '',
    PartnerName: raw.PartnerName || raw.partnerName || '',
    TaxCode: raw.TaxCode || raw.taxCode || '',
    Address: raw.Address || raw.address || '',
    DebtLimit: raw.DebtLimit !== undefined ? raw.DebtLimit : (raw.debtLimit || 0),
    PartnerType: raw.PartnerType || raw.partnerType || (type === 'CUSTOMER' ? 1 : 2),
    
    // Nhóm Vật tư hàng hóa (Items)
    ItemCode: raw.ItemCode || raw.itemCode || '',
    ItemName: raw.ItemName || raw.itemName || '',
    ItemType: raw.ItemType || raw.itemType || 1,
    Unit: raw.Unit || raw.unit || '',
    CostMethod: raw.CostMethod || raw.costMethod || 1,
    DefaultAccountStock: raw.DefaultAccountStock || raw.defaultAccountStock || '1561',
    DefaultAccountRevenue: raw.DefaultAccountRevenue || raw.defaultAccountRevenue || '5111',
    DefaultWarehouseId: raw.DefaultWarehouseId || raw.defaultWarehouseId || raw.default_warehouse_id || null,
    
    // Nhóm Kho hàng (Warehouses)
    WarehouseCode: raw.WarehouseCode || raw.warehouseCode || raw.warehouse_code || '',
    WarehouseName: raw.WarehouseName || raw.warehouseName || raw.warehouse_name || '',
    ManagerName: raw.ManagerName || raw.managerName || raw.manager_name || '',
    
    // Trạng thái chung
    IsActive: raw.IsActive !== undefined ? raw.IsActive : (raw.isActive !== undefined ? raw.isActive : 1)
  };
};

// Khởi tạo dữ liệu form thông qua bộ lọc chuẩn hóa
const formData = ref(normalizeData(props.initialData, props.type));

// Theo dõi nếu dòng dữ liệu thay đổi hoặc đóng mở lại drawer
watch(() => props.initialData, (newVal) => {
  formData.value = normalizeData(newVal, props.type);
}, { deep: true });

// ==========================================
// 2. Bản đồ ánh xạ giữa Type và Component Form
// ==========================================
const formMap = {
  ACCOUNT: { component: AccountForm, title: 'tài khoản' },
  CUSTOMER: { component: CustomerForm, title: 'khách hàng' },
  SUPPLIER: { component: SupplierForm, title: 'nhà cung cấp' },
  PRODUCT: { component: ProductForm, title: 'vật tư hàng hóa' },
  WAREHOUSE: { component: WarehouseForm, title: 'kho' }
};

const currentFormComponent = computed(() => formMap[props.type]?.component);
const currentTitle = computed(() => formMap[props.type]?.title || 'danh mục');

// ==========================================
// 3. Logic xử lý Lưu dữ liệu (ĐÃ CHUẨN HÓA)
// ==========================================
const handleSave = async () => {
  try {
    let success = false;

    // Kiểm tra khóa chính: Trong DB của bạn cột ID là 'Id' viết hoa
    const recordId = formData.value.Id || formData.value.id;

    if (recordId) {
      // Đã có ID -> Gọi API Cập nhật (Sửa)
      success = await store.updateItem(props.type, recordId, formData.value);
    } else {
      // Chưa có ID -> Gọi API Thêm mới
      success = await store.createItem(props.type, formData.value);
    }

    if (success) {
      emit('save-success'); // Thông báo cho trang chính load lại bảng và đóng Drawer
    } else {
      alert("Có lỗi xảy ra khi lưu dữ liệu từ Backend. Vui lòng thử lại!");
    }
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    alert("Có lỗi hệ thống, vui lòng kiểm tra console.");
  }
};
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
  width: 500px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
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
  overflow-y: auto;
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
  border: none;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}
</style>