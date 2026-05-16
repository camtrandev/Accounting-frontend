<template>
    <div class="summary-grid">
        <div class="card opening-balance">
            <p><i class="fas fa-piggy-bank"></i> Số Dư Đầu Kỳ</p>
            <h3>{{ formatMoney(summaryData.openingBalance ?? 0) }}</h3>
        </div>
        <div class="card balance">
            <p><i class="fas fa-wallet"></i> Số Dư Cuối Kỳ</p>
            <h3>{{ formatMoney(summaryData.balance ?? 0) }}</h3>
        </div>
        <div class="card debit">
            <p><i class="fas fa-arrow-down"></i> Tổng Phát Sinh Nợ</p>
            <h3>{{ formatMoney(summaryData.totalDebit ?? 0) }}</h3>
        </div>

        <div class="card credit">
            <p><i class="fas fa-arrow-up"></i> Tổng Phát Sinh Có</p>
            <h3>{{ formatMoney(summaryData.totalCredit ?? 0) }}</h3>
        </div>
    </div>
</template>

<script setup>
// Nhận dữ liệu từ component cha
defineProps({
    summaryData: {
        type: Object,
        default: () => ({
            openingBalance: 0,
            totalDebit: 0,
            totalCredit: 0,
            balance: 0
        })
    }
});

// Hàm định dạng tiền tệ Việt Nam VNĐ
const formatMoney = (val) => {
    if (val === undefined || val === null) return '0 đ';
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
};
</script>

<style scoped>
.summary-grid {
    display: grid;
    /* Tự động co giãn mượt mà khi đổi từ 3 sang 4 thẻ */
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin: 20px 0;
}

.card {
    padding: 20px;
    border-radius: 12px;
    color: white;
    background: #ccc;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

/* Hiệu ứng hover nổi lên */
.card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Hiệu ứng khi click (nhấn xuống) */
.card:active {
    transform: translateY(-2px) scale(0.98);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* --- Gradient từng loại thẻ --- */

/* Thẻ Số dư đầu kỳ: Màu cam vàng ấm áp */
.opening-balance {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

.debit {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.credit {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.balance {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* Text styling */
.card p {
    margin: 0;
    font-size: 14px;
    opacity: 0.95;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}

.card h3 {
    margin-top: 10px;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 0.5px;
}

/* Hiệu ứng ánh sáng nhẹ quét qua khi hover */
.card::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: all 0.5s;
}

.card:hover::before {
    left: 100%;
}

/* Css icon */
.card p i {
    font-size: 16px;
}

/* Màu icon tương phản nhẹ giúp nhận diện nhanh */
.opening-balance i {
    color: #e65100;
}

.debit i {
    color: #0d47a1;
}

.credit i {
    color: #b71c1c;
}

.balance i {
    color: #1b5e20;
}
</style>