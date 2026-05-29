import axios from 'axios';

const API_BASE_URL = 'https://localhost:7047/api';

// Tạo một instance axios riêng cho dễ quản lý header/interceptors sau này
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ...' // Thêm token nếu đồ án có phần đăng nhập
    }
});

export const ledgerApi = {
    /**
     * Gọi API Lấy dữ liệu Sổ cái
     * @param {Object} params - { FromDate, ToDate, AccountId, Keyword }
     */
    fetchGeneralLedger(params) {
        return apiClient.get('/ledger/general', { params });
    },

    /**
     * Gọi API Xuất file Excel
     * @param {Object} params - { FromDate, ToDate, AccountId, Keyword }
     */
    exportExcel(params) {
        return apiClient.get('/ledger/export', { 
            params,
            responseType: 'blob' // Rất quan trọng: Bắt buộc để tải file PDF/Excel
        });
    },

    getAccounts() {
        return apiClient.get('/accounts');
    }
};