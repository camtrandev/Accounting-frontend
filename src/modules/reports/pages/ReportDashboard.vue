<template>
    <div class="dashboard-page">
        <div class="page-header">
            <div class="header-text">
                <h2>Trung tâm Báo cáo</h2>
                <p>Quản lý và tra cứu các báo cáo hệ thống</p>
            </div>

            <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input type="text" v-model="searchQuery" placeholder="Tìm kiếm tên báo cáo..." />
                <i v-if="searchQuery" @click="searchQuery = ''" class="fas fa-times-circle clear-icon"></i>
            </div>
        </div>

        <div class="report-grid">
            <FinancialReportCard :reports="filteredFinancial" @open-report="handleOpenReport" />

            <InventoryReportCard :reports="filteredInventory" @open-report="handleOpenReport" />

            <SalesReportCard :reports="filteredSales" @open-report="handleOpenReport" />

            <LedgerReportCard :reports="filteredLedger" @open-report="handleOpenReport" />
        </div>

        <div v-if="isAllEmpty" class="empty-state">
            <i class="fas fa-box-open empty-icon"></i>
            <h3>Không tìm thấy kết quả</h3>
            <p>Không có báo cáo nào phù hợp với từ khóa <strong>"{{ searchQuery }}"</strong></p>
            <button @click="searchQuery = ''" class="btn-clear">Xóa tìm kiếm</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Import 4 component con
import FinancialReportCard from '../components/FinancialReportCard.vue';
import InventoryReportCard from '../components/InventoryReportCard.vue';
import SalesReportCard from '../components/SalesReportCard.vue';
import LedgerReportCard from '../components/LedgerReportCard.vue';

const router = useRouter();
const searchQuery = ref('');

// Quản lý State: Phân tách rõ 4 danh sách báo cáo
const financialReports = ref([
    { id: 'balance-sheet', name: 'Bảng cân đối kế toán' },
    { id: 'income-statement', name: 'Báo cáo kết quả hoạt động kinh doanh' },
    
]);

const inventoryReports = ref([
    { id: 'stock-report', name: 'Báo cáo tổng hợp tồn kho' },
    { id: 'inventory-detail', name: 'Sổ chi tiết vật tư hàng hóa' },
]);

const salesReports = ref([
    { id: 'revenue-by-item', name: 'Tổng hợp doanh thu theo mặt hàng' },
    { id: 'debt-summary', name: 'Tổng hợp công nợ phải thu khách hàng' }
]);

const ledgerReports = ref([
    { id: 'general-ledger', name: 'Sổ nhật ký chung' },
    { id: 'cash-book', name: 'Sổ quỹ tiền mặt' }
]);

// Hàm Helper để tái sử dụng logic filter
const filterReports = (reportsArray) => {
    if (!searchQuery.value) return reportsArray;
    const query = searchQuery.value.toLowerCase();
    return reportsArray.filter(r => r.name.toLowerCase().includes(query));
};

// Computed Properties để tự động lọc khi người dùng gõ tìm kiếm
const filteredFinancial = computed(() => filterReports(financialReports.value));
const filteredInventory = computed(() => filterReports(inventoryReports.value));
const filteredSales = computed(() => filterReports(salesReports.value));
const filteredLedger = computed(() => filterReports(ledgerReports.value));

// Tính toán xem có phải tất cả các mảng đều rỗng hay không (để hiện màn hình trống)
const isAllEmpty = computed(() => {
    return filteredFinancial.value.length === 0 &&
        filteredInventory.value.length === 0 &&
        filteredSales.value.length === 0 &&
        filteredLedger.value.length === 0;
});

// Điều hướng tập trung
const handleOpenReport = (report) => {
    let targetRouteName = '';

    // 1. Nhóm Báo cáo Tài chính
    if (['balance-sheet', 'income-statement'].includes(report.id)) {
        targetRouteName = 'FinancialReport';
    } 
    // 2. Nhóm Báo cáo Kho - Vật tư
    else if (['stock-report', 'inventory-detail', 'slow-moving'].includes(report.id)) {
        targetRouteName = 'InventoryReport';
    }
    // 3. Nhóm Báo cáo Bán hàng & Công nợ
    else if (['revenue-by-item', 'debt-summary'].includes(report.id)) {
        targetRouteName = 'SalesReport';
    }
    // 4. Nhóm Sổ cái & Tiền mặt
    else if (['general-ledger', 'cash-book'].includes(report.id)) {
        targetRouteName = 'LedgerReport';
    }
    
    // Nếu chưa được cấu hình thì báo lỗi ra console để debug
    if (!targetRouteName) {
        console.warn('Chưa cấu hình Route cho báo cáo có ID:', report.id);
        return;
    }

    // Thực hiện chuyển hướng kèm theo param để trang con biết đang xem báo cáo nào
    router.push({
        name: targetRouteName,
        query: { reportId: report.id, reportName: report.name }
    });
};
</script>

<style scoped>
.dashboard-page {
    padding: 30px;
    background-color: #f8fafc;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.header-text h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
}

.header-text p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.search-box {
    position: relative;
    width: 320px;
}

.search-box input {
    width: 100%;
    padding: 10px 36px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    background: white;
    transition: all 0.3s;
}

.search-box input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
}

.clear-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    cursor: pointer;
}

.clear-icon:hover {
    color: #ef4444;
}

.report-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}

@media (max-width: 1024px) {
    .report-grid {
        grid-template-columns: 1fr;
    }

    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .search-box {
        width: 100%;
    }
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
    border: 1px dashed #cbd5e1;
    margin-top: 20px;
}

.empty-icon {
    font-size: 48px;
    color: #cbd5e1;
    margin-bottom: 16px;
}

.empty-state h3 {
    margin: 0 0 8px 0;
    color: #1e293b;
}

.empty-state p {
    color: #64748b;
    margin-bottom: 16px;
}

.btn-clear {
    background: #eff6ff;
    color: #3b82f6;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
}

.btn-clear:hover {
    background: #dbeafe;
}
</style>