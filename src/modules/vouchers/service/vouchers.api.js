import axios from 'axios';

const API_BASE_URL = 'https://localhost:7047'; 

export const vouchersApi = {
    // --- OCR (Bạn đã có) ---
    scanOcrDocument: async (file, docType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/ocr`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 180000 
            });
            return response.data;
        } catch (error) { throw error; }
    },

    // --- LẤY DỮ LIỆU DANH MỤC (LOAD DATA) ---
    getPartners: async () => {
        const res = await axios.get(`${API_BASE_URL}/api/Partner`);
        return res.data; // Giả sử trả về ServiceResult { data: [...] }
    },

    getProducts: async () => {
        const res = await axios.get(`${API_BASE_URL}/api/Inventory/Products`);
        return res.data;
    },

    getAccounts: async () => {
        const res = await axios.get(`${API_BASE_URL}/api/Account`);
        return res.data;
    },

    // --- NGHIỆP VỤ CHỨNG TỪ ---
    generateVoucherCode: async (type) => {
        // type có thể là 'HDMH', 'HDBH', 'PT', 'PC'
        const res = await axios.get(`${API_BASE_URL}/api/Document/GenerateCode?type=${type}`);
        return res.data;
    },

    saveVoucher: async (voucherData) => {
        // voucherData bao gồm Header và danh sách chi tiết (Items/Details)
        const res = await axios.post(`${API_BASE_URL}/api/Document`, voucherData);
        return res.data;
    }
};