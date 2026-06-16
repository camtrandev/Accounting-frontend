<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '../store/inventory.store'
import InventoryQuickActions from '../components/InventoryQuickActions.vue'
import InventoryFilter from '../components/InventoryFilter.vue'
import InventoryTable from '../components/InventoryTable.vue'
import InventoryDeleteModal from '../components/base/InventoryDeleteModal.vue' // Import Modal xác nhận
import { useToast } from "vue-toastification" // Import Toast thông báo

const router = useRouter()
const inventoryStore = useInventoryStore()
const toast = useToast()

const currentFilters = ref({})

// ========================================================
// LỌC DỮ LIỆU KHO (Bỏ qua Bán, Mua, Thu, Chi)
// ========================================================
const tableData = computed(() => {
  const rawData = inventoryStore.documents || [];
  const excludeTypes = ['SALE', 'PURCHASE', 'RECEIPT', 'PAYMENT'];

  return rawData.filter(doc => {
    const type = doc.type ? doc.type.toUpperCase() : '';
    return !excludeTypes.includes(type);
  });
});

// ========================================================
// LOG DỮ LIỆU ĐÃ LỌC RA CONSOLE (F12)
// ========================================================
watch(tableData, (newFilteredData) => {
  if (newFilteredData && newFilteredData.length > 0) {
    console.group('🔍 [InventoryDashboard] DỮ LIỆU KHO SAU KHI LỌC');
    console.log(`Số lượng bản ghi hợp lệ: ${newFilteredData.length}`);

    const logData = newFilteredData.map(d => ({
      'Số chứng từ': d.voucherNumber,
      'Loại phiếu': d.type,
      'Ngày CT': d.voucherDate ? d.voucherDate.split('T')[0] : '',
      'Trạng thái': d.status === 1 ? 'Đã ghi sổ' : (d.status === 2 ? 'Chờ ghi sổ' : 'Đã huỷ'),
      'Tổng tiền': d.totalAmount
    }));
    console.table(logData);
    console.groupEnd();
  }
}, { deep: true });

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

// 3. Hàm Xử lý Xuất Excel
const handleExportData = async (exportData) => {
  try {
    toast.info("⏳ Đang xử lý xuất file Excel...");

    const params = {
      fromDate: exportData.fromDate || '',
      toDate: exportData.toDate || '',
      warehouseId: exportData.warehouseId || ''
    };

    const response = await inventoryStore.exportExcel(params);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `BaoCao_Kho_${dateStr}.xlsx`);

    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Xuất Excel thành công!");
  } catch (error) {
    console.error("Lỗi xuất Excel:", error);
    toast.error("Không thể tải file Excel. Vui lòng thử lại!");
  }
}

// 4. Mở trang Sửa (Nhận diện tự động Form nhập/xuất/chuyển theo docType)
const handleEditVoucher = (voucher) => {
  // Đảm bảo lấy đúng định dạng chữ hoa để so sánh
  const docType = voucher.type ? voucher.type.toUpperCase() : '';

  if (docType === 'INVENTORY_RECEIPT') {
    // Chuyển sang form Nhập kho, gắn thêm ?id=... để form biết là đang Sửa
    router.push({ name: 'InventoryReceiptCreate', query: { id: voucher.id } });
  } 
  else if (docType === 'INVENTORY_ISSUE') {
    // Chuyển sang form Xuất kho
    router.push({ name: 'InventoryIssueCreate', query: { id: voucher.id } });
  } 
  else if (docType === 'TRANSFER') {
    // Chuyển sang form Chuyển kho
    router.push({ name: 'InventoryTransferCreate', query: { id: voucher.id } });
  } 
  else {
    toast.error("Không hỗ trợ chỉnh sửa định dạng chứng từ này!");
  }
}

// ========================================================
// 5. CHỨC NĂNG XÓA CHUẨN (CÓ MODAL + BẮT LỖI BACKEND)
// ========================================================
const modalConfig = ref({
  isOpen: false,
  title: 'Xác nhận xóa',
  message: '',
  confirmText: 'Xóa chứng từ',
  confirmColorClass: 'btn-danger',
  voucherIdToDelete: null
});

// Mở modal xác nhận thay vì dùng confirm() mặc định
const openDeleteModal = (voucher) => {
  modalConfig.value.voucherIdToDelete = voucher.id;
  modalConfig.value.message = `Bạn có chắc chắn muốn xóa chứng từ số "${voucher.voucherNumber}" không? Hành động này sẽ xóa hoàn toàn dữ liệu khỏi hệ thống!`;
  modalConfig.value.isOpen = true;
}

const closeDeleteModal = () => {
  modalConfig.value.isOpen = false;
  modalConfig.value.voucherIdToDelete = null;
}

// Thực thi xóa khi ấn Đồng ý trên Modal
const executeDeleteVoucher = async () => {
  const id = modalConfig.value.voucherIdToDelete;
  if (!id) return;

  try {
    await inventoryStore.deleteDocument(id);
    toast.success("Đã xóa chứng từ thành công!");

    // Đóng modal và tải lại dữ liệu bảng
    closeDeleteModal();
    await fetchInventoryData({
      ...currentFilters.value,
      page: pagination.value.page
    });
  } catch (error) {
    console.error('Lỗi khi xóa:', error);
    // Bắt đúng chuỗi lỗi ném ra từ Store/Backend (Vd: Trạng thái Đã ghi sổ)
    const errorMsg = typeof error === 'string' ? error : "Có lỗi xảy ra khi kết nối máy chủ!";
    toast.error("" + errorMsg);
    closeDeleteModal();
  }
}

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
      <InventoryFilter @search="fetchInventoryData" @export="handleExportData" />

      <InventoryTable :items="tableData" :pagination="pagination" :is-loading="isLoading" @edit="handleEditVoucher"
        @delete="openDeleteModal" @page-change="handlePageChange" />
    </div>

    <InventoryDeleteModal :isOpen="modalConfig.isOpen" :title="modalConfig.title" :message="modalConfig.message"
      :confirmText="modalConfig.confirmText" :confirmColorClass="modalConfig.confirmColorClass"
      @close="closeDeleteModal" @confirm="executeDeleteVoucher" />
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