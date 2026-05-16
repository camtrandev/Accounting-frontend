<template>
    <div class="table-wrapper">
        <table class="modern-table">
            <thead>
                <tr>
                    <th class="text-center date-col">Ngày CT</th>
                    <th class="text-center ref-col">Số CT</th>
                    <th class="text-center account-col">Tài khoản</th>
                    <th class="text-right money-col">Phát sinh Nợ</th>
                    <th class="text-right money-col">Phát sinh Có</th>

                    <!-- Cột diễn giải rộng hơn và đứng trước Thao tác -->
                    <th class="description-col">Diễn giải</th>

                    <!-- Cột thao tác nhỏ gọn -->
                    <th class="text-center action-col">Thao tác</th>
                </tr>
            </thead>

            <tbody>
                <!-- Loading -->
                <tr v-if="loading">
                    <td colspan="7" class="text-center padding-box">
                        <div class="spinner"></div>
                        <span class="loading-text">
                            Đang tải dữ liệu...
                        </span>
                    </td>
                </tr>

                <!-- Empty -->
                <tr v-else-if="!loading && (!data || data.length === 0)">
                    <td colspan="7" class="text-center padding-box empty-state">
                        📁 Không có dữ liệu phát sinh trong khoảng thời gian này.
                    </td>
                </tr>

                <!-- Data -->
                <template v-else>

                    <!-- Số dư đầu kỳ -->
                    <tr class="special-row opening-row">
                        <td class="text-center">-</td>
                        <td class="text-center">-</td>

                        <td class="text-center font-semibold">
                            {{ currentAccountCode }}
                        </td>

                        <td class="text-right font-semibold">
                            {{ formatMoney(openingBalance, true) }}
                        </td>

                        <td class="text-right font-semibold">
                            {{ formatMoney(openingBalance, false) }}
                        </td>

                        <td class="font-semibold description-col">
                            Số dư đầu kỳ
                        </td>

                        <td class="text-center">-</td>
                    </tr>

                    <!-- Dữ liệu -->
                    <tr v-for="item in data" :key="item.id" class="data-row">
                        <td class="text-center">
                            {{ formatDate(item.date) }}
                        </td>

                        <td class="text-center">
                            <span class="ref-no" @click="$emit('viewDetail', item)">
                                {{ item.refNo }}
                            </span>
                        </td>

                        <td class="text-center">
                            <span class="badge-account">
                                {{ item.accountCode }}
                            </span>
                        </td>

                        <td class="text-right text-debit">
                            {{ formatMoney(item.debit) }}
                        </td>

                        <td class="text-right text-credit">
                            {{ formatMoney(item.credit) }}
                        </td>

                        <!-- Diễn giải -->
                        <td class="description-col">
                            {{ item.description }}
                        </td>

                        <!-- Thao tác -->
                        <td class="text-center action-col">
                            <button @click="$emit('viewDetail', item)" class="btn-icon" title="Xem chi tiết">
                                👁️
                            </button>
                        </td>
                    </tr>

                    <!-- Tổng phát sinh -->
                    <tr class="special-row total-row">
                        <td class="text-center">-</td>
                        <td class="text-center">-</td>
                        <td class="text-center">-</td>

                        <td class="text-right font-bold text-debit">
                            {{ formatMoney(totalDebit) }}
                        </td>

                        <td class="text-right font-bold text-credit">
                            {{ formatMoney(totalCredit) }}
                        </td>

                        <td class="font-semibold text-uppercase description-col">
                            Cộng phát sinh trong kỳ
                        </td>

                        <td class="text-center">-</td>
                    </tr>

                    <!-- Số dư cuối kỳ -->
                    <tr class="special-row closing-row">
                        <td class="text-center">-</td>
                        <td class="text-center">-</td>

                        <td class="text-center font-semibold">
                            {{ currentAccountCode }}
                        </td>

                        <td class="text-right font-semibold">
                            {{ formatMoney(closingBalance, true) }}
                        </td>

                        <td class="text-right font-semibold">
                            {{ formatMoney(closingBalance, false) }}
                        </td>

                        <td class="font-semibold description-col">
                            Số dư cuối kỳ
                        </td>

                        <td class="text-center">-</td>
                    </tr>

                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },

    loading: {
        type: Boolean,
        default: false
    },

    openingBalance: {
        type: Number,
        default: 0
    },

    closingBalance: {
        type: Number,
        default: 0
    },

    totalDebit: {
        type: Number,
        default: 0
    },

    totalCredit: {
        type: Number,
        default: 0
    },

    currentAccountCode: {
        type: String,
        default: '---'
    }
});

