import { defineStore } from 'pinia';
import { dashboardApi } from '../service/dashboardApi'; 

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        // Dữ liệu State
        kpis: {
            totalRevenue: { value: 0, percentageChange: 0 },
            totalExpense: { value: 0, percentageChange: 0 },
            profit: { value: 0, percentageChange: 0 },
            totalAssets: { value: 0, percentageChange: 0 },
            cash: { value: 0, percentageChange: 0 }
        },
        revenueExpenseChart: [],
        topCustomers: [],
        topSuppliers: [],
        cashFlowChart: [],
        revenueStructure: [],
        
        // Trạng thái hệ thống
        isLoading: false,
        error: null
    }),

    actions: {
        // Hàm gọi tổng hợp tất cả data cùng lúc khi load trang
        async fetchAllDashboardData(month, year) {
            this.isLoading = true;
            this.error = null;
            try {
                // Sử dụng Promise.all để gọi song song các API, giúp giảm tối đa thời gian chờ
                const [
                    kpisRes, 
                    revExpRes, 
                    customersRes, 
                    suppliersRes, 
                    cashFlowRes, 
                    structureRes
                ] = await Promise.all([
                    dashboardApi.getKpis(month, year),
                    dashboardApi.getRevenueExpenseChart(year),
                    dashboardApi.getTopPartners(year, true),  // true = Khách hàng
                    dashboardApi.getTopPartners(year, false), // false = Nhà cung cấp
                    dashboardApi.getCashFlowChart(year),
                    dashboardApi.getRevenueStructure(year)
                ]);

                this.kpis = kpisRes.data;
                this.revenueExpenseChart = revExpRes.data;
                this.topCustomers = customersRes.data;
                this.topSuppliers = suppliersRes.data;
                this.cashFlowChart = cashFlowRes.data;
                this.revenueStructure = structureRes.data;

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu Dashboard:", err);
                this.error = "Không thể tải dữ liệu Dashboard. Vui lòng thử lại.";
            } finally {
                this.isLoading = false;
            }
        },

        // Hàm xử lý xuất file Excel và tự động tải xuống trình duyệt
        async downloadDashboardReport(month, year) {
            try {
                this.isLoading = true;
                const response = await dashboardApi.exportExcel(month, year);
                
                // Tạo link ẩn để tải file blob
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                
                // Lấy tên file từ Backend trả về hoặc đặt tên mặc định
                let fileName = `Dashboard_Report_${month || new Date().getMonth() + 1}_${year || new Date().getFullYear()}.xlsx`;
                
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Lỗi khi tải file Excel:", err);
                this.error = "Không thể xuất file báo cáo.";
            } finally {
                this.isLoading = false;
            }
        }
    }
});