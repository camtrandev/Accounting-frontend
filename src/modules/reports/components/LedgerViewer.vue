<template>
    <div class="viewer-container">

        <table v-if="reportId === 'cash-book'" class="report-table">
            <thead>
                <tr>
                    <th class="text-center w-10">Ngày CT</th>
                    <th class="text-center w-10">Số CT</th>
                    <th class="text-left w-30">Diễn giải</th>
                    <th class="text-center w-10">TK Đối ứng</th>
                    <th class="text-right w-15">Thu (VNĐ)</th>
                    <th class="text-right w-15">Chi (VNĐ)</th>
                    <th class="text-right w-15">Tồn Quỹ (VNĐ)</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row-summary bg-gray-50">
                    <td colspan="4" class="font-bold text-right uppercase pr-4">SỐ DƯ ĐẦU KỲ</td>
                    <td></td>
                    <td></td>
                    <td class="text-right font-bold text-blue">{{ formatCurrency(data.openingBalance) }}</td>
                </tr>

                <tr v-if="!data.transactions || data.transactions.length === 0">
                    <td colspan="7" class="text-center txt-muted py-4">Không có giao dịch thu/chi trong kỳ</td>
                </tr>

                <tr v-for="(row, idx) in data.transactions" :key="idx" class="row-data">
                    <td class="text-center">{{ formatDateStr(row.transDate) }}</td>
                    <td class="font-mono text-center">{{ row.documentNo }}</td>
                    <td>{{ row.description }}</td>
                    <td class="text-center font-mono text-muted">{{ row.correspondingAccount }}</td>
                    <td class="text-right text-green">{{ formatCurrency(row.receiptAmount) }}</td>
                    <td class="text-right text-red">{{ formatCurrency(row.paymentAmount) }}</td>
                    <td class="text-right font-bold">{{ formatCurrency(row.balance) }}</td>
                </tr>
            </tbody>
            <tfoot class="tfoot-totals">
                <tr>
                    <td colspan="4" class="uppercase text-right pr-4 font-bold">CỘNG PHÁT SINH TRONG KỲ</td>
                    <td class="text-right text-green font-bold">{{ formatCurrency(data.totalReceipt) }}</td>
                    <td class="text-right text-red font-bold">{{ formatCurrency(data.totalPayment) }}</td>
                    <td></td>
                </tr>
                <tr class="row-final">
                    <td colspan="4" class="uppercase text-right pr-4">SỐ DƯ CUỐI KỲ</td>
                    <td></td>
                    <td></td>
                    <td class="text-right amount-final">{{ formatCurrency(data.closingBalance) }}</td>
                </tr>
            </tfoot>
        </table>

        <table v-if="reportId === 'general-ledger'" class="report-table">
            <thead>
                <tr>
                    <th class="text-center w-10">Ngày CT</th>
                    <th class="text-center w-10">Số CT</th>
                    <th class="text-left w-30">Diễn giải</th>
                    <th class="text-center w-10">Tài khoản</th>
                    <th class="text-right w-20">Phát sinh Nợ (VNĐ)</th>
                    <th class="text-right w-20">Phát sinh Có (VNĐ)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!data.transactions || data.transactions.length === 0">
                    <td colspan="6" class="text-center txt-muted py-4">Chưa có phát sinh nhật ký chung</td>
                </tr>

                <tr v-for="(row, idx) in data.transactions" :key="idx" class="row-data">
                    <td class="text-center">{{ formatDateStr(row.postingDate) }}</td>
                    <td class="font-mono text-center">CT-{{ row.documentId }}</td>
                    <td>{{ row.description }}</td>
                    <td class="text-center font-mono font-bold">{{ row.accountId }}</td>
                    <td class="text-right text-blue">{{ formatCurrency(row.debitAmount) }}</td>
                    <td class="text-right text-red">{{ formatCurrency(row.creditAmount) }}</td>
                </tr>
            </tbody>
            <tfoot class="tfoot-totals" v-if="data.transactions && data.transactions.length > 0">
                <tr>
                    <td colspan="4" class="uppercase text-right pr-4">TỔNG CỘNG PHÁT SINH</td>
                    <td class="text-right text-blue">{{ formatCurrency(data.totalDebit) }}</td>
                    <td class="text-right text-red">{{ formatCurrency(data.totalCredit) }}</td>
                </tr>
            </tfoot>
        </table>

    </div>
</template>

<script setup>
const props = defineProps({
    reportId: { type: String, required: true },
    data: { type: [Array, Object], required: true, default: () => ({}) }
});

const formatCurrency = (val) => {
    if (val === 0 || val === '0') return ''; // Ẩn số 0 cho bảng đỡ rối
    if (val === null || val === undefined || isNaN(val)) return '';
    return new Intl.NumberFormat('vi-VN').format(val);
};

const formatDateStr = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN');
};
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
    padding: 12px 16px;
    border-top: 2px solid #cbd5e1;
    font-weight: bold;
}

.row-final td {
    background-color: #1e293b;
    color: white;
    font-weight: 700;
    font-size: 15px;
    border: none;
    padding: 14px 16px;
}

.amount-final {
    font-size: 18px;
    color: #fff !important;
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

.w-15 {
    width: 15%;
}

.w-20 {
    width: 20%;
}

.w-30 {
    width: 30%;
}

.pr-4 {
    padding-right: 16px !important;
}

.py-4 {
    padding-top: 16px !important;
    padding-bottom: 16px !important;
}

.bg-gray-50 {
    background-color: #f8fafc;
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

.row-data:hover td {
    background-color: #f1f5f9;
}
</style>