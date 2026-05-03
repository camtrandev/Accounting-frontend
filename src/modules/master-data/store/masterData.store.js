import { defineStore } from 'pinia';
import { accountService } from '../service/masterData.api';

export const useMasterDataStore = defineStore('masterData', {
  state: () => ({
    items: [],
    loading: false,
    pagination: { page: 1, pageSize: 20, total: 0 },
    filters: { search: '', status: null }
  }),

  actions: {
    async fetchItems(type) {
      this.loading = true;
      try {
        let response;

        if (type === 'ACCOUNT') {
          // Gọi trực tiếp không truyền search
          response = await accountService.getAll();
        } else {
          const pType = type === 'CUSTOMER' ? 1 : 2;
          response = await accountService.getPartners(pType);
        }

        if (response.data && response.data.success) {
          this.items = response.data.data; 
          this.pagination.total = response.data.data.length;
        }
      } catch (error) {
        console.error("Fetch error chi tiết:", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(type, id) {
      try {
        type === 'ACCOUNT' ? await accountService.delete(id) : await accountService.deletePartner(id);
        return true;
      } catch (error) { return false; }
    },

    resetFilters() {
      this.filters.search = '';
      this.pagination.page = 1;
    }
  }
});