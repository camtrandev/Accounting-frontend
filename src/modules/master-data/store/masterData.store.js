import { defineStore } from 'pinia';
// Import 5 file service riêng biệt mà chúng ta đã tách ở bước trước
import {
  accountService,
  customerService,
  supplierService,
  productService,
  warehouseService
} from '../service/masterData.api';

export const useMasterDataStore = defineStore('masterData', {
  state: () => ({
    items: [],
    loading: false,
    pagination: { page: 1, pageSize: 20, total: 0 },
    filters: { search: '', status: null }
  }),

  // Search

  getters: {
    // Hàm lọc dùng chung cho cả 5 loại danh mục
    filteredItems: (state) => {
      const query = state.filters.search.toLowerCase().trim();

      // Nếu không có từ khóa, trả về danh sách gốc
      if (!query) return state.items;

      return state.items.filter(item => {
        // Lấy tất cả giá trị của các trường trong object (Mã, Tên, Số điện thoại, Địa chỉ...)
        // Chuyển tất cả thành chuỗi để tìm kiếm không phân biệt trường nào
        return Object.values(item).some(value =>
          String(value).toLowerCase().includes(query)
        );
      });
    },

    // Cập nhật lại tổng số dòng sau khi lọc để hiển thị ở Pagination
    filteredTotal: (getters) => {
      return getters.filteredItems.length;
    }
  },

  actions: {
    // Hàm phụ trợ: Tự động điều hướng đến đúng Service dựa theo Type
    // Việc tách ra thế này giúp code sạch sẽ, không bị if/else lồng nhau
    _getService(type) {
      switch (type) {
        case 'ACCOUNT': return accountService;
        case 'CUSTOMER': return customerService;
        case 'SUPPLIER': return supplierService;
        case 'PRODUCT': return productService;
        case 'WAREHOUSE': return warehouseService;
        default: throw new Error(`[Store] Chưa cấu hình Service cho type: ${type}`);
      }
    },

    // ==========================================
    // 1. LẤY DANH SÁCH (READ)
    // ==========================================
    async fetchItems(type) {
      this.loading = true;
      try {
        const service = this._getService(type);
        const response = await service.getAll();

        // Xử lý dữ liệu trả về (hỗ trợ cả trường hợp API bọc trong .data hoặc trả trực tiếp mảng)
        if (response.data) {
          // Tùy theo cấu trúc JSON backend trả về, thường là response.data.data hoặc response.data
          const responseData = response.data.data || response.data;

          this.items = Array.isArray(responseData) ? responseData : [];
          this.pagination.total = this.items.length;
        }
      } catch (error) {
        console.error(`[Store] Lỗi khi lấy danh sách ${type}:`, error);
        this.items = [];
        this.pagination.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // ==========================================
    // 2. THÊM MỚI (CREATE)
    // ==========================================
    async createItem(type, payload) {
      try {
        const service = this._getService(type);
        await service.create(payload);
        return true; // Trả về true để component biết là thêm thành công đóng Drawer
      } catch (error) {
        console.error(`[Store] Lỗi khi thêm mới ${type}:`, error);
        return false;
      }
    },

    // ==========================================
    // 3. CẬP NHẬT (UPDATE)
    // ==========================================
    async updateItem(type, id, payload) {
      try {
        const service = this._getService(type);
        await service.update(id, payload);
        return true;
      } catch (error) {
        console.error(`[Store] Lỗi khi cập nhật ${type}:`, error);
        return false;
      }
    },

    // ==========================================
    // 4. XÓA (DELETE)
    // ==========================================
    async deleteItem(type, id) {
      try {
        const service = this._getService(type);
        await service.delete(id);
        return true;
      } catch (error) {
        console.error(`[Store] Lỗi khi xóa ${type}:`, error);
        return false;
      }
    },

    // ==========================================
    // 5. CÁC HÀM TIỆN ÍCH
    // ==========================================
    resetFilters() {
      this.filters.search = '';
      this.pagination.page = 1;
    }
  }
});