<template>
    <div class="report-page">
        <div class="header-action">
            <button @click="$router.push('/reports')" class="btn-back"><i class="fas fa-arrow-left"></i></button>
            <h2 class="page-title">{{ reportName }}</h2>
        </div>

        <LedgerFilter :reportId="reportId" @filter="handleFetchData" />

        <div v-if="reportStore.isLoading" class="state-box loading-state">
            <div class="spinner"></div>
            <p>Đang kết xuất sổ sách kế toán...</p>
        </div>

        <div v-else-if="reportStore.error" class="state-box error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>{{ reportStore.error }}</p>
        </div>

        <LedgerViewer v-else-if="currentReportData" :reportId="reportId" :data="currentReportData" />

        <div v-else class="state-box empty-state">
            <i class="fas fa-book text-4xl mb-3"></i>
            <p>Vui lòng chọn thời gian và bấm "Xem sổ"</p>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useReportStore } from '../store/report.store.js';
import LedgerFilter from '../components/LedgerFilter.vue';
import LedgerViewer from '../components/LedgerViewer.vue'; // File sẽ tạo ở Bước 3

const route = useRoute();
const reportStore = useReportStore();

const reportId = computed(() => route.query.reportId);
const reportName = computed(() => route.query.reportName);

// Map dữ liệu từ Store
const currentReportData = computed(() => {
    if (reportId.value === 'general-ledger') return reportStore.generalLedgerData;
    if (reportId.value === 'cash-book') return reportStore.cashBookData;
    return null;
});

const handleFetchData = async (filterPayload) => {
    try {
        if (reportId.value === 'general-ledger') {
            await reportStore.fetchGeneralLedger(filterPayload);
        } else if (reportId.value === 'cash-book') {
            await reportStore.fetchCashBook(filterPayload);
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
};

onMounted(() => {
    reportStore.resetState();
    reportStore.generalLedgerData = null;
    reportStore.cashBookData = null;
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
    width: 40px;
    height: 40px;
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

.state-box {
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 60px 20px;
    text-align: center;
}

.loading-state p {
    color: #64748b;
    font-weight: 500;
}

.spinner {
    border: 4px solid #f1f5f9;
    border-top: 4px solid #f59e0b;
    border-radius: 50%;
    width: 44px;
    height: 44px;
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

.error-state {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
}

.empty-state {
    color: #94a3b8;
    border-style: dashed;
}
</style>