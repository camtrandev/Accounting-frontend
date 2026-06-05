<template>
  <div class="report-page">
    <div class="header-action">
      <button @click="$router.push('/reports')" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2 class="page-title">{{ reportName }}</h2>
    </div>

    <ReportFilter 
      :showFromDate="true" 
      @filter="handleFetchData" 
    />

    <div v-if="reportStore.isLoading" class="state-box loading-state">
      <div class="spinner"></div>
      <p>Đang tính toán số liệu tài chính...</p>
    </div>

    <div v-else-if="reportStore.error" class="state-box error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ reportStore.error }}</p>
      <button @click="retryFetch" class="btn-retry mt-4">Thử lại</button>
    </div>

    <ReportViewer 
      v-else-if="currentReportData" 
      :reportId="reportId" 
      :data="currentReportData" 
    />

    <div v-else class="state-box empty-state">
      <i class="fas fa-filter text-4xl mb-3"></i>
      <p>Vui lòng chọn thời gian và bấm "Xem báo cáo"</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// Import store báo cáo bạn vừa tạo
import { useReportStore } from '../store/report.store.js'; 
import ReportFilter from '../components/ReportFilter.vue';
import ReportViewer from '../components/ReportViewer.vue';

const route = useRoute();
const reportStore = useReportStore();

// Đọc ID báo cáo từ URL (VD: 'balance-sheet' hoặc 'income-statement')
const reportId = computed(() => route.query.reportId);
const reportName = computed(() => route.query.reportName);

// Lưu lại tham số lọc để dùng cho nút Thử lại
const lastFilter = ref(null);

// Lấy dữ liệu từ State của Pinia Store tương ứng với loại báo cáo
const currentReportData = computed(() => {
  if (reportId.value === 'balance-sheet') return reportStore.balanceSheetData;
  if (reportId.value === 'income-statement') return reportStore.incomeStatementData;
  return null;
});

// Chức năng: Gọi hàm Action trong Store khi ấn nút Lọc
const handleFetchData = async (filterParams) => {
  lastFilter.value = filterParams;
  try {
    if (reportId.value === 'balance-sheet') {
      // Bảng CĐKT tính tại 1 thời điểm -> Chỉ truyền toDate
      await reportStore.fetchBalanceSheet({ toDate: filterParams.toDate });
    } 
    else if (reportId.value === 'income-statement') {
      // KQKD tính trong 1 kỳ -> Truyền cả fromDate và toDate
      await reportStore.fetchIncomeStatement(filterParams);
    }
  } catch (error) {
    console.error("Lỗi khi kéo dữ liệu báo cáo:", error);
  }
};

const retryFetch = () => {
  if (lastFilter.value) handleFetchData(lastFilter.value);
};

// Reset State để xóa dữ liệu cũ khi vừa vào trang
onMounted(() => {
  reportStore.resetState();
  reportStore.balanceSheetData = null;
  reportStore.incomeStatementData = null;
});
</script>
<style scoped>
.report-page {
    padding: 30px;
    background-color: #f8fafc;
    min-height: 100vh;
}

.header-action {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.btn-back {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #475569;
    margin-right: 16px;
    transition: all 0.2s;
}

.btn-back:hover {
    background: #f1f5f9;
    color: #0f172a;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.loading-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-state p {
    color: #64748b;
    font-weight: 500;
}

.error-state {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    text-align: center;
    padding: 40px;
    border-radius: 12px;
}

.error-state i {
    font-size: 32px;
    margin-bottom: 12px;
}
</style>