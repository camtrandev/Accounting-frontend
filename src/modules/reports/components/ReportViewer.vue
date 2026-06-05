<template>
    <div class="viewer-container">

        <table v-if="reportId === 'income-statement'" class="report-table">
            <thead>
                <tr>
                    <th class="text-left w-50">Chỉ tiêu</th>
                    <th class="text-center w-20">Tài khoản</th>
                    <th class="text-right w-30">Số tiền (VNĐ)</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row-category row-blue">
                    <td colspan="3">I. DOANH THU BÁN HÀNG VÀ CUNG CẤP DỊCH VỤ</td>
                </tr>
                <tr v-for="rev in data.revenues" :key="rev.accountId" class="row-data">
                    <td class="pl-30">{{ rev.accountName }}</td>
                    <td class="text-center account-code">{{ rev.accountId }}</td>
                    <td class="text-right amount">{{ formatCurrency(rev.amount) }}</td>
                </tr>
                <tr class="row-summary row-blue">
                    <td class="uppercase pl-30">Cộng Doanh Thu</td>
                    <td></td>
                    <td class="text-right amount-total">{{ formatCurrency(data.totalRevenue) }}</td>
                </tr>

                <tr class="row-category row-red">
                    <td colspan="3">II. CHI PHÍ SẢN XUẤT KINH DOANH</td>
                </tr>
                <tr v-for="exp in data.expenses" :key="exp.accountId" class="row-data">
                    <td class="pl-30">{{ exp.accountName }}</td>
                    <td class="text-center account-code">{{ exp.accountId }}</td>
                    <td class="text-right amount text-red">{{ formatCurrency(exp.amount) }}</td>
                </tr>
                <tr class="row-summary row-red">
                    <td class="uppercase pl-30">Cộng Chi Phí</td>
                    <td></td>
                    <td class="text-right amount-total">{{ formatCurrency(data.totalExpense) }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="row-final">
                    <td class="uppercase">III. LỢI NHUẬN THUẦN (I - II)</td>
                    <td></td>
                    <td class="text-right amount-final" :class="data.netProfit >= 0 ? 'text-green' : 'text-red'">
                        {{ formatCurrency(data.netProfit) }}
                    </td>
                </tr>
            </tfoot>
        </table>

        <table v-if="reportId === 'balance-sheet'" class="report-table">
            <thead>
                <tr>
                    <th class="text-left w-50">Chỉ tiêu</th>
                    <th class="text-center w-20">Tài khoản</th>
                    <th class="text-right w-30">Số dư cuối kỳ (VNĐ)</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row-category row-blue">
                    <td colspan="3">A. TÀI SẢN</td>
                </tr>
                <tr v-for="asset in data.assets" :key="asset.accountId" class="row-data">
                    <td class="pl-30">{{ asset.accountName }}</td>
                    <td class="text-center account-code">{{ asset.accountId }}</td>
                    <td class="text-right amount">{{ formatCurrency(asset.endingBalance) }}</td>
                </tr>

                <tr class="row-category row-purple">
                    <td colspan="3">B. NGUỒN VỐN</td>
                </tr>
                <tr v-for="lia in data.liabilitiesAndEquity" :key="lia.accountId" class="row-data">
                    <td class="pl-30">{{ lia.accountName }}</td>
                    <td class="text-center account-code">{{ lia.accountId }}</td>
                    <td class="text-right amount">{{ formatCurrency(lia.endingBalance) }}</td>
                </tr>
            </tbody>
            <tfoot class="tfoot-totals">
                <tr>
                    <td class="uppercase">Tổng cộng Tài sản</td>
                    <td></td>
                    <td class="text-right amount-total text-blue">{{ formatCurrency(data.totalAssets) }}</td>
                </tr>
                <tr>
                    <td class="uppercase">Tổng cộng Nguồn vốn</td>
                    <td></td>
                    <td class="text-right amount-total text-purple">{{ formatCurrency(data.totalLiabilitiesAndEquity) }}
                    </td>
                </tr>
            </tfoot>
        </table>

    </div>
</template>

<script setup>
const props = defineProps({
    reportId: { type: String, required: true },
    data: { type: Object, required: true }
})

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0'
    return new Intl.NumberFormat('vi-VN').format(value)
}
</script>

