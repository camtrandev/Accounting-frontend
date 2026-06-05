import { defineStore } from 'pinia';
import { reportApi } from '../service/report.api';

export const useReportStore = defineStore('reportStore', {
    state: () => ({
        isLoading: false,
        isExporting: false, // Trạng thái riêng khi đang tải file Excel
        error: null,

        // 0. Master Data
        warehouses: [],
        items: [],
        partners: [],
        accounts: [],

        // 1. Tài chính
        incomeStatementData: null,
        balanceSheetData: null,

        // 2. Kho & Vật tư
        stockReportData: null,       // Cũ
        itemInfoData: null,          // Cũ
        inventoryDetailData: null,   // Mới
        slowMovingData: [],          // Mới

        // 3. Bán hàng & Công nợ
        partnerDebtDetail: null,     // Cũ
        revenueByItemData: [],       // Mới
        debtSummaryData: [],         // Mới

        // 4. Sổ cái & Tiền mặt
        generalLedgerData: null,     // Cũ
        cashBookData: null,
        accounts: []
    }),

    actions: {
        resetState() {
            this.isLoading = false;
            this.error = null;
        },

        // ==========================================
        // 0. FETCH MASTER DATA (Dùng cho Dropdown Bộ lọc)
        // ==========================================
        async fetchMasterData() {
            try {
                // Gọi song song 3 API để tối ưu tốc độ load màn hình
                const [whRes, itemRes, partnerRes] = await Promise.all([
                    reportApi.getWarehouses(),
                    reportApi.getItems(),
                    reportApi.getPartners()
                ]);
                this.warehouses = whRes.data;
                this.items = itemRes.data;
                this.partners = partnerRes.data;
            } catch (err) {
                console.error('Lỗi lấy dữ liệu nền:', err);
            }
        },

        // ==========================================
        // 1. ACTIONS TÀI CHÍNH
        // ==========================================
        async fetchIncomeStatement(params) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getIncomeStatement(params);
                this.incomeStatementData = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },
        async fetchBalanceSheet(params) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getBalanceSheet(params);
                this.balanceSheetData = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },

        // ==========================================
        // 2. ACTIONS KHO VẬT TƯ
        // ==========================================
        async fetchStockReport(params) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getStockReport(params);
                this.stockReportData = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },
        async fetchInventoryDetail(params) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getInventoryDetail(params);
                this.inventoryDetailData = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },
        async fetchSlowMovingItems(params) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getSlowMovingItems(params);
                this.slowMovingData = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },

        // ==========================================
        // 3. ACTIONS BÁN HÀNG & CÔNG NỢ
        // ==========================================
        async fetchPartnerDebtDetail(partnerId) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getDebtByPartner(partnerId);
                this.partnerDebtDetail = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },
        async fetchRevenueByItem(params) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getRevenueByItem(params);
                this.revenueByItemData = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },
        async fetchDebtSummary(params) {
            this.resetState(); this.isLoading = true;
            try {
                const res = await reportApi.getDebtSummary(params);
                this.debtSummaryData = res.data;
            } catch (err) { this.error = err.message; }
            finally { this.isLoading = false; }
        },

        // ==========================================
        // 4. ACTIONS SỔ CÁI & TIỀN MẶT
        // ==========================================
        async fetchGeneralLedger(params) {
            this.isLoading = true;
            this.error = null;
            try {
                const res = await reportApi.getGeneralLedger(params);
                this.generalLedgerData = res.data;
            } catch (err) {
                this.error = err.message || "Lỗi khi tải Sổ nhật ký chung";
            } finally {
                this.isLoading = false;
            }
        },

        async fetchCashBook(params) {
            this.isLoading = true;
            this.error = null;
            try {
                const res = await reportApi.getCashBook(params);
                this.cashBookData = res.data;
            } catch (err) {
                this.error = err.message || "Lỗi khi tải Sổ quỹ tiền mặt";
            } finally {
                this.isLoading = false;
            }
        },
        async fetchAccounts() {
            // Nếu đã có data rồi thì bỏ qua
            if (this.accounts && this.accounts.length > 0) return;
            
            try {
                const res = await reportApi.getAccounts(); 
                
                // KIỂM TRA LINH HOẠT: 
                // Nếu Backend bọc data trong res.data.data (hoặc items, results...) thì lấy nó ra
                let responseData = res.data.data || res.data.items || res.data;
                
                // Ép kiểu kiểm tra xem nó có đúng là mảng không
                if (Array.isArray(responseData)) {
                    this.accounts = responseData;
                    console.log("✅ ĐÃ LẤY THÀNH CÔNG TÀI KHOẢN:", this.accounts);
                } else {
                    console.error("❌ Dữ liệu API /accounts không phải là Mảng (Array)!", responseData);
                    this.accounts = []; // Tránh lỗi v-for
                }
            } catch (error) {
                console.error("❌ Lỗi gọi API /accounts:", error);
            }
        },
        // ==========================================
        // 5. HELPER: XUẤT FILE EXCEL (Dùng chung)
        // ==========================================
        async exportExcel(apiFunction, params, fileName) {
            this.isExporting = true;
            try {
                const response = await apiFunction(params);
                // Tạo blob từ stream trả về
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (err) {
                console.error("Lỗi xuất file:", err);
                alert("Có lỗi xảy ra khi xuất báo cáo!");
            } finally {
                this.isExporting = false;
            }
        }
    }
});