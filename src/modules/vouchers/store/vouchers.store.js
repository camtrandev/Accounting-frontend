import { defineStore } from 'pinia';
import { vouchersApi } from '../service/vouchers.api';

export const useVouchersStore = defineStore('vouchers', {
    state: () => ({
        partners: [],
        products: [],
        accounts: [],
        warehouses: [],
        isLoading: false,
        pendingVouchers: [],
        currentUser: { roleId: 1 }// Giả định RoleId: 1-Admin, 2-Accountant, 3-Viewer
    }),

    actions: {
        // 1. Log dữ liệu danh mục ban đầu
        async fetchMetaData() {
            this.isLoading = true;
            try {
                const [partnersRes, productsRes, accountsRes, warehouseRes] = await Promise.all([
                    vouchersApi.getPartners(),
                    vouchersApi.getProducts(),
                    vouchersApi.getAccounts(),
                    vouchersApi.getWarehouses()
                ]);

                this.partners = partnersRes;
                this.products = productsRes;
                this.accounts = accountsRes.data;
                this.warehouses = warehouseRes.data || warehouseRes;
                console.log('%c [Store] Danh sách kho đã tải:', 'color: green', this.warehouses);
            } catch (error) {
                console.error('%c ❌ LỖI KHI GỌI API DANH MỤC:', 'color: red; font-weight: bold', error);
            } finally {
                this.isLoading = false;
            }
        },
        // 2. Log dữ liệu sau khi AI quét (OCR)
        async processOcrInvoice(file, docType) {
            try {
                console.log('%c [OCR] Bắt đầu quét file...', 'color: #9C27B0; font-weight: bold', file.name);
                const result = await vouchersApi.scanOcrDocument(file, docType);

                // --- LOG KẾT QUẢ AI TRẢ VỀ ---
                console.log('%c [OCR] Kết quả từ Gemini AI:', 'color: #00BCD4; font-weight: bold', result);

                return result;
            } catch (error) {
                console.error('Lỗi OCR:', error);
                throw error;
            }
        },

        // 3. Log mã chứng từ mới
        async getNewVoucherCode(type) {
            try {
                const result = await vouchersApi.generateVoucherCode(type);
                console.log(`%c [API] Mã chứng từ mới (${type}):`, 'color: #795548; font-weight: bold', result);
                return result.data || result;
            } catch (error) {
                console.error('Lỗi sinh mã:', error);
            }
        },

        // 4. Log dữ liệu trước khi gửi đi lưu (Payload)
        async createVoucher(payload) {
            try {
                console.log('%c 📤 PAYLOAD GỬI ĐI LƯU:', 'color: #E91E63; font-weight: bold', payload);

                const result = await vouchersApi.saveVoucher(payload);

                console.log('%c ✅ KẾT QUẢ SAU KHI LƯU:', 'color: #4CAF50; font-weight: bold', result);
                return result;
            } catch (error) {
                console.error('%c ❌ LỖI KHI LƯU CHỨNG TỪ:', 'color: red', error);
                throw error;
            }
        },

        async fetchPendingVouchers() {
            try {
                const data = await vouchersApi.getPendingVouchers();
                this.pendingVouchers = data;
            } catch (error) {
                console.error("Lỗi lấy danh sách chờ duyệt", error);
            }
        },

        async fetchAllVouchers() {
            try {
                const data = await vouchersApi.getAllDocuments();
                this.vouchers = data; // Gán dữ liệu API trả về vào state
            } catch (error) {
                console.error("Lỗi lấy tất cả chứng từ:", error);
            }
        },

        async approveVoucher(id) {
            const result = await vouchersApi.postVoucher(id); // Tận dụng hàm postVoucher có sẵn
            if (result.success) {
                this.pendingVouchers = this.pendingVouchers.filter(v => v.id !== id);
            }
            return result;
        },

        async rejectVoucher(id) {
            const result = await vouchersApi.rejectVoucher(id);
            if (result.success) {
                this.pendingVouchers = this.pendingVouchers.filter(v => v.id !== id);
            }
            return result;
        },
        // Hành động lưu sổ cái
        async postLedgerEntries(entriesPayload) {
            try {
                const result = await vouchersApi.postLedgerEntries(entriesPayload);
                return result;
            } catch (error) {
                console.error("Lỗi khi lưu sổ cái:", error);
                throw error;
            }
        }
    }
});