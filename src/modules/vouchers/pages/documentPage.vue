<template>
  <div class="document-page">
    <DocumentToolbar :is-admin="isAdmin" :pending-count="pendingCount" @open-approval="openApprovalList"
      @create="handleCreateNew" @export="handleExportExcel" />

    <div class="filter-section">
      <div class="search-box">
        <input type="text" v-model="filters.search" placeholder="Tìm theo số chứng từ..." />
      </div>
      <div class="filter-group">
        <select v-model="filters.type">
          <option value="">Tất cả loại CT</option>
          <option value="PURCHASE">Hóa đơn mua hàng</option>
          <option value="SALE">Hóa đơn bán hàng</option>
          <option value="RECEIPT">Phiếu thu</option>
          <option value="PAYMENT">Phiếu chi</option>
        </select>
        <select v-model="filters.status">
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đã ghi sổ</option>
          <option value="0">Bản nháp</option>
          <option value="2">Chờ duyệt</option>
        </select>
      </div>
    </div>

    <DocumentTable 
      :documents="paginatedDocuments" 
      @edit="handleEdit" 
      @delete="handleDelete" 
    />

    <Pagination 
      :total-items="filteredDocuments.length" 
      v-model:current-page="currentPage"
      v-model:page-size="pageSize" 
    />

    <ApprovalListModal v-if="showApprovalModal" :pending-list="vStore.pendingVouchers"
      @close="showApprovalModal = false" @refresh="vStore.fetchPendingVouchers()" />
  </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive, watch } from 'vue';
import { useAuthStore } from '../../../stores/auth.store';
import { useVouchersStore } from '../store/vouchers.store';
import { useToast } from "vue-toastification";
import DocumentToolbar from '../components/DocumentToolbar.vue';
import DocumentTable from '../components/DocumentTable.vue';
import ApprovalListModal from '../components/ApprovalListModal.vue';
import Pagination from '../components/Pagination.vue';

// STATE PHÂN TRANG
const currentPage = ref(1);
const pageSize = ref(10); // Mặc định 10 chứng từ / trang

const authStore = useAuthStore();
const vStore = useVouchersStore();
const toast = useToast();

const showApprovalModal = ref(false);
const filters = reactive({
  search: '',
  type: '',
  status: '',
  fromDate: '',
  toDate: ''
});

const isAdmin = computed(() => authStore.userRole === 'Admin');
const pendingCount = computed(() => vStore.pendingVouchers?.length || 0);

// BƯỚC 1: LỌC DỮ LIỆU DỰA TRÊN TÌM KIẾM/LOẠI/TRẠNG THÁI
const filteredDocuments = computed(() => {
  const rawData = vStore.vouchers || [];
  return rawData.filter(doc => {
    const searchStr = filters.search.toLowerCase();
    const docNo = doc.documentNo?.toLowerCase() || '';
    const partnerName = doc.partnerName?.toLowerCase() || '';

    const matchSearch = docNo.includes(searchStr) || partnerName.includes(searchStr);
    const matchType = filters.type ? doc.docType?.toUpperCase() === filters.type.toUpperCase() : true;
    const matchStatus = filters.status !== '' ? doc.status === parseInt(filters.status) : true;

    return matchSearch && matchType && matchStatus;
  });
});

// Khi đổi bộ lọc, phải reset trang về 1 để không bị lỗi trang trắng
watch(filters, () => {
  currentPage.value = 1;
}, { deep: true });

// BƯỚC 2: CẮT MẢNG ĐÃ LỌC THÀNH TRANG ĐỂ TRUYỀN XUỐNG COMPONENT CON
const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredDocuments.value.slice(start, end);
});

onMounted(async () => {
  if (isAdmin.value) await vStore.fetchPendingVouchers();
  await vStore.fetchAllVouchers(); 
});

const openApprovalList = () => { showApprovalModal.value = true; };
const handleCreateNew = () => { console.log("Mở form thêm mới"); };
const handleEdit = (doc) => { console.log("Sửa chứng từ:", doc); };
const handleDelete = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa chứng từ này?")) {
    console.log("Đã xóa ID:", id);
  }
};
const handleExportExcel = () => { toast.success("Hệ thống đang chuẩn bị tệp Excel..."); };
</script>

<style scoped>
.document-page {
  padding: 24px;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  flex-wrap: wrap;
  gap: 12px;
}

.search-box input {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 300px;
  outline: none;
  transition: all 0.2s;
}

.search-box input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  color: #4a5568;
}
</style>