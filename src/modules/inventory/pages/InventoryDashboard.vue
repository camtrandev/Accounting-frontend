<script setup>
// Bổ sung thêm 'ref' vào import
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '../store/inventory.store'
import InventoryQuickActions from '../components/InventoryQuickActions.vue'
import InventoryFilter from '../components/InventoryFilter.vue'
import InventoryTable from '../components/InventoryTable.vue'

const router = useRouter()
const inventoryStore = useInventoryStore()

// Lưu lại trạng thái filter hiện tại để dùng khi chuyển trang
const currentFilters = ref({})

// Lấy dữ liệu từ Store
const tableData = computed(() => inventoryStore.documents)
const isLoading = computed(() => inventoryStore.isLoading)
const pagination = computed(() => inventoryStore.pagination)

// 1. Hàm gọi API Lấy dữ liệu
const fetchInventoryData = async (filters = {}) => {
  currentFilters.value = filters

  const params = {
    page: filters.page || 1,
    pageSize: filters.pageSize || 10,
    search: filters.searchText || '',  
    type: filters.voucherType || ''    
  }
  
  await inventoryStore.fetchDocuments(params)
}

// 2. Chuyển trang
const handlePageChange = (newPage) => {
  fetchInventoryData({ 
    ...currentFilters.value, 
    page: newPage 
  })
}

// 3. Hàm Xử lý Xuất Excel (Xử lý tải file Blob chuẩn)
// 3. Hàm Xử lý Xuất Excel
const handleExportData = async (exportData) => {
  try {
    console.log("Hệ thống đang xuất file Excel...");
    
    // SỬA LỖI Ở ĐÂY: Lấy đúng fromDate, toDate, warehouseId từ Modal gửi lên
    const params = {
      fromDate: exportData.fromDate || '', // Nếu để trống sẽ gửi chuỗi rỗng
      toDate: exportData.toDate || '',     // Nếu để trống sẽ gửi chuỗi rỗng
      warehouseId: exportData.warehouseId || '' // Nếu không chọn kho sẽ gửi chuỗi rỗng
    };

    // Gọi API thông qua store
    const response = await inventoryStore.exportExcel(params);

    // Xử lý tạo link tải file ảo từ dữ liệu Blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Đặt tên file động theo thời gian hiện tại
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `BaoCao_Kho_${dateStr}.xlsx`);
    
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp DOM
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Lỗi xuất Excel:", error);
    alert("Không thể tải file Excel. Vui lòng thử lại!");
  }
}

// 4. Mở trang Sửa
const handleEditVoucher = (voucher) => {
  router.push({
    path: `/inventory/${voucher.type}/edit/${voucher.id}`
  })
}

// 5. Xử lý Xóa chứng từ
const handleDeleteVoucher = async (voucher) => {
  if (confirm(`Bạn có chắc chắn muốn xóa chứng từ ${voucher.voucherNumber}? Hành động này không thể hoàn tác!`)) {
    try {
      // Gọi hành động xóa từ store
      await inventoryStore.deleteDocument(voucher.id);
      
      // Xóa thành công thì load lại dữ liệu ở đúng trang hiện tại
      await fetchInventoryData({ 
        ...currentFilters.value, 
        page: pagination.value.page 
      });
      
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Có lỗi xảy ra khi xóa chứng từ. Vui lòng kiểm tra lại!');
    }
  }
}

// 6. Mở trang Thêm mới
const createNewReceipt = () => {
  router.push({ name: 'InventoryReceiptCreate' })
}

onMounted(async () => {
  await fetchInventoryData()
  await inventoryStore.fetchMetadata()
})
</script>

<template>
  <div class="inventory-dashboard-container">
    <div class="page-header">
      <h2 class="page-title">Quản lý Kho</h2>
    </div>

    <div class="section-container">
      <InventoryQuickActions />
    </div>

    <div class="section-container data-section">
      <InventoryFilter 
        @search="fetchInventoryData" 
        @export="handleExportData" 
      />

      <InventoryTable 
        :items="tableData" 
        :pagination="pagination" 
        :is-loading="isLoading" 
        @edit="handleEditVoucher"
        @delete="handleDeleteVoucher" 
        @page-change="handlePageChange" 
      />
    </div>
  </div>
</template>

<style scoped>
.inventory-dashboard-container {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: calc(100vh - 60px);
  /* Trừ đi chiều cao của header top */
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header của trang */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  /* Tránh vỡ layout trên mobile */
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}


.btn-primary {
  background-color: #7c3aed;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.2);
}

.btn-primary:hover {
  background-color: #6d28d9;
}

.btn-primary:active {
  transform: translateY(1px);
}


.section-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.data-section {
  flex-grow: 1;
  /* Để bảng dữ liệu chiếm toàn bộ không gian còn lại ở dưới */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Responsive cơ bản cho Mobile */
@media (max-width: 768px) {
  .inventory-dashboard-container {
    padding: 16px;
    gap: 16px;
  }

  .section-container {
    padding: 16px;
  }
}
</style>