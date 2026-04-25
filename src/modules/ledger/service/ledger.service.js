// service/ledger.service.js
import axios from 'axios';

const API_URL = 'https://your-api-domain.com/api/ledger';

export default {
    /**
     * Lấy danh sách sổ cái có lọc và phân trang
     * @param {Object} params { startDate, endDate, accountCode, pageSize, pageNumber }
     */
    async getAll(params) {
        try {
            // Giả lập gọi API thật
            const response = await axios.get(`${API_URL}/get-all`, { params });
            return response.data; 
        } catch (error) {
            console.error("Error fetching ledger:", error);
            throw error;
        }
    },

    /**
     * Lấy chi tiết một chứng từ từ sổ cái
     * @param {String} refId ID của chứng từ
     */
    async getDetail(refId) {
        return await axios.get(`${API_URL}/detail/${refId}`);
    },

    /**
     * Xuất file Excel sổ cái
     */
    async exportExcel(params) {
        return await axios.get(`${API_URL}/export`, { 
            params, 
            responseType: 'blob' // Quan trọng để tải file
        });
    }
};