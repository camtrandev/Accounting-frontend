<template>
    <section class="card detail-card">
        <div class="card-header-custom">
            <h2 class="table-title">Hạch toán chi tiết</h2>
        </div>

        <div class="table-container">
            <table class="erp-table">
                <thead>
                    <tr>
                        <th width="40">#</th>
                        <th>Diễn giải chi tiết</th>
                        <th width="120">TK Nợ</th>
                        <th width="120">TK Có</th>
                        <th width="180">Số tiền</th>
                        <th width="40"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in details" :key="index">
                        <td class="text-center">{{ index + 1 }}</td>

                        <td>
                            <input type="text" v-model="item.Description" class="table-input"
                                placeholder="Nhập diễn giải chi..." />
                        </td>

                        <td>
                            <input type="text" v-model="item.DebitAcc" class="table-input text-center font-weight-bold"
                                placeholder="Nợ..." />
                        </td>

                        <td>
                            <input type="text" v-model="item.CreditAcc" class="table-input text-center font-weight-bold"
                                placeholder="Có..." />
                        </td>

                        <td>
                            <div class="amount-wrapper">
                                <input type="number" v-model="item.Amount"
                                    class="table-input text-right font-weight-bold text-highlight" placeholder="0" />
                                <span class="currency-unit">VNĐ</span>
                            </div>
                        </td>

                        <td class="text-center text-danger cursor-pointer" @click="removeRow(index)">
                            <span title="Xóa dòng" class="delete-icon">✕</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="table-actions">
                <button class="btn-add-row" @click="addRow">+ Thêm dòng hạch toán</button>
            </div>
        </div>
    </section>
</template>

<script setup>
// Nhận dữ liệu mảng Details từ trang cha truyền xuống
const props = defineProps({
    details: {
        type: Array,
        required: true
    }
});

// Hàm thêm dòng
const addRow = () => {
    props.details.push({
        Description: '',
        DebitAcc: '331',
        CreditAcc: '1111',
        Amount: 0
    });
};

// Hàm xóa dòng
const removeRow = (index) => {
    if (props.details.length > 1) {
        props.details.splice(index, 1);
    } else {
        alert("Phiếu chi phải có ít nhất 1 dòng hạch toán!");
    }
};
</script>

<style scoped>
.card {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* TABLE BẢNG KÊ */
.detail-card {
    overflow: hidden;
}

.card-header-custom {
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #fff;
}

.table-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    padding-left: 12px;
    border-left: 4px solid #ef4444;
    /* Thanh nhấn màu đỏ */
}

.table-container {
    padding: 0;
}

.erp-table {
    width: 100%;
    border-collapse: collapse;
}

.erp-table th,
.erp-table td {
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    font-size: 14px;
    vertical-align: middle;
    /* Căn giữa chiều dọc hoàn hảo */
}

.erp-table th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    text-align: center;
}

.erp-table tbody tr:hover {
    background-color: #f1f5f9;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.font-weight-bold {
    font-weight: 600;
}

.text-highlight {
    color: #dc2626;
}

/* Số tiền màu đỏ đậm */

/* Input bên trong bảng */
.table-input {
    width: 100%;
    border: 1px solid #cbd5e1;
    background: #fff;
    padding: 6px 8px;
    border-radius: 4px;
    outline: none;
    color: #1e293b;
    transition: all 0.2s;
    margin: 0;
    box-sizing: border-box;
}

.table-input:hover,
.table-input:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

/* Đơn vị tiền tệ (VNĐ) */
.amount-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
}

.currency-unit {
    margin-left: 6px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
}

/* Nút xóa dòng */
.text-danger {
    color: #ef4444;
}

.cursor-pointer {
    cursor: pointer;
}

.delete-icon {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
}

.delete-icon:hover {
    background-color: #fee2e2;
}

/* Nút thêm dòng */
.table-actions {
    padding: 12px 20px;
    border-top: 1px solid #e2e8f0;
}

.btn-add-row {
    background: transparent;
    color: #ef4444;
    border: 1px dashed #fca5a5;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add-row:hover {
    background: #fef2f2;
}

/* Ẩn mũi tên thẻ input type="number" */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    appearance: textfield;
    -moz-appearance: textfield;
}
</style>