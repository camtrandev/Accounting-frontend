<template>
  <div class="ledger-container">
    <header class="ledger-header">
      <h1>Sổ Cái Tổng Hợp</h1>
      <span class="subtitle">Kỳ kế toán: Tháng 04/2026</span>
    </header>

    <LedgerSummaryCards :summaryData="summary" />

    <LedgerToolbar @onFilter="handleFilter" @onExport="handleExport" />

    <LedgerTable 
      :data="ledgerEntries" 
      :loading="isLoading" 
      @viewDetail="openDetailModal" 
    />

    <LedgerDetailModal 
      v-if="isModalOpen" 
      :detailData="selectedEntry" 
      @close="isModalOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LedgerSummaryCards from '../components/LedgerSummaryCards.vue';
import LedgerToolbar from '../components/LedgerToolbar.vue';
import LedgerTable from '../components/LedgerTable.vue';
import LedgerDetailModal from '../components/LedgerDetailModal.vue';
import ledgerService from '../service/ledger.service';

// State quản lý
const ledgerEntries = ref([]);
const summary = ref({ totalDebit: 0, totalCredit: 0, balance: 0 });
const isLoading = ref(false);
const isModalOpen = ref(false);
const selectedEntry = ref(null);

// Logic lấy dữ liệu thật (Mapping service)
const fetchLedgerData = async (filters = {}) => {
  isLoading.value = true;
  try {
    const response = await ledgerService.getAll(filters);
    ledgerEntries.value = response.data;
    summary.value = response.summary;
  } finally {
    isLoading.value = false;
  }
};

const openDetailModal = (item) => {
  selectedEntry.value = item;
  isModalOpen.value = true;
};

const handleFilter = (filters) => {
  fetchLedgerData(filters);
};

onMounted(() => fetchLedgerData());
</script>

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