<style scoped>
/* 1. CONTAINER CHỨA BẢNG - TẠO THANH CUỘN */
.viewer-container {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

    /* ĐÃ SỬA: Trừ đi 380px (thay vì 280px) để ép bảng ngắn lại rõ rệt, đẩy dòng Tổng lên cao */
    max-height: calc(100vh - 380px);
    overflow-y: auto;

    /* Tùy chỉnh thanh cuộn cho đẹp mắt */
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f8fafc;
}

.viewer-container::-webkit-scrollbar {
    width: 8px;
}

.viewer-container::-webkit-scrollbar-track {
    background: #f8fafc;
}

.viewer-container::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
}

/* 2. STYLE CHUNG CHO BẢNG */
.report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    position: relative;
}

/* 3. CỐ ĐỊNH HEADER Ở TRÊN CÙNG */
.report-table thead {
    position: sticky;
    top: 0;
    z-index: 20;
}

.report-table th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    /* ĐÃ SỬA: Giảm padding từ 16px xuống 12px để phần Header mỏng lại */
    padding: 12px 16px;
    border-bottom: 2px solid #cbd5e1;
    text-transform: uppercase;
    font-size: 13px;
}

/* 4. CỐ ĐỊNH FOOTER Ở DƯỚI CÙNG */
.report-table tfoot {
    position: sticky;
    bottom: 0;
    z-index: 20;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
}

.row-final td {
    background-color: #1e293b;
}

.tfoot-totals td {
    background-color: #f8fafc;
}

/* --- ĐỊNH DẠNG DỮ LIỆU --- */
.report-table td {
    /* ĐÃ SỬA: Giảm padding từ 12px xuống 10px để các dòng dữ liệu khít lại, bảng sẽ gọn hơn */
    padding: 10px 16px;
    border-bottom: 1px solid #f1f5f9;
}

.text-left {
    text-align: left;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.w-50 {
    width: 50%;
}

.w-20 {
    width: 20%;
}

.w-30 {
    width: 30%;
}

.uppercase {
    text-transform: uppercase;
}

.pl-30 {
    padding-left: 30px !important;
}

.account-code {
    color: #94a3b8;
    font-family: monospace;
    font-size: 13px;
}

.amount {
    font-weight: 500;
    color: #1e293b;
}

.amount-total {
    font-weight: 700;
    font-size: 15px;
}

/* Categories */
.row-category td {
    font-weight: 700;
    /* ĐÃ SỬA: Giảm khoảng trống trên dưới của các dòng Tiêu đề (A. TÀI SẢN, B. NGUỒN VỐN...) */
    padding-top: 14px;
    padding-bottom: 8px;
}

.row-blue td {
    color: #1d4ed8;
}

.row-red td {
    color: #b91c1c;
}

.row-purple td {
    color: #6d28d9;
}

.text-blue {
    color: #1d4ed8 !important;
}

.text-purple {
    color: #6d28d9 !important;
}

.text-red {
    color: #dc2626 !important;
}

.text-green {
    color: #16a34a !important;
}

.row-data:hover td {
    background-color: #f1f5f9;
}

.row-summary td {
    font-weight: 600;
    background-color: #f8fafc;
}

/* Footer / Final Totals */
.row-final {
    color: white;
}

.row-final td {
    font-weight: 700;
    font-size: 15px;
    /* ĐÃ SỬA: Giảm độ dày của dòng Lợi nhuận thuần */
    padding: 12px 16px;
    border: none;
}

.amount-final {
    font-size: 18px;
}

.tfoot-totals {
    border-top: 2px solid #cbd5e1;
}

.tfoot-totals td {
    font-weight: 700;
    font-size: 15px;
    color: #334155;
    /* ĐÃ SỬA: Giảm độ dày của dòng Tổng cộng Tài sản / Nguồn vốn */
    padding: 12px 16px;
}
</style>