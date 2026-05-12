import { defineStore } from 'pinia';
import { vouchersApi } from '../service/vouchers.api';

export const useVouchersStore = defineStore('vouchers', {
    state: () => ({
        partners: [],      // Danh sách khách hàng/NCC
        products: [],      // Danh sách hàng hóa
        accounts: [],      // Danh mục tài khoản (1561, 331...)
        isLoading: false   // Trạng thái loading chung
    }),
    
    actions: {
        // 1. Load toàn bộ danh mục ban đầu
        async fetchMetaData() {
            this.isLoading = true;
            try {
                const [partnersRes, productsRes, accountsRes] = await Promise.all([
                    vouchersApi.getPartners(),
                    vouchersApi.getProducts(),
                    vouchersApi.getAccounts()
                ]);
                
                this.partners = partnersRes.data;
                this.products = productsRes.data;
                this.accounts = accountsRes.data;
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            } finally {
                this.isLoading = false;
            }
        },

        // 2. Xử lý OCR (Giữ nguyên của bạn)
        async processOcrInvoice(file, docType) {
            try {
                const result = await vouchersApi.scanOcrDocument(file, docType);
                return result; // Trả dữ liệu về component để fill vào form
            } catch (error) {
                throw new Error('Không thể đọc dữ liệu từ ảnh. Vui lòng thử lại!');
            }
        },

        // 3. Sinh mã chứng từ mới
        async getNewVoucherCode(type) {
            try {
                const result = await vouchersApi.generateVoucherCode(type);
                return result.data; // Trả về chuỗi mã HDMH0001...
            } catch (error) {
                console.error('Lỗi sinh mã:', error);
            }
        },

        // 4. Lưu chứng từ vào DB
        async createVoucher(payload) {
            this.isLoading = true;
            try {
                const result = await vouchersApi.saveVoucher(payload);
                if (result.success) {
                    return result;
                } else {
                    throw new Error(result.message || 'Lưu thất bại');
                }
            } catch (error) {
                console.error('Store Error: Save Voucher', error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        }
    }
});