<template>
    <div class="layout-wrapper" :class="{ 'is-split-mode': showAIAssistant }">

        <div class="ocr-left-panel" v-if="showAIAssistant">
            <OcrInvoiceSplitView :docType="2" @close="showAIAssistant = false" @fill-data="handleAutoFillFromAI" />
        </div>

        <div class="voucher-page right-form-panel">
            <header class="invoice-toolbar">
                <div class="title-block">
                    <h1 class="main-title">PHIẾU THU TIỀN</h1>
                    <div class="sub-info">
                        Số: <span class="highlight">{{ voucher.DocumentNo }}</span> | Ngày: {{ voucher.DocumentDate }}
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-outline"><i class="fas fa-print"></i> In phiếu thu</button>
                    <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu phiếu (F2)</button>
                    <button class="btn btn-ai-assistant" :class="{ 'active': showAIAssistant }"
                        @click="showAIAssistant = !showAIAssistant">
                        <span class="icon">✨</span>
                        {{ showAIAssistant ? 'Đóng Trợ lý AI' : 'Trợ lý Chứng từ AI' }}
                    </button>
                </div>
            </header>

            <section class="card-container">
                <VoucherPartnerInfo :model="voucher" :partners="listPartners" />

                <div class="master-extra-row">
                    <div class="field-group flex-2">
                        <label class="label-premium">Lý do thu</label>
                        <div class="input-wrapper">
                            <i class="fas fa-comment-dots icon-inside"></i>
                            <input type="text" v-model="voucher.Reason" class="input-premium"
                                placeholder="Ví dụ: Thu tiền nợ khách hàng..." />
                        </div>
                    </div>
                    <div class="field-group flex-1">
                        <label class="label-premium">Kèm theo (Chứng từ gốc)</label>
                        <div class="input-wrapper">
                            <i class="fas fa-paperclip icon-inside"></i>
                            <input type="text" v-model="voucher.ReferenceDocs" class="input-premium"
                                placeholder="Số hóa đơn, hợp đồng..." />
                        </div>
                    </div>
                </div>
            </section>

            <ReceiptDetailTable :details="voucher.Details" />

            <div class="footer-layout">
                <div class="card-container note-card compact-card">
                    <label class="label-premium">Số tiền bằng chữ</label>
                    <div class="words-box">
                        <i class="fas fa-quote-left quote-icon"></i>
                        <span class="money-text">{{ readMoney(totalAmount) }} đồng.</span>
                    </div>
                </div>

                <div class="card-container summary-card compact-card">
                    <div class="summary-line grand-total">
                        <span class="lbl-total">TỔNG TIỀN THU</span>
                        <span class="val-total">{{ formatVND(totalAmount) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VoucherPartnerInfo from '../components/VoucherPartnerInfo.vue';
import ReceiptDetailTable from '../components/ReceiptDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue'; // Import component AI

// Quản lý trạng thái mở/đóng AI
const showAIAssistant = ref(false);

const listPartners = ref([{ Id: 301, Name: 'Nguyễn Văn A (Khách hàng lẻ)' }]);

const voucher = ref({
    DocumentNo: 'PT0001',
    PartnerId: null,
    BuyerName: '',
    DocumentDate: new Date().toISOString().substr(0, 10),
    Reason: '',
    ReferenceDocs: '',
    Details: [
        { Description: '', DebitAcc: '', CreditAcc: '', Amount: 0 }
    ]
});

const totalAmount = computed(() => {
    return voucher.value.Details.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
});

const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
};

const readMoney = (val) => {
    if (val === 0) return "Không";
    // Ở đây bạn có thể gọi hàm convert số sang chữ thật
    return "Năm triệu";
};

// Hàm nhận dữ liệu từ AI bắn sang để điền tự động
const handleAutoFillFromAI = (scannedData) => {
    // Ánh xạ dữ liệu chung
    if (scannedData.documentNumber) voucher.value.DocumentNo = scannedData.documentNumber;
    if (scannedData.note) voucher.value.Reason = scannedData.note;

    // Xử lý ngày tháng (nếu có)
    if (scannedData.documentDate) {
        voucher.value.DocumentDate = scannedData.documentDate.split('T')[0];
    }

    // Map số tiền vào dòng đầu tiên của phiếu thu
    if (scannedData.totalAmount !== undefined && voucher.value.Details.length > 0) {
        voucher.value.Details[0].Amount = Number(scannedData.totalAmount);
        voucher.value.Details[0].Description = scannedData.note || 'Thu tiền tự động từ AI';

        // Mặc định tài khoản cho phiếu thu (Nợ 1111 - Tiền mặt)
        voucher.value.Details[0].DebitAcc = '1111';
    }
};
</script>

<style scoped>
/* Khung bọc ngoài cùng */
.layout-wrapper {
    display: flex;
    width: 100%;
    gap: 20px;
    transition: all 0.3s ease;
}

/* Nửa trái (AI OCR) */
.ocr-left-panel {
    flex: 0 0 45%;
    /* Chiếm 45% chiều rộng khi mở */
    max-width: 36%;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
}

/* Nửa phải (Form) - Mặc định chiếm 100% */
.right-form-panel {
    flex: 1;
    min-width: 0;
    /* Tránh vỡ layout khi flexbox bị ép nhỏ */
    transition: all 0.3s ease;
}

/* Điều chỉnh style form khi bị ép vào chế độ chia đôi (nếu cần) */
.is-split-mode .master-extra-row {
    flex-direction: column;
    /* Rớt dòng nếu màn hình bên phải chật */
}

.btn-ai-assistant.active {
    background-color: #ff9800;
    color: white;
}
</style>


<style scoped>
/* Layout & Global */
.voucher-page {
    padding: 16px 24px;
    background: #f1f5f9;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: 'Inter', sans-serif;
}

/* Card Container */
.card-container {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.master-extra-row {
    display: flex;
    gap: 16px;
}

/* Premium Input Style (Màu Xanh Ngọc cho Phiếu Thu) */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.flex-1 {
    flex: 1;
}

.flex-2 {
    flex: 2;
}

.btn-ai-assistant {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-ai-assistant:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(168, 85, 247, 0.35);
    filter: brightness(1.1);
}

.button-group {
    display: flex;
    gap: 10px;
}

.label-premium {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.25s;
}

.input-wrapper:focus-within {
    border-color: #10b981;
    /* Đổi sang màu xanh cho Phiếu Thu */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.input-premium {
    width: 100%;
    border: none;
    outline: none;
    padding: 10px 12px;
    font-size: 14px;
    color: #1e293b;
    background: transparent;
}

.icon-inside {
    margin-left: 12px;
    color: #94a3b8;
    font-size: 13px;
}

/* Footer Bó gọn */
.footer-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 16px;
}

.compact-card {
    padding: 16px;
    justify-content: center;
}

/* Words Box */
.words-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0fdf4;
    border: 1px dashed #bbf7d0;
    padding: 10px 14px;
    border-radius: 8px;
    color: #15803d;
}

.money-text {
    font-size: 14px;
    font-weight: 500;
    font-style: italic;
}

.grand-total {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 16px;
}

.lbl-total {
    font-weight: 800;
    color: #1e293b;
    font-size: 14px;
}

.val-total {
    font-size: 24px;
    font-weight: 900;
    color: #10b981;
}

/* Header Toolbar */
.invoice-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 12px 20px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
}

.main-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
}

.highlight {
    color: #10b981;
    font-weight: 700;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 13px;
}

.btn-primary {
    background: #10b981;
    color: #fff;
}

.btn-outline {
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #64748b;
}
</style>