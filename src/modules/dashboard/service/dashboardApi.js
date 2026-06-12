import axios from 'axios';

const API_BASE_URL = 'https://localhost:7047/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const dashboardApi = {
    // ==========================================
    // NHÓM API DASHBOARD
    // ==========================================

    // 1. Lấy dữ liệu 5 thẻ KPI tổng quan
    getKpis(month, year) {
        return apiClient.get('/Dashboard/kpis', {
            params: { month, year }
        });
    },

    // 2. Lấy dữ liệu biểu đồ đường: Doanh thu - Chi phí - Lợi nhuận (12 tháng)
    getRevenueExpenseChart(year) {
        return apiClient.get('/Dashboard/revenue-expense', {
            params: { year }
        });
    },

    // 3. Lấy Top 5 Đối tác (Khách hàng hoặc Nhà cung cấp)
    getTopPartners(year, isCustomer) {
        return apiClient.get('/Dashboard/top-partners', {
            params: { year, isCustomer }
        });
    },

    // 4. Lấy dữ liệu biểu đồ cột kết hợp đường: Dòng tiền (12 tháng)
    getCashFlowChart(year) {
        return apiClient.get('/Dashboard/cash-flow', {
            params: { year }
        });
    },

    // 5. Lấy dữ liệu biểu đồ tròn: Cơ cấu doanh thu
    getRevenueStructure(year) {
        return apiClient.get('/Dashboard/revenue-structure', {
            params: { year }
        });
    },

    // 6. Xuất báo cáo Dashboard ra file Excel
    exportExcel(month, year) {
        return apiClient.get('/Dashboard/export-excel', {
            params: { month, year },
            responseType: 'blob' // Cấu hình bắt buộc để nhận file binary từ backend
        });
    }
};