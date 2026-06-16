import { defineStore } from 'pinia';
import inventoryApi from '../service/inventory.api';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        documents: [],      // Danh sách chứng từ hiển thị ở bảng
        warehouses: [],     // Danh sách kho (cho dropdown)
        partners: [],       // nhà cung cấp 
        customers: [],      // khách hàng
        items: [],          // Danh sách hàng hóa (cho dropdown)
        stockReports: [],   // Dữ liệu báo cáo tồn kho
        isLoading: false,
        pagination: {
            total: 0,
            page: 1,
            pageSize: 10
        }
    }),

    actions: {
        // Lấy danh sách chứng từ ban đầu
        async fetchDocuments(params) {
            this.isLoading = true;
            console.group('🚀 [Inventory Store] fetchDocuments');
            console.log('📡 Params gửi đi:', params);

            try {
                const response = await inventoryApi.getDocuments(params);
                console.log('✅ Dữ liệu API trả về:', response.data);

                const result = response.data;
                this.documents = Array.isArray(result.data) ? result.data : [];
                this.pagination.total = result.totalRecords || 0;
                this.pagination.page = result.page || this.pagination.page;
                this.pagination.pageSize = result.pageSize || this.pagination.pageSize;
                console.log('📦 State documents hiện tại:', this.documents);
            } catch (error) {
                console.error('❌ Lỗi fetchDocuments:', error.response?.data || error.message);
                this.documents = [];
                this.pagination.total = 0;
            } finally {
                this.isLoading = false;
                console.groupEnd();
            }
        },

        async fetchMetadata() {
            console.group('📂 [Inventory Store] Khởi tạo dữ liệu danh mục');
            try {
                const [resWarehouses, resItems, resPartners] = await Promise.all([
                    inventoryApi.getWarehouses(),
                    inventoryApi.getItems(),
                    inventoryApi.getPartners()
                ]);

                this.warehouses = resWarehouses.data || [];
                this.items = resItems.data || [];

                const allPartners = resPartners.data || [];
                this.partners = allPartners.filter(p => p.partnerType === 2);
                this.customers = allPartners.filter(p => p.partnerType === 1);
            } catch (error) {
                console.error('❌ Lỗi khi tải hoặc lọc danh mục (fetchMetadata):', error);
            } finally {
                console.groupEnd();
            }
        },

        async fetchStockByWarehouse(warehouseId) {
            try {
                const response = await inventoryApi.getStockByWarehouse(warehouseId);
                if (response && response.data) {
                    return response.data || [];
                }
                return [];
            } catch (error) {
                console.error(`❌ Lỗi API fetchStockByWarehouse (${warehouseId}):`, error);
                throw error;
            }
        },

        async createNewDocument(docData) {
            this.isLoading = true;
            console.group('📝 [Inventory Store] createNewDocument');
            console.log('📤 Data gửi lên Server:', JSON.stringify(docData, null, 2));

            try {
                const response = await inventoryApi.createDocument(docData);
                console.log('✅ Kết quả tạo chứng từ:', response.data);

                await this.fetchDocuments({
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize
                });
                return response.data;
            } catch (error) {
                console.error('❌ Lỗi tạo chứng từ:', error.response?.data || error.message);
                throw error;
            } finally {
                this.isLoading = false;
                console.groupEnd();
            }
        },

        // 👉 BỔ SUNG: HÀM CẬP NHẬT CHỨNG TỪ (SỬA)
        async updateDocument(id, docData) {
            this.isLoading = true;
            console.group(`📝 [Inventory Store] updateDocument (ID: ${id})`);

            try {
                const response = await inventoryApi.updateDocument(id, docData);
                console.log('✅ Kết quả cập nhật chứng từ:', response.data);

                // Load lại danh sách sau khi sửa thành công để UI đồng bộ
                await this.fetchDocuments({
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize
                });
                return response.data;
            } catch (error) {
                console.error('❌ Lỗi cập nhật chứng từ:', error.response?.data || error.message);
                throw error;
            } finally {
                this.isLoading = false;
                console.groupEnd();
            }
        },

        async getDocumentById(id) {
            console.group(`🔍 [Inventory Store] getDocumentById (ID: ${id})`);
            try {
                const response = await inventoryApi.getDocumentById(id);
                console.log('✅ Dữ liệu chi tiết chứng từ:', response.data);
                // Trả về dữ liệu để form Sửa có thể "hứng" và map vào giao diện
                return response.data;
            } catch (error) {
                console.error(`❌ Lỗi lấy chi tiết chứng từ ${id}:`, error);
                throw error;
            } finally {
                console.groupEnd();
            }
        },

        // XÓA CHỨNG TỪ (Đã có sẵn, tôi dọn dẹp lại cho gọn)
        async deleteDocument(id) {
            this.isLoading = true;
            console.group(`🗑️ [Inventory Store] deleteDocument (ID: ${id})`);
            try {
                const response = await inventoryApi.deleteDocument(id);
                console.log('✅ Phản hồi Xóa:', response.data);

                // Trả về true để Component biết là xóa thành công
                return true;
            } catch (error) {
                console.error('❌ Lỗi xóa chứng từ:', error.response?.data || error.message);
                // Quăng lỗi lên để Dashboard bắt được và hiển thị Toast/Alert
                throw error.response?.data?.message || 'Có lỗi xảy ra khi xóa chứng từ!';
            } finally {
                this.isLoading = false;
                console.groupEnd();
            }
        },

        async postDocument(id) {
            console.group(`📌 [Inventory Store] postDocument (ID: ${id})`);
            try {
                const response = await inventoryApi.postDocument(id);
                console.log('✅ Phản hồi ghi sổ:', response.data);

                const doc = this.documents.find(d => d.id === id);
                if (doc) {
                    doc.isPosted = true;
                    console.log('🔄 Đã cập nhật UI cho chứng từ:', id);
                }
            } catch (error) {
                console.error('❌ Lỗi ghi sổ:', error);
                alert("Không thể ghi sổ chứng từ này!");
            } finally {
                console.groupEnd();
            }
        },

        async runCalculatePrice(period, method) {
            console.group('⚖️ [Inventory Store] runCalculatePrice');
            try {
                const res = await inventoryApi.calculatePrice({ period, method });
                console.log('✅ Kết quả tính giá vốn:', res.data);
                return res.data;
            } catch (error) {
                console.error('❌ Lỗi tính giá vốn:', error);
                throw error;
            } finally {
                console.groupEnd();
            }
        },

        async exportExcel(params) {
            try {
                const response = await inventoryApi.exportExcel(params);
                return response;
            } catch (error) {
                console.error("❌ [LỖI] KHI GỌI API XUẤT EXCEL:", error);
                if (error.response) {
                    console.error("Chi tiết lỗi từ Backend:", error.response.data);
                }
                throw error;
            }
        }
    }
});