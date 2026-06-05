<template>
    <div class="viewer-container">

        <table v-if="reportId === 'revenue-by-item'" class="report-table">
            <thead>
                <tr>
                    <th class="text-left w-30">Mã Hàng</th>
                    <th class="text-left w-40">Tên Hàng Hóa / Dịch vụ</th>
                    <th class="text-center w-10">ĐVT</th>
                    <th class="text-right w-10">Số lượng bán</th>
                    <th class="text-right w-10">Tổng Doanh Thu (VNĐ)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!data || data.length === 0">
                    <td colspan="5" class="text-center txt-muted py-4">Không có dữ liệu doanh thu trong khoảng thời gian
                        này</td>
                </tr>
                <tr v-for="(row, idx) in data" :key="idx" class="row-data">
                    <td class="font-mono text-green pl-16">{{ row.itemCode }}</td>
                    <td class="font-medium">{{ row.itemName }}</td>

                    <td class="text-center text-muted">{{ row.unit }}</td>
                    <td class="text-right">{{ formatNum(row.quantitySold) }}</td>
                    <td class="text-right font-bold text-blue">{{ formatCurrency(row.revenueAmount) }}</td>
                </tr>
            </tbody>
            <tfoot class="tfoot-totals" v-if="data && data.length > 0">
                <tr>
                    <td colspan="3" class="uppercase text-right pr-4">TỔNG CỘNG</td>
                    <td class="text-right text-red">{{ formatNum(totalQty) }}</td>
                    <td class="text-right text-red">{{ formatCurrency(totalRevenue) }}</td>
                </tr>
            </tfoot>
        </table>

        <table v-if="reportId === 'debt-summary'" class="report-table">
            <thead>
                <tr>
                    <th class="text-left">Mã KH</th>
                    <th class="text-left">Tên Khách Hàng</th>
                    <th class="text-right">Nợ Đầu Kỳ</th>
                    <th class="text-right">PS Tăng (Mua)</th>
                    <th class="text-right">PS Giảm (Trả)</th>
                    <th class="text-right">Nợ Cuối Kỳ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!data || data.length === 0">
                    <td colspan="6" class="text-center txt-muted py-4">Không có dữ liệu công nợ trong khoảng thời gian
                        này</td>
                </tr>
                <tr v-for="(row, idx) in data" :key="idx" class="row-data">
                    <td class="font-mono pl-16">{{ row.partnerCode }}</td>
                    <td class="font-medium">{{ row.partnerName }}</td>

                    <td class="text-right">{{ formatCurrency(row.openingDebt) }}</td>
                    <td class="text-right text-red">{{ formatCurrency(row.incurredDebit) }}</td>
                    <td class="text-right text-green">{{ formatCurrency(row.incurredCredit) }}</td>
                    <td class="text-right font-bold text-blue">{{ formatCurrency(row.closingDebt) }}</td>
                </tr>
            </tbody>
            <tfoot class="tfoot-totals" v-if="data && data.length > 0">
                <tr>
                    <td colspan="2" class="uppercase text-right pr-4">TỔNG CỘNG</td>
                    <td class="text-right">{{ formatCurrency(totalDebtOpening) }}</td>
                    <td class="text-right text-red">{{ formatCurrency(totalDebtIncrease) }}</td>
                    <td class="text-right text-green">{{ formatCurrency(totalDebtDecrease) }}</td>
                    <td class="text-right text-blue">{{ formatCurrency(totalDebtClosing) }}</td>
                </tr>
            </tfoot>
        </table>

    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    reportId: { type: String, required: true },
    data: { type: Array, required: true, default: () => [] }
});

const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '0';
    return new Intl.NumberFormat('vi-VN').format(val);
};

const formatNum = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '0';
    return new Intl.NumberFormat('vi-VN').format(val);
};

// ĐÃ SỬA HÀM TÍNH TỔNG: Ánh xạ chính xác các biến quantitySold và revenueAmount
const totalQty = computed(() => props.data.reduce((sum, item) => sum + (item.quantitySold || 0), 0));
const totalRevenue = computed(() => props.data.reduce((sum, item) => sum + (item.revenueAmount || 0), 0));

// HÀM TÍNH TỔNG CÔNG NỢ
const totalDebtOpening = computed(() => props.data.reduce((sum, item) => sum + (item.openingDebt || 0), 0));
const totalDebtIncrease = computed(() => props.data.reduce((sum, item) => sum + (item.incurredDebit || 0), 0));
const totalDebtDecrease = computed(() => props.data.reduce((sum, item) => sum + (item.incurredCredit || 0), 0));
const totalDebtClosing = computed(() => props.data.reduce((sum, item) => sum + (item.closingDebt || 0), 0));
</script>

<style scoped>
.viewer-container {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    max-height: calc(100vh - 380px);
    overflow-y: auto;
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

.report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    position: relative;
}

.report-table thead {
    position: sticky;
    top: 0;
    z-index: 20;
}

.report-table th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    padding: 12px 16px;
    border-bottom: 2px solid #cbd5e1;
    text-transform: uppercase;
    font-size: 13px;
}

.report-table tfoot {
    position: sticky;
    bottom: 0;
    z-index: 20;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
}

.tfoot-totals td {
    background-color: #f8fafc;
    font-weight: 700;
    font-size: 15px;
    color: #1e293b;
    padding: 12px 16px;
    border-top: 2px solid #cbd5e1;
}

.report-table td {
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

.uppercase {
    text-transform: uppercase;
}

.w-10 {
    width: 10%;
}

.w-30 {
    width: 30%;
}

.w-40 {
    width: 40%;
}

.pl-16 {
    padding-left: 16px !important;
}

.pr-4 {
    padding-right: 16px !important;
}

.py-4 {
    padding-top: 16px !important;
    padding-bottom: 16px !important;
}

.text-blue {
    color: #2563eb !important;
}

.text-green {
    color: #16a34a !important;
}

.text-red {
    color: #dc2626 !important;
}

.txt-muted {
    color: #94a3b8;
    font-style: italic;
}

.font-mono {
    font-family: monospace;
    font-size: 13px;
}

.font-bold {
    font-weight: 700;
}

.font-medium {
    font-weight: 500;
}

.row-data:hover td {
    background-color: #f1f5f9;
}
</style>