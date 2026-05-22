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

                // API mới trả về object { totalRecords, page, pageSize, data }
                const result = response.data;

                // Bóc tách đúng trường data và totalRecords để cập nhật state
                this.documents = Array.isArray(result.data) ? result.data : [];
                this.pagination.total = result.totalRecords || 0;

                // Đồng bộ luôn page và pageSize từ server về nếu cần
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

        // Lấy dữ liệu danh mục bổ trợ (Kho & Hàng hóa)
        async fetchMetadata() {
            console.group('📂 [Inventory Store] Khởi tạo dữ liệu danh mục');
            try {
                // Gọi 3 API cùng lúc để tối ưu thời gian tải
                const [resWarehouses, resItems, resPartners] = await Promise.all([
                    inventoryApi.getWarehouses(),
                    inventoryApi.getItems(),
                    inventoryApi.getPartners()
                ]);

                // Gán dữ liệu Kho hàng và Hàng hóa
                this.warehouses = resWarehouses.data || [];
                this.items = resItems.data || [];

                // 2. LỌC CHỈ LẤY CÁC NHÀ CUNG CẤP (partnerType === 2)
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

                // Tùy theo cấu hình Axios interceptor của bạn, thường dữ liệu nằm ở response.data hoặc response.data.data
                // Swagger của bạn trả về: { success: true, data: [...] }
                if (response && response.data) {
                    // Trả về mảng danh sách items
                    return response.data || [];
                }
                return [];
            } catch (error) {
                console.error(`❌ Lỗi API fetchStockByWarehouse (${warehouseId}):`, error);
                throw error; // Ném lỗi ra để giao diện (Vue) bắt và hiển thị Toast
            }
        },

        // Tạo mới phiếu nhập/xuất/chuyển
        async createNewDocument(docData) {
            this.isLoading = true;
            console.group('📝 [Inventory Store] createNewDocument');
            console.log('📤 Data gửi lên Server:', JSON.stringify(docData, null, 2));

            try {
                const response = await inventoryApi.createDocument(docData);
                console.log('✅ Kết quả tạo chứng từ:', response.data);

                // Tự động load lại danh sách sau khi tạo thành công
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

        // Ghi sổ chứng từ
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

        // Tính giá xuất kho
        async runCalculatePrice(period, method) {
            console.group('⚖️ [Inventory Store] runCalculatePrice');
            console.log('📊 Kỳ tính giá:', period);
            console.log('⚙️ Phương pháp:', method);

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
        async deleteDocument(id) {
            this.isLoading = true;
            try {
                await inventoryApi.deleteDocument(id);
            } catch (error) {
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async exportExcel(params) {
            try {
                // Gọi hàm từ tầng API (file cấu hình axios)
                const response = await inventoryApi.exportExcel(params);
                // Trả về toàn bộ response để component bóc tách Blob data
                return response;
            } catch (error) {
                // 3. LOG NẾU CÓ LỖI (Ví dụ: sai URL, mất mạng, lỗi CORS)
                console.error("❌ [LỖI] KHI GỌI API XUẤT EXCEL:", error);

                if (error.response) {
                    console.error("Chi tiết lỗi từ Backend:", error.response.data);
                }

                throw error;
            }
        }
    }
});