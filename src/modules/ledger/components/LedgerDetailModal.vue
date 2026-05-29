<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <header class="modal-header">
                <h3>Chi Tiết Chứng Từ</h3>
                <button class="close-btn" @click="$emit('close')">&times;</button>
            </header>

            <div class="modal-body" v-if="detailData">
                <div class="voucher-info">
                    <div class="info-group">
                        <p><strong>Số chứng từ:</strong> {{ detailData.transactionGroupId || detailData.documentId }}
                        </p>
                        <p><strong>Ngày hạch toán:</strong> {{ formatDate(detailData.postingDate) }}</p>
                    </div>
                    <div class="info-group text-right">
                        <p><strong>Loại chứng từ:</strong> Phiếu kế toán tổng hợp</p>
                        <p><strong>Trạng thái:</strong> <span class="badge">Đã ghi sổ</span></p>
                    </div>
                </div>

                <div class="description-box">
                    <strong>Diễn giải:</strong> {{ detailData.description }}
                </div>

                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>Tài khoản Nợ/Có</th>
                            <th>Đối tượng</th>
                            <th class="text-right">Số tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>{{ detailData.accountId }}</strong>
                                <span v-if="detailData.debitAmount > 0" class="text-debit"> (Nợ)</span>
                                <span v-else-if="detailData.creditAmount > 0" class="text-credit"> (Có)</span>
                            </td>

                            <td>{{ detailData.partnerId ? 'Mã đối tượng: ' + detailData.partnerId : 'N/A' }}</td>

                            <td class="text-right">
                                <strong>
                                    {{ formatMoney(detailData.debitAmount > 0 ? detailData.debitAmount :
                                        detailData.creditAmount) }}
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <footer class="modal-footer">
                <button class="btn-secondary" @click="$emit('close')">Đóng</button>
                <button class="btn-primary" @click="printVoucher">In chứng từ</button>
            </footer>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    detailData: {
        type: Object,
        default: null
    }
});

defineEmits(['close']);

// Hàm format ngày tháng từ ISO sang dd/MM/yyyy
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('vi-VN').format(date);
};

// Hàm format tiền tệ
const formatMoney = (val) => {
    if (!val) return '0 đ';
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
};

// Hàm xử lý in ấn (tạm thời gọi hàm in mặc định của trình duyệt)
const printVoucher = () => {
    window.print();
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.close-btn {
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    border-radius: 50%;
    /* Tạo vùng hover hình tròn */
    font-size: 24px;
    color: #8f9096;
    /* Màu xám nhạt tinh tế */
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    padding: 0;
    line-height: 1;
}

.close-btn:hover {
    background-color: #f2f3f8;
    /* Hiện nền xám nhạt khi di chuột vào */
    color: #ff4d4f;
    /* Chuyển sang màu đỏ cảnh báo tinh tế */
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 700px;
    border-radius: 12px;
    padding: 24px;
    animation: slideDown 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
}

.voucher-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 20px 0;
    gap: 20px;
}

.description-box {
    background: #f8f9fa;
    padding: 12px;
    border-left: 4px solid #007bff;
    margin-bottom: 20px;
}

.detail-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.detail-table th {
    background: #f1f3f5;
    padding: 10px;
    text-align: left;
}

.detail-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.badge {
    background: #e6fffa;
    color: #38a169;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
}

.modal-footer {
    margin-top: 30px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>