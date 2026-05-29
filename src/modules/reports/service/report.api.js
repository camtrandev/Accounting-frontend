import axios from 'axios';

const API_BASE_URL = 'https://localhost:7047/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const reportApi = {
    // ==========================================
    // 0. NHÓM DỮ LIỆU NỀN (MASTER DATA) - ĐÃ CÓ
    // ==========================================
    getWarehouses() {
        return apiClient.get('/Warehouse');
    },
    getItems() {
        return apiClient.get('/Items');
    },
    getPartners() {
        return apiClient.get('/Partner');
    },

    // ==========================================
    // 1. NHÓM TÀI CHÍNH - MỚI THÊM
    // ==========================================
    getIncomeStatement(params) {
        return apiClient.get('/reports/financial/income-statement', { params });
    },
    getBalanceSheet(params) {
        return apiClient.get('/reports/financial/balance-sheet', { params });
    },
    // Chờ phát triển thêm nếu đồ án yêu cầu:
    // getCashFlow(params) { return apiClient.get('/reports/financial/cash-flow', { params }); }, 

    // ==========================================
    // 2. NHÓM KHO & VẬT TƯ - CŨ + MỚI
    // ==========================================
    // Cũ
    getStockReport(params) {
        return apiClient.get('/inventory/stock-report', { params });
    },
    exportStockExcel(params) {
        // Cần 'blob' để trình duyệt hiểu đây là file tải về
        return apiClient.get('/inventory/export-excel', { params, responseType: 'blob' });
    },
    getItemInfo(itemId) {
        return apiClient.get(`/inventory/${itemId}`);
    },
    // Mới
    getInventoryDetail(params) {
        return apiClient.get('/reports/inventory/detail', { params });
    },
    getSlowMovingItems(params) {
        return apiClient.get('/reports/inventory/slow-moving', { params });
    },

    // ==========================================
    // 3. NHÓM BÁN HÀNG & CÔNG NỢ - CŨ + MỚI
    // ==========================================
    // Cũ
    getDebtByPartner(partnerId) {
        return apiClient.get(`/debt/${partnerId}`);
    },
    // Mới
    getRevenueByItem(params) {
        return apiClient.get('/reports/sales/revenue-by-item', { params });
    },
    getDebtSummary(params) {
        return apiClient.get('/reports/sales/debt-summary', { params });
    },

    // ==========================================
    // 4. NHÓM SỔ CÁI & TIỀN MẶT - CŨ + MỚI
    // ==========================================
    // Cũ
    getGeneralLedger(params) {
        return apiClient.get('/ledger/general', { params });
    },
    exportLedgerExcel(params) {
        return apiClient.get('/ledger/export', { params, responseType: 'blob' });
    },
    // Mới
    getCashBook(params) {
        return apiClient.get('/reports/cash/cash-book', { params });
    }
};