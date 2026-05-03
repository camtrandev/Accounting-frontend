import axios from 'axios';

const API_BASE_URL = 'https://localhost:7047/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const accountService = {
    // Đã bỏ tham số search để lấy nguyên danh sách
    getAll: () => api.get('/accounts'),
    
    delete: (id) => api.delete(`/accounts/${id}`),

    // Đã bỏ tham số search cho Partners
    getPartners: (type) => api.get(`/partners/type/${type}`),
    
    deletePartner: (id) => api.delete(`/partners/${id}`)
};

export const MasterDataService = accountService; 
export default api;