<template>
    <div class="summary-grid">
        <div class="card debit">
            <p><i class="fas fa-arrow-down"></i> Tổng Phát Sinh Nợ</p>
            <h3>{{ formatMoney(summaryData.totalDebit) }}</h3>
        </div>
        <div class="card credit">
            <p><i class="fas fa-arrow-up"></i> Tổng Phát Sinh Có</p>
            <h3>{{ formatMoney(summaryData.totalCredit) }}</h3>
        </div>
        <div class="card balance">
            <p><i class="fas fa-wallet"></i> Số Dư Cuối Kỳ</p>
            <h3>{{ formatMoney(summaryData.balance) }}</h3>
        </div>
    </div>
</template>
<script setup>
// Nhận dữ liệu từ cha
defineProps({
    summaryData: Object
});

const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ';
</script>

<style scoped>
.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Hiệu ứng khi click (nhấn xuống) */
.card:active {
    transform: translateY(-2px) scale(0.98);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Gradient từng loại */
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
}

.card h3 {
    margin-top: 8px;
    font-size: 22px;
    font-weight: bold;
}

/* Hiệu ứng ánh sáng nhẹ khi hover */
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

/* Màu icon riêng từng loại (nhìn xịn hơn) */
.debit i {
    color: #002fff;
}

.credit i {
    color: #ff0055;
}

.balance i {
    color: #f8f8f8;
}
</style>