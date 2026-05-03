<template>
  <div class="master-toolbar-wrapper">
    <div class="category-tabs">
      <div v-for="item in menuConfig" :key="item.id" :class="['tab-item', { active: currentType === item.id }]"
        @click="handleChangeTab(item.id)">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="toolbar-container">
      <div class="toolbar-left">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <!-- Placeholder thay đổi động theo currentType -->
          <input type="text" v-model="searchQuery" @input="onSearchInput" :placeholder="dynamicPlaceholder"
            class="input-search" />
        </div>

        <!-- <select v-model="statusFilter" @change="onFilterChange" class="select-filter">
          <option :value="null">Tất cả trạng thái</option>
          <option :value="true">Đang theo dõi</option>
          <option :value="false">Ngừng theo dõi</option>
        </select> -->
      </div>

      <div class="toolbar-right">
        <button class="btn-secondary" @click="refresh">
          <i class="fas fa-sync-alt"></i> Nạp lại
        </button>
        <!-- Nút Xuất Excel với chức năng xử lý tương ứng -->
        <button class="btn-secondary hidden-mobile" @click="handleExportExcel">
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
import { ref, computed, watch } from 'vue';

const props = defineProps(['currentType']);
const emit = defineEmits(['search', 'filter', 'refresh', 'add-new', 'change-type', 'export-excel']);

const searchQuery = ref('');
const statusFilter = ref(null);
let timeout = null;

const menuConfig = [
  { id: 'ACCOUNT', label: 'Hệ thống tài khoản', icon: 'fas fa-book', placeholder: 'Tìm theo số hiệu, tên tài khoản...' },
  { id: 'CUSTOMER', label: 'Khách hàng', icon: 'fas fa-users', placeholder: 'Tìm theo mã, tên, số điện thoại...' },
  { id: 'SUPPLIER', label: 'Nhà cung cấp', icon: 'fas fa-truck', placeholder: 'Tìm theo mã, tên nhà cung cấp...' },
  { id: 'PRODUCT', label: 'Vật tư hàng hóa', icon: 'fas fa-box', placeholder: 'Tìm theo mã, tên hàng hóa...' },
  { id: 'WAREHOUSE', label: 'Kho', icon: 'fas fa-warehouse', placeholder: 'Tìm theo mã, tên kho...' }
];

// Computed để lấy placeholder dựa trên tab hiện tại
const dynamicPlaceholder = computed(() => {
  const activeTab = menuConfig.find(item => item.id === props.currentType);
  return activeTab ? activeTab.placeholder : 'Tìm kiếm...';
});

// Khi đổi Tab từ bên ngoài hoặc click, reset ô tìm kiếm
const handleChangeTab = (id) => {
  searchQuery.value = '';
  statusFilter.value = null;
  emit('change-type', id);
};

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

// Chức năng xuất Excel tương ứng với danh mục
const handleExportExcel = () => {
  const activeTab = menuConfig.find(item => item.id === props.currentType);
  console.log(`Đang xuất Excel cho danh mục: ${activeTab.label}`);

  // Gửi sự kiện xuất kèm theo loại danh mục và bộ lọc hiện tại
  emit('export-excel', {
    type: props.currentType,
    search: searchQuery.value,
    status: statusFilter.value
  });

  // Lưu ý: Logic thực tế để tải file về thường được xử lý ở Store hoặc Page cha
  // bằng cách gọi API backend trả về file blob (excel).
};
</script>

<style scoped>
/* Giữ nguyên phần Style bạn đã cung cấp vì đã rất đầy đủ và đúng giao diện */
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

.search-wrapper {
  position: relative;
  width: 320px;
  /* Tăng nhẹ độ rộng để hiện placeholder dài hơn */
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

.input-search:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.select-filter {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

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

.tab-item:hover {
  color: #2563eb;
}

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
  background: #2563eb;
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