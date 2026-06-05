<template>
    <div class="viewer-container">

        <table v-if="reportId === 'stock-report'" class="report-table">
            <thead>
                <tr>
                    <th>Mã Vật Tư</th>
                    <th>Tên Vật Tư</th>
                    <th class="text-center">ĐVT</th>
                    <th class="text-right">Tồn Đầu (SL)</th>
                    <th class="text-right">Nhập (SL)</th>
                    <th class="text-right">Xuất (SL)</th>
                    <th class="text-right">Tồn Cuối (SL)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!data || data.length === 0">
                    <td colspan="7" class="text-center py-4">Không có dữ liệu</td>
                </tr>
                <tr v-for="(row, idx) in data" :key="idx" class="row-data">
                    <td class="font-mono text-blue">{{ row.itemCode }}</td>
                    <td class="font-medium">{{ row.itemName }}</td>
                    <td class="text-center text-muted">{{ row.unitName }}</td>
                    <td class="text-right">{{ formatNum(row.openingQty) }}</td>
                    <td class="text-right text-green">{{ formatNum(row.inQty) }}</td>
                    <td class="text-right text-red">{{ formatNum(row.outQty) }}</td>
                    <td class="text-right font-bold">{{ formatNum(row.closingQty) }}</td>
                </tr>
            </tbody>
        </table>

        <table v-if="reportId === 'inventory-detail'" class="report-table">
            <thead>
                <tr>
                    <th>Ngày chứng từ</th>
                    <th>Số CT</th>
                    <th>Diễn giải</th>
                    <th class="text-right">SL Nhập</th>
                    <th class="text-right">SL Xuất</th>
                    <th class="text-right">SL Tồn</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!data || data.length === 0">
                    <td colspan="6" class="text-center py-4">Không có phát sinh</td>
                </tr>
                <tr v-for="(row, idx) in data" :key="idx" class="row-data">
                    <td>{{ formatDateStr(row.documentDate) }}</td>
                    <td class="font-mono">{{ row.documentNo }}</td>
                    <td>{{ row.description }}</td>
                    <td class="text-right text-green">{{ formatNum(row.inQty) }}</td>
                    <td class="text-right text-red">{{ formatNum(row.outQty) }}</td>
                    <td class="text-right font-bold bg-gray-50">{{ formatNum(row.balanceQty) }}</td>
                </tr>
            </tbody>
        </table>

        <table v-if="reportId === 'slow-moving'" class="report-table">
            <thead>
                <tr>
                    <th>Mã Vật Tư</th>
                    <th>Tên Vật Tư</th>
                    <th class="text-center">Kho</th>
                    <th class="text-right">Tồn Hiện Tại</th>
                    <th class="text-center">Ngày GD Cuối</th>
                    <th class="text-center">Số Ngày Không GD</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!data || data.length === 0">
                    <td colspan="6" class="text-center py-4">Không có hàng chậm luân chuyển</td>
                </tr>
                <tr v-for="(row, idx) in data" :key="idx" class="row-data">
                    <td class="font-mono text-blue">{{ row.itemCode }}</td>
                    <td class="font-medium">{{ row.itemName }}</td>
                    <td class="text-center">{{ row.warehouseName }}</td>
                    <td class="text-right font-bold">{{ formatNum(row.currentStock) }}</td>
                    <td class="text-center">{{ formatDateStr(row.lastTransactionDate) }}</td>
                    <td class="text-center font-bold text-red">{{ row.daysUnmoved }} ngày</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    reportId: { type: String, required: true },
    data: { type: [Array, Object], required: true }
});

const formatNum = (val) => {
    if (!val) return '0';
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
    max-height: calc(100vh - 350px);
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
    text-align: left;
}

.report-table td {
    padding: 10px 16px;
    border-bottom: 1px solid #f1f5f9;
}

.text-center {
    text-align: center !important;
}

.text-right {
    text-align: right !important;
}

.text-blue {
    color: #2563eb;
}

.text-green {
    color: #16a34a;
}

.text-red {
    color: #dc2626;
}

.text-muted {
    color: #94a3b8;
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

.bg-gray-50 {
    background-color: #f8fafc;
}

.row-data:hover td {
    background-color: #f1f5f9;
}
</style>