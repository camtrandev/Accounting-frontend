<template>
  <div class="inventory-dashboard-container">
    <div class="page-header">
      <h2 class="page-title">Quản lý Kho</h2>
      <div class="header-actions">
        <button class="btn-primary" @click="createNewReceipt">
          <i class="fas fa-plus"></i> Thêm Phiếu Nhập
        </button>
      </div>
    </div>

    <div class="section-container">
      <InventoryQuickActions />
    </div>

    <div class="section-container data-section">
      <InventoryFilter @search="fetchInventoryData" />

      <InventoryTable :items="tableData" :is-loading="isLoading" @edit="handleEditVoucher" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InventoryQuickActions from '../components/InventoryQuickActions.vue'
import InventoryFilter from '../components/InventoryFilter.vue'
import InventoryTable from '../components/InventoryTable.vue'

const tableData = ref([])
const isLoading = ref(false)

// Hàm giả lập gọi API (Sau này thay bằng axios gọi lên backend C# .NET)
const fetchInventoryData = async (filters) => {
  console.log('Đang lấy dữ liệu với bộ lọc:', filters)
  isLoading.value = true

  // Giả lập delay mạng 1 giây
  setTimeout(() => {
    tableData.value = [
      { id: 1, date: '2026-04-21', voucherNumber: 'NK-2604-001', type: 'receipt', description: 'Nhập linh kiện cho dự án MinePhone', totalAmount: 45000000, isPosted: true },
      { id: 2, date: '2026-04-20', voucherNumber: 'XK-2604-001', type: 'issue', description: 'Xuất bán máy tính cho khách hàng Tuấn', totalAmount: 12500000, isPosted: false },
      { id: 3, date: '2026-04-18', voucherNumber: 'CK-2604-001', type: 'transfer', description: 'Chuyển hàng từ kho Tổng sang kho Cửa hàng', totalAmount: 8500000, isPosted: true }
    ]
    isLoading.value = false
  }, 1000)
}

const handleEditVoucher = (voucher) => {
  console.log('Sửa chứng từ:', voucher.voucherNumber)
}

onMounted(() => {
  // Lấy dữ liệu lần đầu khi trang vừa load xong
  fetchInventoryData({})
})

const createNewReceipt = () => {
  router.push({ name: 'InventoryReceiptCreate' })
}

</script>

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