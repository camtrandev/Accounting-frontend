<template>
  <div class="master-data-page">
    <div class="content-card">
      <!-- 1. Phần Top (Cố định): Chứa Tiêu đề, Nút thêm mới, Thanh Search -->
      <div class="card-top">
        <MasterDataToolbar :current-type="currentType" @change-type="handleTypeChange" @search="handleSearch"
          @refresh="handleRefresh" @add-new="openDrawerForAdd" />
      </div>

      <!-- 2. Phần Giữa (Co giãn): Chứa Table -->
      <div class="card-main">
        <!-- Loading Overlay -->
        <div v-if="store.loading" class="loading-overlay">
          <div class="spinner"></div>
        </div>

        <AccountTable v-if="currentType === 'ACCOUNT'" :data="store.filteredItems" @edit="openDrawerForEdit"
          @delete="handleDelete" />

        <CustomerTable v-else-if="currentType === 'CUSTOMER'" :data="store.filteredItems" @edit="openDrawerForEdit"
          @delete="handleDelete" />

        <SupplierTable v-else-if="currentType === 'SUPPLIER'" :data="store.filteredItems" @edit="openDrawerForEdit"
          @delete="handleDelete" />

        <ProductTable v-else-if="currentType === 'PRODUCT'" :data="store.filteredItems" @edit="openDrawerForEdit"
          @delete="handleDelete" />

        <WarehouseTable v-else-if="currentType === 'WAREHOUSE'" :data="store.filteredItems" @edit="openDrawerForEdit"
          @delete="handleDelete" />

        <!-- Placeholder cho danh mục khác -->
        <div v-else class="empty-state">
          <i class="fas fa-tools"></i>
          <p>Chức năng {{ currentTypeLabel }} đang được cập nhật...</p>
        </div>
      </div>

      <!-- 3. Phần Đáy (Cố định): Chứa Phân trang -->
      <div class="card-bottom">
        <MasterDataPagination v-if="store.filteredTotal > 0" :total="store.filteredTotal"
          :page-size="store.pagination.pageSize" v-model:current-page="store.pagination.page" />
      </div>
    </div>

    <!-- Form Drawer -->
    <MasterDataDrawer v-if="isDrawerOpen" :type="currentType" :initial-data="selectedItem" @close="closeDrawer"
      @save-success="handleSaveSuccess" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMasterDataStore } from '../store/masterData.store';

import MasterDataToolbar from '../components/MasterDataToolbar.vue';
import AccountTable from '../components/tables/AccountTable.vue';
import MasterDataPagination from '../components/MasterDataPagination.vue';
import MasterDataDrawer from '../components/MasterDataDrawer.vue';
import CustomerTable from '../components/tables/CustomerTable.vue'
import SupplierTable from '../components/tables/SupplierTable.vue';
import ProductTable from '../components/tables/ProductTable.vue';
import WarehouseTable from '../components/tables/WarehouseTable.vue';

const store = useMasterDataStore();
const currentType = ref('ACCOUNT');
const isDrawerOpen = ref(false);
const selectedItem = ref(null);

const currentTypeLabel = computed(() => {
  const labels = {
    'ACCOUNT': 'Hệ thống tài khoản',
    'CUSTOMER': 'Khách hàng',
    'SUPPLIER': 'Nhà cung cấp',
    'WAREHOUSE': 'Kho'
  };
  return labels[currentType.value] || currentType.value;
});

const loadData = async () => {
  try {
    await store.fetchItems(currentType.value);
  } catch (error) {
    console.error(`[MasterData] Fetch Error:`, error);
  }
};

const handleTypeChange = (newType) => {
  currentType.value = newType;
  store.resetFilters();
  loadData();
};

const handleSearch = (query) => {
  store.filters.search = query; 
  // Không cần loadData(); dữ liệu tự động lọc nhờ Getter
};

const handleRefresh = () => loadData();

const openDrawerForAdd = () => {
  selectedItem.value = null;
  isDrawerOpen.value = true;
};

const openDrawerForEdit = (item) => {
  selectedItem.value = { ...item };
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  selectedItem.value = null;
};

const handleSaveSuccess = () => {
  closeDrawer();
  loadData();
};

const handleDelete = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
    const success = await store.deleteItem(currentType.value, id);
    if (success) {
      if (store.items.length === 1 && store.pagination.page > 1) {
        store.pagination.page--;
      }
      loadData();
    }
  }
};

onMounted(loadData);
</script>

<style scoped>
/* Khung bọc ngoài cùng */
.master-data-page {
  /* Điều chỉnh số 60px bằng chiều cao topbar chung của hệ thống bạn nếu cần */
  height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f3f5f8;
  box-sizing: border-box;
  overflow: hidden;
  /* NGHIÊM CẤM scroll ở cấp độ trang */
}

/* Thẻ Card màu trắng */
.content-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: calc(100% - 50px);
}

/* Topbar của tính năng */
.card-top {
  flex-shrink: 0;
  padding: 20px 24px 10px 24px;
}

/* Vùng chứa bảng - Sẽ tự động lấy không gian còn lại */
.card-main {
  flex: 1;
  min-height: 0;
  /* Bắt buộc phải có để thẻ con bên trong scroll được */
  padding: 0 24px;
  position: relative;
}

/* Vùng chứa phân trang */
.card-bottom {
  flex-shrink: 0;
  padding: 12px 24px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

/* Các UI phụ trợ */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  margin-top: 50px;
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
</style>