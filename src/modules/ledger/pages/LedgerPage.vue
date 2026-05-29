<template>
  <div class="ledger-container">
    <header class="ledger-header">
      <div class="header-title">
        <h1>Sổ Cái Tổng Hợp</h1>
        <span class="subtitle">{{ currentPeriodText }}</span>
      </div>
    </header>

    <main class="ledger-content">
      <LedgerSummaryCards :summaryData="ledgerStore.summary" />

      <div class="toolbar-section">
        <LedgerToolbar :accounts="ledgerStore.accountList" @onFilter="handleFilter" @onExport="handleExport" />
      </div>

      <div class="table-section">
        <LedgerTable :data="ledgerStore.transactions" :loading="ledgerStore.isLoading"
          :openingBalance="ledgerStore.summary.openingBalance" :closingBalance="ledgerStore.summary.closingBalance"
          :totalDebit="ledgerStore.summary.totalDebit" :totalCredit="ledgerStore.summary.totalCredit"
          :currentAccountCode="currentFilters.accountNumber || 'Tất cả'" @viewDetail="openDetailModal" />
      </div>
    </main>

    <LedgerDetailModal v-if="isModalOpen" :detailData="selectedEntry" @close="isModalOpen = false" />

    <LedgerExportModal v-if="isExportModalOpen" :initialFilters="currentFilters" :accounts="ledgerStore.accountList"
      @close="isExportModalOpen = false" @confirm="executeExport" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLedgerStore } from '../store/ledger.store';
import LedgerSummaryCards from '../components/LedgerSummaryCards.vue';
import LedgerToolbar from '../components/LedgerToolbar.vue';
import LedgerTable from '../components/LedgerTable.vue';
import LedgerDetailModal from '../components/LedgerDetailModal.vue';
import LedgerExportModal from '../components/LedgerExportModal.vue';

// --- STORE & STATE ---
const ledgerStore = useLedgerStore();

const isModalOpen = ref(false);
const isExportModalOpen = ref(false);
const selectedEntry = ref(null);
const currentFilters = ref({
  startDate: '',
  endDate: '',
  accountNumber: '',
  keyword: ''
});

// --- COMPUTED ---
// Tự động render câu "Kỳ kế toán: Từ ... đến ..." cho đẹp mắt
const currentPeriodText = computed(() => {
  const start = currentFilters.value.startDate;
  const end = currentFilters.value.endDate;

  if (start && end) {
    const format = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');
    return `Kỳ kế toán: Từ ${format(start)} đến ${format(end)}`;
  }
  return 'Kỳ kế toán: Tháng hiện tại';
});

// --- HELPER METHODS ---
const mapToApiParams = (filters) => ({
  FromDate: filters.startDate,
  ToDate: filters.endDate,
  AccountId: filters.accountNumber,
  Keyword: filters.keyword
});

// --- ACTION HANDLERS ---
const handleFilter = (filters) => {
  currentFilters.value = filters;
  const apiParams = mapToApiParams(filters);
  ledgerStore.getLedgerData(apiParams);
};

const handleExport = (filters) => {
  // Đồng bộ lại filter từ toolbar trước khi ném vào Modal
  currentFilters.value = { ...currentFilters.value, ...filters };
  isExportModalOpen.value = true;
};

const executeExport = async (finalFilters) => {
  const apiParams = mapToApiParams(finalFilters);
  await ledgerStore.downloadLedgerExcel(apiParams);
  isExportModalOpen.value = false; // Tắt modal sau khi tải xong
};

const openDetailModal = (item) => {
  selectedEntry.value = item;
  isModalOpen.value = true;
};

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  // 1. Lấy danh sách tài khoản (Quan trọng: Phải có hàm này thì Dropdown mới có data)
  await ledgerStore.fetchAllAccounts();

  // 2. Thiết lập ngày mặc định (Đầu tháng -> Cuối tháng)
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

  // 3. Gọi dữ liệu mặc định lần đầu
  handleFilter({
    startDate: firstDay,
    endDate: lastDay,
    accountNumber: '',
    keyword: ''
  });
});
</script>

<style scoped>
/* Base Layout chuẩn Enterprise */
.ledger-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f5f8;
  /* Màu nền xám nhạt làm nổi bật các khối trắng */
  padding: 16px 24px;
}

/* Header */
.ledger-header {
  margin-bottom: 20px;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin: 0 0 4px 0;
}

.header-title .subtitle {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

/* Content wrapper */
.ledger-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

/* Các section bọc bên ngoài component con để tạo bóng (shadow) */
.toolbar-section {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.table-section {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex: 1;
  overflow: hidden;
  /* Tránh bảng bị tràn ra ngoài viền cong */
  display: flex;
  flex-direction: column;
}
</style>
<style scoped>
.ledger-container {
  padding: 24px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.ledger-header h1 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.subtitle {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>