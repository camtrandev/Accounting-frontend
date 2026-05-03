<template>
  <div class="master-data-page">
    <!-- 1. Cố định phía trên -->
    <header class="page-header">
      <MasterDataToolbar :current-type="currentType" @change-type="handleTypeChange" @search="handleSearch"
        @refresh="handleRefresh" @add-new="openDrawerForAdd" />
    </header>

    <!-- 2. Thân trang: Sử dụng Flex-1 để chiếm toàn bộ diện tích còn lại -->
    <main class="page-content">
      <div class="content-card">

        <!-- Loading Overlay -->
        <div v-if="store.loading" class="loading-overlay">
          <div class="spinner"></div>
        </div>

        <!-- Vùng chứa bảng - Đây là vùng duy nhất được phép Scroll -->
        <div class="table-scroll-area">
          <AccountTable v-if="currentType === 'ACCOUNT'" :data="store.items" @edit="openDrawerForEdit"
            @delete="handleDelete" />

          <!-- Placeholder cho danh mục khác -->
          <div v-else class="empty-state">
            <i class="fas fa-tools"></i>
            <p>Chức năng {{ currentTypeLabel }} đang được cập nhật...</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 3. Cố định phía dưới -->
    <footer class="page-footer">
      <MasterDataPagination v-if="store.pagination.total > 0" :total="store.pagination.total"
        :page-size="store.pagination.pageSize" v-model:current-page="store.pagination.page" @change="loadData" />
    </footer>

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
  store.pagination.page = 1;
  loadData();
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
/* Khung ngoài cùng: Khóa độ cao màn hình */
.master-data-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f3f4f6;
  overflow: hidden;
  /* Tuyệt đối không cho scroll cả trang */
}

.page-header {
  flex-shrink: 0;
  /* Không cho phép header bị co lại */
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* BẮT BUỘC PHẢI CÓ DÒNG NÀY */
  padding: 1rem;
  overflow: hidden; 
}

.content-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* CŨNG CẦN CÓ Ở ĐÂY */
  background: white;
  overflow: hidden;
}

.table-scroll-area {
  flex: 1;
  overflow: auto; /* Thanh scroll sẽ hiện ở đây */
  width: 100%;
}

.page-footer {
  flex-shrink: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
}

/* Các UI phụ trợ */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
</style>