<template>
  <div class="master-data-page flex flex-col h-screen bg-gray-100 overflow-hidden">

    <MasterDataToolbar @search="handleSearch" @filter="handleFilter" @refresh="handleRefresh"
      @add-new="openDrawerForAdd" />

    <div class="content-body flex-1 overflow-hidden p-4">
      <div class="bg-white rounded-lg shadow h-full relative">
        <div v-if="store.loading" class="loading-overlay">
          <div class="spinner"></div>
        </div>

        <MasterDataTable @edit="openDrawerForEdit" @delete="handleDelete" />
      </div>
    </div>

    <MasterDataPagination :total="store.pagination.total" :pageSize="store.pagination.pageSize"
      v-model:currentPage="store.pagination.page" @change="store.fetchItems" />

    <MasterDataDrawer v-if="isDrawerOpen" :initialData="selectedItem" @close="closeDrawer"
      @save-success="handleSaveSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMasterDataStore } from '../store/masterData.store';

// Import các component con (Đảm bảo đường dẫn đúng với cấu trúc file của bạn)
import MasterDataToolbar from '../components/MasterDataToolbar.vue';
import MasterDataTable from '../components/MasterDataTable.vue';
import MasterDataPagination from '../components/MasterDataPagination.vue';
import MasterDataDrawer from '../components/MasterDataDrawer.vue';

const store = useMasterDataStore();

// Trạng thái điều khiển Drawer
const isDrawerOpen = ref(false);
const selectedItem = ref(null);

// Lấy dữ liệu lần đầu khi Component được gắn vào DOM
onMounted(() => {
  store.fetchItems();
});

// --- XỬ LÝ LOGIC ---

// 1. Tìm kiếm và Lọc
const handleSearch = (query) => {
  store.filters.search = query;
  store.pagination.page = 1; // Reset về trang 1 khi tìm kiếm
  store.fetchItems();
};

const handleFilter = (status) => {
  store.filters.status = status;
  store.pagination.page = 1;
  store.fetchItems();
};

const handleRefresh = () => {
  store.resetFilters(); // Hàm này bạn nên viết trong store.js
  store.fetchItems();
};

// 2. Thêm mới / Sửa
const openDrawerForAdd = () => {
  selectedItem.value = null; // Reset dữ liệu về trống
  isDrawerOpen.value = true;
};

const openDrawerForEdit = (item) => {
  selectedItem.value = { ...item }; // Copy dữ liệu để tránh tham chiếu
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  selectedItem.value = null;
};

const handleSaveSuccess = () => {
  closeDrawer();
  store.fetchItems(); // Load lại danh sách sau khi lưu
};

// 3. Xóa
const handleDelete = async (id) => {
  // Logic xóa gọi từ store
  const success = await store.deleteItem(id);
  if (success) {
    store.fetchItems();
  }
};
</script>

<style scoped>
.master-data-page {
  /* Đảm bảo page luôn chiếm hết màn hình và không bị cuộn cả trang */
  max-height: 100vh;
}

.content-body {
  /* Vùng này sẽ tự co giãn và cho phép table bên trong tự cuộn */
  background-color: #f3f4f6;
}

/* Hiệu ứng Loading */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>