import axios from 'axios';

const API_BASE_URL = 'https://localhost:7047/api';

const inventoryApi = {
    // ====================================================
    // 1. NGHIỆP VỤ CHỨNG TỪ (Nhập / Xuất / Chuyển kho)
    // ====================================================
    getDocuments(params) {
        return axios.get(`${API_BASE_URL}/inventory/vouchers`, { params });
    },
    createDocument(data) {
        return axios.post(`${API_BASE_URL}/documents`, data);
    },
    postDocument(id) {
        // Ghi sổ chứng từ
        return axios.post(`${API_BASE_URL}/documents/${id}/post`);
    },
    rejectDocument(id) {
        // Bỏ ghi sổ / Từ chối
        return axios.post(`${API_BASE_URL}/documents/${id}/reject`);
    },
    getDocumentPrint(id) {
        return axios.get(`${API_BASE_URL}/documents/${id}/print`);
    },

    updateDocument(id, data) {
        return axios.put(`${API_BASE_URL}/documents/${id}`, data);
    },
    getDocumentById(id) {
        return axios.get(`${API_BASE_URL}/documents/${id}`);
    },

   
    deleteDocument(id) {
        return axios.delete(`${API_BASE_URL}/documents/${id}`);
    },

    // ====================================================
    // 2. NGHIỆP VỤ DANH MỤC NỀN & TỒN KHO
    // ====================================================
    getWarehouses() {
        return axios.get(`${API_BASE_URL}/Warehouse`);
    },
    getPartners() {
        return axios.get(`${API_BASE_URL}/Partner`);
    },
    getItems() {
        return axios.get(`${API_BASE_URL}/Items`);
    },
    getStockReport(params) {
        return axios.get(`${API_BASE_URL}/inventory/stock-report`, { params });
    },
    checkStock(itemId, warehouseId) {
        return axios.get(`${API_BASE_URL}/inventory/check-stock`, {
            params: { itemId, warehouseId }
        });
    },
    getStockByWarehouse(warehouseId) {
        // Đã sửa 'axiosClient' thành 'axios' để đồng bộ với toàn file
        return axios.get(`${API_BASE_URL}/Items/get-stock-by-warehouse/${warehouseId}`);
    },

    // ====================================================
    // 3. TÍNH GIÁ VỐN & XUẤT BÁO CÁO
    // ====================================================
    calculatePrice(data) {
        return axios.post(`${API_BASE_URL}/inventory/calculate-price`, data);
    },
    exportExcel(params) {
        return axios.get(`${API_BASE_URL}/inventory/export-excel`, {
            params,
            responseType: 'blob' // Bắt buộc giữ nguyên để tải file đúng định dạng
        });
    }
};

export default inventoryApi;