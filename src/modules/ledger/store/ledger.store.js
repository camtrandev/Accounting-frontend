// store/ledger.store.js
import { defineStore } from 'pinia'; // Khuyên dùng Pinia cho Vue 3
import ledgerService from '../service/ledger.service';

export const useLedgerStore = defineStore('ledger', {
  state: () => ({
    entries: [],
    summary: { totalDebit: 0, totalCredit: 0, balance: 0 },
    loading: false,
    filters: {
      startDate: new Date().toISOString().substr(0, 7) + "-01", // Đầu tháng
      endDate: new Date().toISOString().substr(0, 10),         // Hôm nay
      accountCode: ''
    }
  }),

  actions: {
    async loadLedger() {
      this.loading = true;
      try {
        const response = await ledgerService.getAll(this.filters);
        this.entries = response.data;
        this.summary = response.summary;
      } catch (error) {
        console.error("Lỗi Store:", error);
      } finally {
        this.loading = false;
      }
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
      this.loadLedger(); // Tự động load lại khi filter thay đổi
    }
  },
  
  getters: {
    // Getter giúp lọc nhanh dữ liệu tại Client nếu cần
    highValueEntries: (state) => state.entries.filter(e => (e.debit + e.credit) > 100000000)
  }
});