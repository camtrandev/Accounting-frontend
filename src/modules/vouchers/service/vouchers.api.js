import axios from 'axios';


const API_BASE_URL = 'https://localhost:7047';

export const vouchersApi = {
    // 1. OCR - Nhận diện hóa đơn
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

    // 2. LẤY DANH MỤC (Dựa trên Swagger của bạn)

    // Lấy danh sách đối tác (Khách hàng/NCC)
    getPartners: async () => {
        const res = await axios.get(`${API_BASE_URL}/api/Partner`);
        return res.data;
    },

    // Lấy danh sách hàng hóa (Items)
    getProducts: async () => {
        // Trong hình của bạn là /api/Items
        const res = await axios.get(`${API_BASE_URL}/api/Items`);
        return res.data;
    },

    // Lấy danh sách tài khoản kế toán (Accounts)
    getAccounts: async () => {
        // Trong hình của bạn là /api/accounts (có s)
        const res = await axios.get(`${API_BASE_URL}/api/accounts`);
        return res.data;
    },

    // Lấy danh sách kho (Warehouse)
    getWarehouses: async () => {
        const res = await axios.get(`${API_BASE_URL}/api/Warehouse`);
        return res.data;
    },

    // 3. NGHIỆP VỤ CHỨNG TỪ (DOCUMENTS)

    // Lưu hóa đơn mới (Lưu nháp)
    saveVoucher: async (voucherData) => {
        // Trong hình của bạn là POST /api/documents (có s)
        const res = await axios.post(`${API_BASE_URL}/api/documents`, voucherData);
        return res.data;
    },

    // Ghi sổ chứng từ (Post) - Chuyển từ bản nháp sang chính thức
    postVoucher: async (id) => {
        const token = localStorage.getItem('token'); // Lấy token từ Local Storage
        const res = await axios.post(`${API_BASE_URL}/api/documents/${id}/post`, {}, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi kèm Token xuống Backend
            }
        });
        return res.data;
    },

    // 4. CÔNG NỢ & SỔ CÁI

    // Lấy thông tin nợ theo đối tác
    getDebtByPartner: async (partnerId) => {
        const res = await axios.get(`${API_BASE_URL}/api/debt/${partnerId}`);
        return res.data;
    },

    // Lấy dữ liệu sổ cái theo tài khoản
    getLedgerByAccount: async (accountId) => {
        const res = await axios.get(`${API_BASE_URL}/api/ledger/${accountId}`);
        return res.data;
    },

    // 5. CHAT AI (Hỏi đáp dữ liệu)
    askAi: async (question) => {
        const res = await axios.post(`${API_BASE_URL}/api/Chat/ask`, { content: question });
        return res.data;
    },

    // Lấy danh sách chờ duyệt cho Admin
    getPendingVouchers: async () => {
        const res = await axios.get(`${API_BASE_URL}/api/documents/pending`);
        return res.data;
    },

    getAllDocuments: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/documents`);
        return response.data;
    },

    // Từ chối chứng từ
    rejectVoucher: async (id) => {
        const res = await axios.post(`${API_BASE_URL}/api/documents/${id}/reject`);
        return res.data;
    },

    // Lưu dữ liệu định khoản vào Sổ cái
    postLedgerEntries: async (entriesPayload) => {
        const rawToken = localStorage.getItem('token') || '';
        const token = rawToken.replace(/['"]+/g, '');

        const res = await axios.post(`${API_BASE_URL}/api/ledger/post-entries`, entriesPayload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.data;
    },
};