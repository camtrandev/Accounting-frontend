<template>
    <div class="layout-wrapper" :class="{ 'is-split-mode': showAIAssistant }">

        <div class="ocr-left-panel" v-if="showAIAssistant">
            <OcrInvoiceSplitView :docType="3" @close="showAIAssistant = false" @fill-data="handleAutoFillFromAI" />
        </div>

        <div class="voucher-page right-form-panel">
            <header class="invoice-toolbar">
                <div class="title-block">
                    <h1 class="main-title">PHIẾU CHI TIỀN</h1>
                    <div class="sub-info">
                        Số: <span class="highlight">{{ voucher.DocumentNo }}</span> | Ngày: {{ voucher.DocumentDate }}
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-outline"><i class="fas fa-print"></i> In phiếu chi</button>
                    <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu phiếu (F2)</button>
                    <button class="btn btn-ai-assistant" :class="{ 'active': showAIAssistant }"
                        @click="showAIAssistant = !showAIAssistant">
                        <span class="icon">✨</span>
                        {{ showAIAssistant ? 'Đóng Trợ lý AI' : 'Trợ lý Chứng từ AI' }}
                    </button>
                </div>
            </header>

            <section class="card master-card">
                <VoucherPartnerInfo :model="voucher" :partners="listPartners" />

                <div class="master-extra-row">
                    <div class="field-col flex-2">
                        <label class="label-caps">Lý do chi</label>
                        <input type="text" v-model="voucher.Reason" class="input-flat"
                            placeholder="Ví dụ: Thanh toán tiền điện, trả tiền NCC..." />
                    </div>
                    <div class="field-col flex-1">
                        <label class="label-caps">Kèm theo (Chứng từ gốc)</label>
                        <input type="text" v-model="voucher.ReferenceDocs" class="input-flat"
                            placeholder="Số hóa đơn, hợp đồng..." />
                    </div>
                </div>
            </section>

            <PaymentDetailTable :details="voucher.Details" />

            <div class="footer-layout">
                <div class="note-card">
                    <label>Số tiền bằng chữ:</label>
                    <div class="words-box">
                        <i>{{ readMoney(totalAmount) }} đồng.</i>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-line grand-total">
                        <span class="lbl-total">TỔNG TIỀN CHI:</span>
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
import PaymentDetailTable from '../components/PaymentDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue'; // Import component AI

// Trạng thái mở/đóng AI
const showAIAssistant = ref(false);

const listPartners = ref([
    { Id: 101, Name: 'Công ty CP Máy tính Phong Vũ' },
    { Id: 901, Name: 'Nguyễn Văn B (Nhân viên hành chính)' }
]);

const voucher = ref({
    DocumentNo: 'PC0001', // Thêm DocumentNo vào state để AI có thể map
    PartnerId: null,
    DocumentDate: new Date().toLocaleDateString('en-GB'),
    Reason: '',
    ReferenceDocs: '',
    Details: [
        { Description: '', DebitAcc: '', CreditAcc: '', Amount: 0 }
    ]
});

// Tính tổng tiền chi
const totalAmount = computed(() => {
    return voucher.value.Details.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
});

// Hàm format tiền đính kèm "VNĐ"
const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
};

// Hàm giả lập đọc số tiền bằng chữ
const readMoney = (val) => {
    if (val === 0) return "Không";
    return "Mười lăm triệu năm trăm nghìn";
};

// Xử lý dữ liệu AI trả về
const handleAutoFillFromAI = (scannedData) => {
    // Ánh xạ dữ liệu chung
    if (scannedData.documentNumber) voucher.value.DocumentNo = scannedData.documentNumber;
    if (scannedData.note) voucher.value.Reason = scannedData.note;

    // Xử lý ngày tháng: "2025-09-08T00:00:00" -> "08/09/2025"
    if (scannedData.documentDate) {
        const dateParts = scannedData.documentDate.split('T')[0].split('-');
        if (dateParts.length === 3) {
            voucher.value.DocumentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }
    }

    // Map số tiền vào dòng đầu tiên của phiếu chi
    if (scannedData.totalAmount !== undefined && voucher.value.Details.length > 0) {
        voucher.value.Details[0].Amount = Number(scannedData.totalAmount);
        voucher.value.Details[0].Description = scannedData.note || 'Chi tiền tự động từ AI';

        // Mặc định tài khoản cho phiếu chi (Có 1111 - Tiền mặt)
        voucher.value.Details[0].CreditAcc = '1111';
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
/* ================= GLOBAL & LAYOUT ================= */
.voucher-page {
    padding: 20px 24px;
    background-color: #f1f5f9;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    color: #1e293b;
}

.card {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* ================= 1. HEADER ================= */
.invoice-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.main-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px 0;
}

.sub-info {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
}

/* Màu nhấn Đỏ/Rose cho Phiếu Chi */
.highlight {
    color: #ef4444;
    font-weight: 700;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.btn-primary {
    background: #ef4444;
    color: #fff;
    border: none;
    margin: 0 8px;
}

.btn-primary:hover {
    background: #dc2626;
}

.btn-outline {
    background: #fff;
    border: 1px solid #cbd5e1;
    color: #475569;
}

/* ================= 2. MASTER INFO ================= */
.master-extra-row {
    display: flex;
    border-top: 1px solid #e2e8f0;
    background: #fcfcfc;
}

.field-col {
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e2e8f0;
}

.field-col:last-child {
    border-right: none;
}

.flex-2 {
    flex: 2;
}

.flex-1 {
    flex: 1;
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

.label-caps {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 6px;
}

.input-flat {
    border: none;
    background: transparent;
    font-size: 14px;
    color: #0f172a;
    outline: none;
    width: 100%;
}

.input-flat::placeholder {
    color: #94a3b8;
    font-style: italic;
}

/* ================= 4. FOOTER ================= */
.footer-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;
}

.note-card {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.note-card label {
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 8px;
}

.words-box {
    flex-grow: 1;
    background-color: #fef2f2;
    /* Nền đỏ nhạt đồng bộ theme */
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 12px;
    font-size: 15px;
    color: #b91c1c;
    display: flex;
    align-items: center;
}

/* KHỐI TỔNG TIỀN */
.summary-card {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    display: flex;
    align-items: center;
}

.grand-total {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 16px;
    margin: 0;
}

.lbl-total {
    font-weight: 700;
    color: #1e293b;
    font-size: 16px;
}

.val-total {
    font-weight: 800;
    color: #dc2626;
    font-size: 26px;
}
</style>