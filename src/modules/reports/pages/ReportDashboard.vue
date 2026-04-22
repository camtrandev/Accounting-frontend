<template>
    <div class="report-dashboard-container">
        <div class="page-header">
            <div class="header-title-wrapper">
                <h2 class="page-title">Trung tâm Báo cáo</h2>
                <p class="page-subtitle">Quản lý và tra cứu các báo cáo hệ thống</p>
            </div>

            <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input type="text" v-model="searchQuery" placeholder="Tìm kiếm tên báo cáo..." />
                <i v-if="searchQuery" @click="searchQuery = ''" class="fas fa-times-circle clear-icon"></i>
            </div>
        </div>

        <div class="report-groups">
            <div v-for="(group, index) in filteredReportGroups" :key="index" class="report-group-card">
                <div class="group-header">
                    <div class="icon-box" :class="group.colorClass">
                        <i :class="group.icon"></i>
                    </div>
                    <h3 class="group-title">{{ group.title }}</h3>
                </div>

                <ul class="report-list">
                    <li v-for="report in group.reports" :key="report.id" class="report-item"
                        @click="openReport(report.route)">
                        <div class="report-item-content">
                            <i class="far fa-file-alt document-icon"></i>
                            <span class="report-name" :title="report.name">{{ report.name }}</span>
                        </div>
                        <div class="action-area">
                            <span class="view-text">Xem</span>
                            <i class="fas fa-arrow-right arrow-icon"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div v-if="filteredReportGroups.length === 0" class="empty-state">
            <div class="empty-state-content">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="No reports"
                    class="empty-icon" />
                <h3>Không tìm thấy kết quả</h3>
                <p>Không có báo cáo nào phù hợp với từ khóa <strong>"{{ searchQuery }}"</strong></p>
                <button @click="searchQuery = ''" class="btn-clear-search">Xóa tìm kiếm</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const reportGroups = ref([
    {
        title: 'Báo cáo Tài chính',
        icon: 'fas fa-chart-line', // Icon biểu đồ xu hướng
        colorClass: 'theme-purple',
        reports: [
            { id: 'f1', name: 'Bảng cân đối kế toán', route: 'ReportBalanceSheet' },
            { id: 'f2', name: 'Báo cáo kết quả hoạt động kinh doanh', route: 'ReportPNL' },
            { id: 'f3', name: 'Báo cáo lưu chuyển tiền tệ', route: 'ReportCashFlow' }
        ]
    },
    {
        title: 'Báo cáo Kho - Vật tư',
        icon: 'fas fa-warehouse', // Icon nhà kho chuyên dụng
        colorClass: 'theme-blue',
        reports: [
            { id: 'i1', name: 'Báo cáo tổng hợp tồn kho', route: 'ReportInventorySummary' },
            { id: 'i2', name: 'Sổ chi tiết vật tư hàng hóa', route: 'ReportInventoryDetail' },
            { id: 'i3', name: 'Báo cáo hàng chậm luân chuyển', route: 'ReportSlowMoving' }
        ]
    },
    {
        title: 'Bán hàng & Công nợ',
        icon: 'fas fa-file-invoice-dollar', // Icon hóa đơn & tiền tệ
        colorClass: 'theme-green',
        reports: [
            { id: 's1', name: 'Tổng hợp doanh thu theo mặt hàng', route: 'ReportSalesByItem' },
            { id: 's2', name: 'Tổng hợp công nợ phải thu khách hàng', route: 'ReportReceivables' }
        ]
    },
    {
        title: 'Sổ cái & Tiền mặt',
        icon: 'fas fa-vault', // Icon két sắt/ngân quỹ
        colorClass: 'theme-orange',
        reports: [
            { id: 'c1', name: 'Sổ nhật ký chung', route: 'ReportGeneralJournal' },
            { id: 'c2', name: 'Sổ quỹ tiền mặt', route: 'ReportCashBook' }
        ]
    }
])

