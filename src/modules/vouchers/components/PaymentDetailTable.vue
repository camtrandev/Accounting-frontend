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

                        <!-- Diễn giải: Sử dụng 'description' (chữ thường) để khớp với OCR -->
                        <td class="cell-input">
                            <input type="text" v-model="item.Description" class="table-input"
                                placeholder="VD: Chi tiền trả nợ NCC..." />
                        </td>

                        <!-- TK Nợ: Thường là 331, 642... khớp với 'debitAccount' -->
                        <td class="cell-input">
                            <input type="text" v-model="item.DebitAcc"
                                class="table-input text-center font-weight-bold" placeholder="331" />
                        </td>

                        <!-- TK Có: Thường là 1111 (Tiền mặt) khớp với 'creditAccount' -->
                        <td class="cell-input">
                            <input type="text" v-model="item.CreditAcc"
                                class="table-input text-center font-weight-bold" placeholder="1111" />
                        </td>

                        <!-- Số tiền: Khớp với 'amount' -->
                        <td class="cell-input">
                            <div class="amount-wrapper">
                                <input type="number" v-model.number="item.Amount" class="table-input" placeholder="0" />
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
const props = defineProps({
    details: {
        type: Array,
        required: true
    }
});

/**
 * Lưu ý quan trọng: 
 * Các key (description, debitAccount, creditAccount, amount) 
 * phải viết thường giống hệt như cách AI trả về để Vue nhận diện phản hồi (reactivity).
 */

const addRow = () => {
    props.details.push({
        description: '',
        debitAccount: '331', // Mặc định cho phiếu chi
        creditAccount: '1111', // Mặc định tiền mặt
        amount: 0
    });
};

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

.amount-wrapper {
    position: relative;
    /* Quan trọng: Làm gốc tọa độ cho VNĐ */
    display: flex;
    align-items: center;
    width: 100%;
    /* Chuyển các thuộc tính của border và background từ input sang đây */
    border: 1px solid #cbd5e1;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    transition: all 0.2s;
    overflow: hidden;
    /* Đảm bảo mọi thứ nằm gọn trong khung */
}

/* Thẻ input chính: Cần làm nó trở nên vô hình border và nền */
.amount-wrapper .table-input {
    flex: 1;
    /* Chiếm hết không gian còn lại */
    border: none;
    /* Loại bỏ border của chính nó */
    outline: none;
    /* Loại bỏ outline khi focus */
    background: transparent;
    /* Nền trong suốt */
    /* Padding-right cần đủ lớn để không chèn lên chữ VNĐ (ví dụ 45px) */
    padding: 6px 45px 6px 8px;
    text-align: right;
    margin: 0;
    width: 100%;
    box-shadow: none;
    /* Loại bỏ bóng của input */
    /* text-highlight và các màu sắc số tiền đỏ đậm vẫn hoạt động trên input này */
}

/* Hiệu ứng khi di chuột hoặc click vào ô (áp dụng cho thẻ wrapper) */
.amount-wrapper:hover,
.amount-wrapper:focus-within {
    border-color: #ef4444;
    /* Thanh nhấn màu đỏ */
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

/* Chữ VNĐ: Cố định vị trí tuyệt đối bên trong wrapper */
.amount-wrapper .currency-unit {
    position: absolute;
    right: 8px;
    /* Cách lề phải wrapper 8px */
    top: 50%;
    transform: translateY(-50%);
    /* Căn giữa chiều dọc hoàn hảo */
    color: #64748b;
    font-size: 12px;
    /* Kích thước nhỏ hơn một chút cho tinh tế */
    font-weight: 600;
    white-space: nowrap;
    /* Không bao giờ xuống dòng */
    margin: 0;
    /* Xóa margin cũ */
    pointer-events: none;
    /* Đảm bảo khi click vào chữ VNĐ thì vẫn là click vào input */
}
</style>