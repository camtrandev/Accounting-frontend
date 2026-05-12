import axios from 'axios';

const API_BASE_URL = 'https://localhost:7047/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor gắn Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ==========================================
// 1. HỆ THỐNG TÀI KHOẢN (ACCOUNT)
// ==========================================
export const accountService = {
    getAll: () => api.get('/accounts'),
    getById: (id) => api.get(`/accounts/${id}`),
    create: (data) => api.post('/accounts', data),
    update: (id, data) => api.put(`/accounts/${id}`, data),
    delete: (id) => api.delete(`/accounts/${id}`)
};

// ==========================================
// 2. KHÁCH HÀNG (CUSTOMER) - Dùng chung API Partner, fix cứng Type = 1
// ==========================================
export const customerService = {
    // Lấy danh sách đối tác là Khách hàng (Type = 1)
    getAll: () => api.get('/Partner/type/1'),
    getById: (id) => api.get(`/Partner/${id}`),
    // Khi thêm/sửa tự động nhồi thêm PartnerType: 1 để DB hiểu đây là Khách hàng
    create: (data) => api.post('/Partner', { ...data, PartnerType: 1 }),
    update: (id, data) => api.put(`/Partner/${id}`, { ...data, PartnerType: 1 }),
    delete: (id) => api.delete(`/Partner/${id}`)
};


// ==========================================
// 3. NHÀ CUNG CẤP (SUPPLIER) - Dùng chung API Partner, fix cứng Type = 2
// ==========================================
export const supplierService = {
    // Lấy danh sách đối tác là Nhà cung cấp (Type = 2)
    getAll: () => api.get('/Partner/type/2'),
    getById: (id) => api.get(`/Partner/${id}`),
    // Khi thêm/sửa tự động nhồi thêm PartnerType: 2 để DB hiểu đây là NCC
    create: (data) => api.post('/Partner', { ...data, PartnerType: 2 }),
    update: (id, data) => api.put(`/Partner/${id}`, { ...data, PartnerType: 2 }),
    delete: (id) => api.delete(`/Partner/${id}`)
};

// ==========================================
// 4. VẬT TƯ HÀNG HOÁ (PRODUCT / ITEM)
// *Lưu ý: Bạn nhớ sửa lại tên route '/Products' cho khớp với Swagger của bạn
// ==========================================
export const productService = {
    getAll: (params) => api.get('/Items', { params }),
    getById: (id) => api.get(`/Items/${id}`),
    create: (data) => api.post('/Items', data),
    update: (id, data) => api.put(`/Items/${id}`, data),
    delete: (id) => api.delete(`/Items/${id}`)
};

// ==========================================
// 5. KHO (WAREHOUSE)
// *Lưu ý: Bạn nhớ sửa lại tên route '/Warehouses' cho khớp với Swagger
// ==========================================
export const warehouseService = {
    getAll: (params) => api.get('/Warehouse', { params }),
    getById: (id) => api.get(`/Warehouse/${id}`),
    create: (data) => api.post('/Warehouse', data),
    update: (id, data) => api.put(`/Warehouse/${id}`, data),
    delete: (id) => api.delete(`/Warehouse/${id}`)
};
// Xuất default api để có thể dùng axios instance ở bất kỳ đâu nếu cần gọi custom
export default api;