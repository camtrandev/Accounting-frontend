<template>
    <section class="card detail-card">
        <div class="card-header-custom">
            <h2 class="table-title">Danh sách hàng hóa, dịch vụ mua vào</h2>
        </div>

        <div class="table-container">
            <table class="erp-table">
                <thead>
                    <tr>
                        <th width="40">#</th>
                        <th>Mã/Tên hàng hóa</th>
                        <th width="80">ĐVT</th>
                        <th width="80">SL</th>
                        <th width="160">Đơn giá mua</th>
                        <th width="80">CK (%)</th>
                        <th width="160">Thành tiền</th>
                        <th width="80">TK Nợ</th>
                        <th width="80">TK Có</th>
                        <th width="40"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in details" :key="index">
                        <td class="text-center">{{ index + 1 }}</td>

                        <td class="name-tooltip-wrapper">
                            <input type="text" v-model="item.ItemName" class="table-input" placeholder="Tên hàng hóa..." />
                            <div class="custom-tooltip" v-if="item.ItemName">{{ item.ItemName }}</div>
                        </td>

                        <td>
                            <input type="text" v-model="item.Unit" class="table-input text-center" placeholder="ĐVT" />
                        </td>

                        <td>
                            <input type="text" :value="formatVietnameseNumber(item.Quantity)" class="table-input text-right"
                                @blur="onNumberInputBlur(item, 'Quantity', $event)" placeholder="0" />
                        </td>

                        <td>
                            <div class="amount-wrapper">
                                <input type="text" :value="formatVietnameseNumber(item.UnitPrice)" class="table-input text-right"
                                    @blur="onNumberInputBlur(item, 'UnitPrice', $event)" placeholder="0" />
                                <span class="currency-unit">VNĐ</span>
                            </div>
                        </td>

                        <td>
                            <input type="text" :value="formatVietnameseNumber(item.DiscountRate)" class="table-input text-right"
                                @blur="onNumberInputBlur(item, 'DiscountRate', $event)" placeholder="0" />
                        </td>

                        <td>
                            <div class="amount-wrapper">
                                <span class="text-highlight font-weight-bold">{{ formatVND(item.Amount) }}</span>
                                <span class="currency-unit">VNĐ</span>
                            </div>
                        </td>

                        <td>
                            <input type="text" v-model="item.DebitAcc" class="table-input text-center font-weight-bold"
                                placeholder="1561" />
                        </td>

                        <td>
                            <input type="text" v-model="item.CreditAcc" class="table-input text-center font-weight-bold"
                                placeholder="331" />
                        </td>

                        <td class="text-center text-danger cursor-pointer" @click="removeRow(index)">
                            <span title="Xóa dòng" class="delete-icon">✕</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="table-actions">
                <button class="btn-add-row" @click="addRow">+ Thêm dòng mặt hàng</button>
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

const emit = defineEmits(['update-totals']);

// Format số chuẩn từ C# (166666.67) sang chuỗi hiển thị VN ("166.666,67")
const formatVietnameseNumber = (val) => {
    if (val === null || val === undefined || val === '') return '';
    const num = Number(val);
    if (isNaN(num)) return '';
    
    return new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 4 
    }).format(num);
};

// Xử lý chung khi người dùng nhập xong (blur)
const onNumberInputBlur = (item, field, event) => {
    let rawValue = event.target.value;
    
    if (!rawValue) {
        item[field] = 0; 
    } else {
        let cleanString = String(rawValue).replace(/\./g, '').replace(',', '.');
        let parsedNumber = parseFloat(cleanString);
        
        item[field] = isNaN(parsedNumber) ? 0 : parsedNumber;
    }

    event.target.value = formatVietnameseNumber(item[field]);
    updateRow(item);
};

// Cập nhật tính toán lại dòng
const updateRow = (item) => {
    const qty = Number(item.Quantity) || 0;
    const price = Number(item.UnitPrice) || 0;
    const discount = Number(item.DiscountRate) || 0;

    item.Amount = Math.round(qty * price * (1 - discount / 100));
    emit('update-totals');
};

// Format tiền tệ riêng cho nhãn hiển thị Thành tiền
const formatVND = (val) => {
    if (!val) return "0";
    return new Intl.NumberFormat('vi-VN').format(val);
};

// Thêm dòng mới
const addRow = () => {
    props.details.push({
        ItemName: '', Unit: '', Quantity: '', UnitPrice: '', DiscountRate: '', Amount: '', DebitAcc: '', CreditAcc: ''
    });
};

// Xóa dòng
const removeRow = (index) => {
    if (props.details.length > 1) {
        props.details.splice(index, 1);
        emit('update-totals');
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
    border-left: 4px solid #4f46e5;
    line-height: 1.2;
}

.erp-table {
    width: 100%;
    border-collapse: collapse;
}

.cursor-pointer {
    cursor: pointer;
}

.erp-table th,
.erp-table td {
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    font-size: 14px;
    vertical-align: middle;
}

.erp-table th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    text-align: center;
}

.table-input {
    width: 100%;
    box-sizing: border-box;
    /* Quan trọng: Giúp input thu gọn hoàn toàn trong thẻ td */
    border: 1px solid #cbd5e1;
    background: #fff;
    padding: 6px 8px;
    border-radius: 4px;
    outline: none;
    transition: all 0.2s;
    margin: 0;
    /* Xóa margin mặc định */
}

.table-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.amount-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.currency-unit {
    margin-left: 4px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.text-highlight {
    color: #4f46e5;
}

.text-danger {
    color: #ef4444;
}

.btn-add-row {
    background: transparent;
    color: #4f46e5;
    border: 1px dashed #a5b4fc;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 12px;
    margin-left: 12px;
    margin-bottom: 12px;
}

.btn-add-row:hover {
    background: #eef2ff;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Khi tên hàng nhỏ quá */

/* Container bao bọc ô input */
.name-tooltip-wrapper {
    position: relative;
}

/* Kiểu dáng cho Tooltip */
.custom-tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    bottom: 100%;
    /* Đẩy tooltip bay lên phía trên ô input */
    left: 0;
    margin-bottom: 5px;
    /* Cách ô input một chút */
    background-color: #2c3e50;
    /* Màu nền tối */
    color: #ffffff;
    /* Chữ trắng */
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;
    white-space: nowrap;
    /* Giữ cho chữ hiển thị trên 1 dòng */
    z-index: 999;
    pointer-events: none;
    /* Tránh việc chuột hover nhầm vào chính tooltip */
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
}

/* Thêm hình tam giác nhỏ chỉ xuống ô input cho đẹp */
.custom-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    /* Đặt ở đáy tooltip */
    left: 20px;
    /* Căn sang trái một chút */
    border-width: 5px;
    border-style: solid;
    border-color: #2c3e50 transparent transparent transparent;
}

/* HÀNH ĐỘNG: Khi hover chuột vào thẻ td, sẽ hiện tooltip lên */
.name-tooltip-wrapper:hover .custom-tooltip {
    visibility: visible;
    opacity: 1;
}
</style>