defineEmits(['viewDetail']);

/**
 * Format ngày dd/mm/yyyy
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '-';

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        return dateStr;
    }

    return new Intl.DateTimeFormat('vi-VN').format(date);
};

/**
 * Format tiền tệ
 */
const formatMoney = (val, isDebitType = null) => {
    if (isDebitType !== null && val === 0) {
        return '-';
    }

    if (!val || val === 0) {
        return '-';
    }

    return new Intl.NumberFormat('vi-VN').format(val);
};
</script>

<style scoped>
/* =========================
   TABLE WRAPPER
========================= */
.table-wrapper {
    background: #ffffff;
    border-radius: 10px;
    overflow-x: auto;
    max-height: 550px;
    border: 1px solid #edf2f7;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

/* =========================
   TABLE
========================= */
.modern-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: auto;
}

/* =========================
   HEADER
========================= */
.modern-table th {
    position: sticky;
    top: 0;
    z-index: 10;

    background: #f8f9fa;
    color: #495057;

    padding: 14px 12px;

    font-size: 13px;
    font-weight: 600;

    text-transform: uppercase;
    letter-spacing: 0.5px;

    border-bottom: 2px solid #dee2e6;
    /* Thêm đường kẻ dọc giữa các cột tiêu đề (trừ cột cuối cùng) */
    border-right: 1px solid #dee2e6;

    white-space: nowrap;
}

.modern-table th:last-child {
    border-right: none;
}

/* =========================
   BODY
========================= */
.modern-table td {
    padding: 12px;
    border-bottom: 1px solid #edf2f7;
    /* Thêm đường kẻ dọc giữa các ô nội dung (trừ cột cuối cùng) */
    border-right: 1px solid #edf2f7;

    font-size: 14px;
    color: #2d3748;

    vertical-align: middle;
}

.modern-table td:last-child {
    border-right: none;
}

/* =========================
   COLUMN WIDTH
========================= */
.date-col {
    width: 120px;
}

.ref-col {
    width: 130px;
}

.account-col {
    width: 120px;
}

.money-col {
    width: 170px;
}

.action-col {
    width: 90px;
    min-width: 90px;
    white-space: nowrap;
}

.description-col {
    /* Đã tăng kích thước cột diễn giải */
    min-width: 270px;
    width: 30%;

    line-height: 1.6;
    color: #1f2937;

    word-break: break-word;
}

/* =========================
   ROW STATES
========================= */
.data-row {
    transition: background-color 0.2s ease;
}

.data-row:hover {
    background-color: #f8fafd;
}

.special-row {
    background-color: #fafafa;
}

.special-row td {
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    color: #1a202c;
}

.special-row td:last-child {
    border-right: none;
}

.total-row {
    background-color: #f1f5f9;
}

.opening-row td,
.closing-row td {
    font-style: italic;
}

/* =========================
   TEXT HELPERS
========================= */
.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

.font-semibold {
    font-weight: 600;
}

.font-bold {
    font-weight: 700;
}

.text-uppercase {
    text-transform: uppercase;
}

/* =========================
   COLORS
========================= */
.text-debit {
    color: #0288d1;
    font-weight: 500;
}

.text-credit {
    color: #d32f2f;
    font-weight: 500;
}

/* =========================
   REF NUMBER
========================= */
.ref-no {
    color: #007bff;
    font-weight: 500;

    cursor: pointer;
    text-decoration: underline;

    transition: color 0.2s ease;
}

.ref-no:hover {
    color: #0056b3;
}

/* =========================
   ACCOUNT BADGE
========================= */
.badge-account {
    display: inline-block;

    background: #eef2f6;

    padding: 4px 8px;
    border-radius: 4px;

    font-weight: 600;
    font-family: monospace;

    color: #334155;
}

/* =========================
   ACTION BUTTON
========================= */
.btn-icon {
    border: none;

    background: #e1f5fe;
    color: #03a9f4;

    padding: 5px 9px;

    border-radius: 6px;

    cursor: pointer;

    transition: all 0.2s ease;
}

.btn-icon:hover {
    background: #03a9f4;
    color: white;
    transform: scale(1.05);
}

/* =========================
   LOADING
========================= */
.padding-box {
    padding: 40px !important;
}

.loading-text {
    display: block;
    margin-top: 10px;
    color: #718096;
}

.spinner {
    width: 30px;
    height: 30px;

    margin: 0 auto;

    border: 3px solid #e2e8f0;
    border-top-color: #007bff;
    border-radius: 50%;

    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* =========================
   EMPTY STATE
========================= */
.empty-state {
    color: #a0aec0;
    font-size: 15px;
}
</style>