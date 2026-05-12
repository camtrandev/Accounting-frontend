<template>
    <section class="card detail-card">
        <div class="card-header-custom">
            <h2 class="table-title">Danh sách hàng hóa, dịch vụ bán ra</h2>
        </div>

        <div class="table-container">
            <table class="erp-table">
                <thead>
                    <tr>
                        <th width="40">#</th>
                        <th>Mã/Tên hàng hóa</th>
                        <th width="80">ĐVT</th>
                        <th width="80">SL</th>
                        <th width="140">Đơn giá bán</th>
                        <th width="80">CK (%)</th>
                        <th width="180">Thành tiền</th>
                        <th width="120">TK Doanh thu</th>
                        <th width="40"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in details" :key="index">
                        <td class="text-center index-col">{{ index + 1 }}</td>

                        <!-- Tên hàng hóa -->
                        <td class="name-tooltip-wrapper">
                            <input type="text" v-model="item.ItemName" class="table-input"
                                placeholder="Tên hàng hóa..." />

                            <div class="custom-tooltip" v-if="item.ItemName">{{ item.ItemName }}</div>
                        </td>

                        <!-- ĐVT -->
                        <td class="cell-input">
                            <input type="text" v-model="item.Unit" class="table-input text-center" placeholder="ĐVT" />
                        </td>

                        <!-- Số lượng -->
                        <td class="cell-input">
                            <input type="number" v-model.number="item.Quantity" class="table-input text-right"
                                placeholder="0" />
                        </td>

                        <!-- Đơn giá bán -->
                        <td class="cell-input">
                            <input type="number" v-model.number="item.UnitPrice" class="table-input text-right"
                                placeholder="0" />
                        </td>

                        <!-- Chiết khấu (%) -->
                        <td class="cell-input">
                            <input type="number" v-model.number="item.DiscountRate" class="table-input text-right"
                                placeholder="0" />
                        </td>

                        <!-- Thành tiền -->
                        <td class="text-right">
                            <div class="amount-wrapper">
                                <span class="text-highlight font-weight-bold">
                                    {{ formatVND(calculateAmount(item)) }}
                                </span>
                                <span class="currency-unit">VNĐ</span>
                            </div>
                        </td>

                        <!-- TK Doanh thu -->
                        <td class="cell-input">
                            <input type="text" v-model="item.RevenueAcc"
                                class="table-input text-center font-weight-bold" placeholder="5111" />
                        </td>

                        <!-- Nút Xóa -->
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

const calculateAmount = (item) => {
    const qty = Number(item.Quantity) || 0;
    const price = Number(item.UnitPrice) || 0;
    const discount = Number(item.DiscountRate) || 0;
    item.Amount = qty * price * (1 - discount / 100);
    return item.Amount;
};

const formatVND = (val) => {
    if (!val) return "0";
    return new Intl.NumberFormat('vi-VN').format(Math.round(val));
};

const addRow = () => {
    props.details.push({
        ItemName: '',
        Unit: '',
        Quantity: '',
        UnitPrice: '',
        DiscountRate: '',
        Amount: 0,
        RevenueAcc: ''
    });
};

const removeRow = (index) => {
    if (props.details.length > 1) {
        props.details.splice(index, 1);
    } else {
        alert("Hóa đơn phải có ít nhất 1 dòng hàng hóa!");
    }
};
</script>

<style scoped>
.detail-card {
    overflow: hidden;
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
    border-left: 4px solid #2563eb;
    line-height: 1.2;
}

.erp-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

/* Các đường kẻ bảng */
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
}

/* Padding cho các ô thông thường */
.erp-table td {
    padding: 5px 12px;
    font-size: 14px;
    height: 40px;
    /* Tăng chiều cao một chút để chứa ô input cho đẹp */
}

/* Bỏ đè viền, thiết lập lại padding cho ô chứa input để tạo khoảng cách */
.erp-table td.cell-input {
    padding: 6px 8px;
}

/* Kiểu dáng mới cho ô input - Dạng ô vuông có viền */
.table-input {
    width: 100%;
    height: 30px;
    border: 1px solid #cbd5e1;
    /* Viền màu xám nhạt giống trong ảnh */
    border-radius: 4px;
    /* Bo góc nhẹ */
    background: #fff;
    padding: 0 10px;
    outline: none;
    color: #1e293b;
    transition: all 0.2s;
    box-sizing: border-box;
    display: block;
    font-family: inherit;
    font-size: 14px;
}

.table-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
    /* Hiệu ứng sáng viền khi click vào */
}

/* Các tùy chỉnh hiển thị khác */
.amount-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 4px;
}

.currency-unit {
    margin-left: 6px;
    color: #64748b;
    font-size: 13px;
}

.index-col {
    color: #94a3b8;
    font-weight: 600;
}

.text-highlight {
    color: #2563eb;
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

.delete-icon {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 4px;
    transition: 0.2s;
    font-size: 16px;
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
    color: #2563eb;
    border: 1px dashed #93c5fd;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add-row:hover {
    background: #eff6ff;
}

/* Ẩn mũi tên cuộn số */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    appearance: textfield;
    -moz-appearance: textfield;
}


/* css ô input khi quá nhỏ */
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