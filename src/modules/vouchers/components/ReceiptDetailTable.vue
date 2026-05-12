<template>
    <section class="card-container detail-card">
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
                        <th width="200">Số tiền</th>
                        <th width="40"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in details" :key="index">
                        <td class="text-center index-col">{{ index + 1 }}</td>

                        <!-- Cột Diễn giải -->
                        <td class="cell-input">
                            <input type="text" v-model="item.Description" class="table-input"
                                placeholder="VD: Thu tiền nợ hóa đơn HD001..." />
                        </td>

                        <!-- Cột TK Nợ -->
                        <td class="cell-input">
                            <input type="text" v-model="item.DebitAcc" class="table-input text-center font-weight-bold"
                                placeholder="1111" />
                        </td>

                        <!-- Cột TK Có -->
                        <td class="cell-input">
                            <input type="text" v-model="item.CreditAcc" class="table-input text-center font-weight-bold"
                                placeholder="131" />
                        </td>

                        <!-- Cột Số tiền (kèm đơn vị VNĐ) -->
                        <td class="cell-input">
                            <div class="amount-wrapper-table">
                                <input type="number" v-model.number="item.Amount"
                                    class="inner-input text-right font-weight-bold text-highlight" placeholder="0" />
                                <span class="currency-label">VNĐ</span>
                            </div>
                        </td>

                        <!-- Nút Xóa -->
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
const props = defineProps({
    details: {
        type: Array,
        required: true
    }
});

// Hàm thêm dòng - Các trường chữ để rỗng, tiền mặc định là 0
const addRow = () => {
    props.details.push({
        Description: '',
        DebitAcc: '',
        CreditAcc: '',
        Amount: 0 // Khởi tạo tiền là 0
    });
};

// Hàm xóa dòng
const removeRow = (index) => {
    if (props.details.length > 1) {
        props.details.splice(index, 1);
    } else {
        alert("Phiếu thu phải có ít nhất 1 dòng hạch toán!");
    }
};
</script>

<style scoped>
/* Container tổng */
.card-container {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    margin-top: 4px;
}

.card-header-custom {
    padding: 14px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #fff;
}

.table-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    padding-left: 10px;
    border-left: 4px solid #10b981;
    /* Màu xanh lá cho phiếu thu */
}

/* Bảng ERP */
.erp-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

/* Các đường kẻ dọc và ngang */
.erp-table th,
.erp-table td {
    border: 1px solid #e2e8f0;
    vertical-align: middle;
}

.erp-table th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    text-align: center;
    padding: 10px 8px;
    font-size: 13px;
    text-transform: uppercase;
}

/* Ép ngắn độ cao dòng của bảng */
.erp-table td {
    padding: 6px 12px;
    font-size: 14px;
    height: 40px;
}

/* Thiết lập padding cho ô chứa input để tạo khoảng cách với viền bảng */
.erp-table td.cell-input {
    padding: 4px 8px;
}

/* Kiểu dáng ô vuông cho Input thông thường */
.table-input {
    width: 100%;
    height: 30px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    padding: 0 8px;
    outline: none;
    color: #1e293b;
    transition: all 0.2s;
    box-sizing: border-box;
    display: block;
    font-family: inherit;
    font-size: 14px;
}

.table-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

/* Khối nhập số tiền (Chứa cả input và chữ VNĐ) cũng thiết kế ô vuông */
.amount-wrapper-table {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    transition: all 0.2s;
    box-sizing: border-box;
}

.amount-wrapper-table:focus-within {
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

.inner-input {
    width: 100%;
    border: none;
    outline: none;
    padding: 0 8px;
    background: transparent;
    font-size: 14px;
    color: #1e293b;
    font-family: inherit;
}

/* Các thành phần phụ */
.currency-label {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    padding-right: 8px;
}

.text-highlight {
    color: #059669;
}

.font-weight-bold {
    font-weight: 600;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.text-danger {
    color: #ef4444;
}

.cursor-pointer {
    cursor: pointer;
}

.index-col {
    color: #94a3b8;
    font-weight: 600;
}

.delete-icon {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    transition: 0.2s;
    font-size: 15px;
}

.delete-icon:hover {
    background-color: #fee2e2;
}

.table-actions {
    padding: 12px 20px;
    border-top: 1px solid #e2e8f0;
}

.btn-add-row {
    background: transparent;
    color: #10b981;
    border: 1px dashed #6ee7b7;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add-row:hover {
    background: #ecfdf5;
}

/* Ẩn mũi tên cuộn của thẻ input type=number */
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