import { defineStore } from 'pinia';
import { ledgerApi } from '../service/ledger.api'; 

export const useLedgerStore = defineStore('ledger', {
    state: () => ({
        // Lưu trữ 4 con số KPI cho thẻ màu
        summary: {
            openingBalance: 0,
            totalDebit: 0,
            totalCredit: 0,
            closingBalance: 0
        },
        // Lưu trữ danh sách chứng từ cho bảng
        transactions: [],
        
        // Trạng thái hệ thống
        isLoading: false,
        error: null
    }),

    actions: {
        /**
         * Lấy dữ liệu sổ cái và cập nhật vào State
         */
        async getLedgerData(filterParams) {
            this.isLoading = true;
            this.error = null;
            
            try {
                const response = await ledgerApi.fetchGeneralLedger(filterParams);
                const data = response.data;

                console.log('🚀 [DEBUG] DỮ LIỆU TỪ API TRẢ VỀ:', data);
                console.log('Danh sách chứng từ:', data.transactions);

                // Gán dữ liệu từ API vào State
                this.summary = {
                    openingBalance: data.openingBalance,
                    totalDebit: data.totalDebit,
                    totalCredit: data.totalCredit,
                    closingBalance: data.closingBalance
                };
                this.transactions = data.transactions;

            } catch (err) {
                console.error('Lỗi khi tải dữ liệu sổ cái:', err);
                this.error = err.response?.data || 'Không thể kết nối đến máy chủ';
            } finally {
                this.isLoading = false;
            }
        },

        async fetchAllAccounts() {
            try {
                const response = await ledgerApi.getAccounts();
                
                // Do API trả về cấu trúc { success: true, data: [...] } 
                // nên axios bọc thêm 1 lớp .data nữa -> response.data.data
                if (response.data.success) {
                    this.accountList = response.data.data;
                }
            } catch (err) {
                console.error('Lỗi khi tải danh sách tài khoản:', err);
            }
        },

        /**
         * Gọi API và ép trình duyệt tải file Excel về máy
         */
        async downloadLedgerExcel(filterParams) {
            this.isLoading = true;
            
            try {
                const response = await ledgerApi.exportExcel(filterParams);
                
                // --- Logic xử lý tải file Blob của trình duyệt ---
                // 1. Tạo một URL đại diện cho file nhị phân vừa tải về
                const blob = new Blob([response.data], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                const url = window.URL.createObjectURL(blob);
                
                // 2. Tạo một thẻ <a> ẩn, gán link và tự động click để máy tải về
                const link = document.createElement('a');
                link.href = url;
                
                // Tạo tên file tự động theo ngày tháng hiện tại
                const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
                link.setAttribute('download', `SoCai_TongHop_${dateStr}.xlsx`);
                
                document.body.appendChild(link);
                link.click();
                
                // 3. Dọn dẹp DOM
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);

            } catch (err) {
                console.error('Lỗi khi xuất file Excel:', err);
                alert('Có lỗi xảy ra khi xuất file!');
            } finally {
                this.isLoading = false;
            }
        }
    }
});