import { defineStore } from 'pinia';
import { MasterDataService } from '../service/masterData.api';

export const useMasterDataStore = defineStore('masterData', {
  state: () => ({
    items: [],
    loading: false,
    pagination: { total: 0, page: 1, pageSize: 20 },
    filters: { search: '', status: null }
  }),
  actions: {
    async fetchItems() {
      this.loading = true;
      try {
        const res = await MasterDataService.getAll({ ...this.pagination, ...this.filters });
        this.items = res.data.items;
        this.pagination.total = res.data.total;
      } finally {
        this.loading = false;
      }
    }
  }
});