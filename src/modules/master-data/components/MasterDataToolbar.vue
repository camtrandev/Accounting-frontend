<template>
  <div class="master-toolbar-wrapper">
    <div class="category-tabs">
      <div 
        v-for="item in menuConfig" 
        :key="item.id"
        :class="['tab-item', { active: currentType === item.id }]"
        @click="$emit('change-type', item.id)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="toolbar-container">
      <div class="toolbar-left">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input type="text" v-model="searchQuery" @input="onSearchInput"
            placeholder="Tìm theo mã, tên, số điện thoại..." class="input-search" />
        </div>

        <select v-model="statusFilter" @change="onFilterChange" class="select-filter">
          <option :value="null">Tất cả trạng thái</option>
          <option :value="true">Đang theo dõi</option>
          <option :value="false">Ngừng theo dõi</option>
        </select>
      </div>

      <div class="toolbar-right">
        <button class="btn-secondary" @click="refresh">
          <i class="fas fa-sync-alt"></i> Nạp lại
        </button>
        <button class="btn-secondary hidden-mobile">
          <i class="fas fa-file-excel"></i> Xuất Excel
        </button>
        <button class="btn-primary" @click="$emit('add-new')">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Khai báo cấu hình menu ngay tại đây hoặc import từ file config
const menuConfig = [
  { id: 'ACCOUNT', label: 'Hệ thống tài khoản', icon: 'fas fa-book' },
  { id: 'CUSTOMER', label: 'Khách hàng', icon: 'fas fa-users' },
  { id: 'SUPPLIER', label: 'Nhà cung cấp', icon: 'fas fa-truck' },
  { id: 'PRODUCT', label: 'Vật tư hàng hóa', icon: 'fas fa-box' },
  { id: 'WAREHOUSE', label: 'Kho', icon: 'fas fa-warehouse' }
];

const props = defineProps(['currentType']);
const emit = defineEmits(['search', 'filter', 'refresh', 'add-new', 'change-type']);

const searchQuery = ref('');
const statusFilter = ref(null);
let timeout = null;

const onSearchInput = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('search', searchQuery.value);
  }, 500);
};

const onFilterChange = () => {
  emit('filter', statusFilter.value);
};

const refresh = () => {
  searchQuery.value = '';
  statusFilter.value = null;
  emit('refresh');
};
</script>

<style scoped>
.toolbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
    gap: 12px;
}

.toolbar-left,
.toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* Search Box */
.search-wrapper {
    position: relative;
    width: 300px;
}

.search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
}

.input-search {
    width: 100%;
    padding: 8px 10px 8px 35px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
}

.select-filter {
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: white;
}

/* Nút bấm */
.btn-primary {
    background: #2563eb;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.btn-secondary {
    background: white;
    border: 1px solid #d1d5db;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
}

.category-tabs {
  display: flex;
  gap: 25px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  padding: 12px 5px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  transition: all 0.2s;
}

.tab-item i {
  font-size: 13px;
}

.tab-item:hover {
  color: #2563eb;
}

/* Đổi màu khi Active */
.tab-item.active {
  color: #2563eb;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #2563eb; /* Đường kẻ dưới màu xanh/tím nổi bật */
}

@media (max-width: 768px) {
    .search-wrapper {
        width: 100%;
    }

    .hidden-mobile {
        display: none;
    }

    .toolbar-right {
        width: 100%;
        justify-content: flex-end;
    }
}

</style>