const filteredReportGroups = computed(() => {
    if (!searchQuery.value) return reportGroups.value
    const query = searchQuery.value.toLowerCase()
    return reportGroups.value.map(group => {
        const filteredReports = group.reports.filter(r => r.name.toLowerCase().includes(query))
        return { ...group, reports: filteredReports }
    }).filter(group => group.reports.length > 0)
})

const openReport = (routeName) => {
    if (!routeName) return
    console.log('Điều hướng đến Báo cáo:', routeName)
}
</script>

<style scoped>
/* FIX TRÀN LAYOUT CHUẨN: Ép tất cả phần tử tôn trọng border */
*,
*::before,
*::after {
    box-sizing: border-box;
}

/* 1. KHÓA KHUNG CONTAINER */
.report-dashboard-container {
    width: 100%;
    min-width: 0;
    padding: 24px 32px;
    background-color: transparent;
    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
}

/* Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
}

.header-title-wrapper {
    flex: 1;
    min-width: 250px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
}

.page-subtitle {
    margin: 0;
    color: #64748b;
    font-size: 14px;
}

/* Ô tìm kiếm linh hoạt */
.search-box {
    position: relative;
    width: 100%;
    max-width: 320px;
    flex-shrink: 0;
}

.search-box .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 14px;
}

.search-box .clear-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #cbd5e1;
    cursor: pointer;
    font-size: 14px;
}

.search-box .clear-icon:hover {
    color: #ef4444;
}

.search-box input {
    width: 100%;
    height: 42px;
    padding: 0 36px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background-color: #ffffff;
    font-size: 14px;
    color: #334155;
    outline: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
}

.search-box input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* 2. LƯỚI BÁO CÁO: Luôn chia tối đa 2 cột trên màn hình rộng */
.report-groups {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 24px;
    width: 100%;
    max-width: 1600px;
    /* Chống bị kéo giãn quá mức trên màn hình cực to */
}

@media (min-width: 768px) {
    .report-groups {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* Cards bo góc, bóng đổ mịn */
.report-group-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.report-group-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.group-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #e2e8f0;
}

.icon-box {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.theme-purple {
    background-color: #f3e8ff;
    color: #9333ea;
}

.theme-blue {
    background-color: #e0f2fe;
    color: #0284c7;
}

.theme-green {
    background-color: #dcfce7;
    color: #16a34a;
}

.theme-orange {
    background-color: #ffedd5;
    color: #ea580c;
}

.group-title {
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.report-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* Hover Items */
.report-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.report-item-content {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
}

.document-icon {
    color: #94a3b8;
    font-size: 14px;
    flex-shrink: 0;
}

.report-name {
    color: #475569;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.action-area {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s;
    flex-shrink: 0;
}

.view-text {
    font-size: 12px;
    font-weight: 600;
    color: #6366f1;
}

.arrow-icon {
    font-size: 11px;
    color: #6366f1;
}

.report-item:hover {
    background-color: #f8fafc;
    border-color: #e2e8f0;
}

.report-item:hover .document-icon {
    color: #6366f1;
}

.report-item:hover .report-name {
    color: #0f172a;
}

.report-item:hover .action-area {
    opacity: 1;
    transform: translateX(0);
}

/* Empty State */
.empty-state {
    display: flex;
    justify-content: center;
    padding: 60px 20px;
    width: 100%;
}

.empty-state-content {
    text-align: center;
    background: #ffffff;
    padding: 40px;
    border-radius: 16px;
    border: 1px dashed #cbd5e1;
    width: 100%;
    max-width: 400px;
}

.empty-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-state-content h3 {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 16px;
}

.empty-state-content p {
    color: #64748b;
    margin: 0 0 20px 0;
    font-size: 13px;
}

.btn-clear-search {
    background-color: #6366f1;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s;
}

.btn-clear-search:hover {
    background-color: #4f46e5;
}
</style>