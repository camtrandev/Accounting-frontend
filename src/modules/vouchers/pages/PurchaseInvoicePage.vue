<template>
    <div class="layout-wrapper" :class="{ 'is-split-mode': showAIAssistant }">

        <div class="ocr-left-panel" v-if="showAIAssistant">
            <OcrInvoiceSplitView :docType="0" @close="showAIAssistant = false" @fill-data="handleAutoFillFromAI" />
        </div>

        <div class="voucher-page right-form-panel">
            <header class="invoice-toolbar">
                <div class="title-block">
                    <h1 class="main-title">HÓA ĐƠN MUA HÀNG</h1>
                    <div class="sub-info">
                        Số: <span class="highlight">{{ voucher.DocumentNo }}</span> | Ngày: {{ voucher.DocumentDate }}
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-outline btn-print-custom">
                        <i class="fas fa-print"></i> In hóa đơn
                    </button> <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu dữ liệu (F2)</button>
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
                    <div class="field-group flex-3">
                        <label class="label-premium">Địa chỉ nhà cung cấp</label>
                        <div class="input-wrapper">
                            <i class="fas fa-map-marker-alt icon-inside"></i>
                            <input type="text" v-model="voucher.Address" class="input-premium"
                                placeholder="Địa chỉ đầy đủ..." />
                        </div>
                    </div>
                    <div class="field-group flex-1">
                        <label class="label-premium">Mã số thuế</label>
                        <div class="input-wrapper">
                            <i class="fas fa-barcode icon-inside"></i>
                            <input type="text" v-model="voucher.TaxCode" class="input-premium" placeholder="MST..." />
                        </div>
                    </div>
                </div>
            </section>

            <PurchaseDetailTable :details="voucher.Details" @update-totals="handleUpdateTotals" />

            <div class="footer-layout">
                <div class="card-container note-card compact-card">
                    <label class="label-premium">Ghi chú / Diễn giải</label>
                    <div class="input-wrapper textarea-wrapper">
                        <textarea v-model="voucher.Description" class="input-premium compact-textarea"
                            placeholder="Nhập nội dung diễn giải nghiệp vụ..."></textarea>
                    </div>
                </div>

                <div class="card-container summary-card compact-card">
                    <div class="summary-line">
                        <span class="lbl">Tổng tiền hàng:</span>
                        <span class="val">{{ formatVND(subTotal) }} VNĐ</span>
                    </div>

                    <div class="summary-line">
                        <div class="tax-config">
                            <span class="lbl">Thuế GTGT (</span>
                            <input type="number" v-model="voucher.TaxRate" class="tax-rate-input"
                                @input="handleUpdateTotals" />
                            <span class="lbl">%):</span>
                        </div>
                        <div class="input-wrapper tax-amount-wrapper">
                            <input type="number" v-model="voucher.TaxAmount" class="input-premium text-right" />
                        </div>
                    </div>

                    <div class="summary-line grand-total">
                        <span class="lbl-total">TỔNG THANH TOÁN</span>
                        <span class="val-total">{{ formatVND(subTotal + (Number(voucher.TaxAmount) || 0)) }} VNĐ</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import VoucherPartnerInfo from '../components/VoucherPartnerInfo.vue';
import PurchaseDetailTable from '../components/PurchaseDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue';

const showAIAssistant = ref(false);

const listPartners = ref([
    { Id: 101, Name: 'Công ty TNHH Dược Phẩm Tìm' },
    { Id: 102, Name: 'Công ty CP Máy tính Phong Vũ' }
]);

const voucher = ref({
    DocumentNo: 'HDMH0001',
    PartnerId: null,
    BuyerName: '',
    DocumentDate: new Date().toISOString().substr(0, 10),
    Address: '',
    TaxCode: '',
    Description: '',
    TaxRate: 10,
    TaxAmount: 0,
    Details: [{ ItemName: '', Unit: '', Quantity: 0, UnitPrice: 0, DiscountRate: 0, Amount: 0, DebitAcc: '1561', CreditAcc: '331' }]
});

const subTotal = computed(() => voucher.value.Details.reduce((sum, i) => sum + (Number(i.Amount) || 0), 0));
const formatVND = (val) => new Intl.NumberFormat('vi-VN').format(val || 0);

const handleUpdateTotals = () => {
    voucher.value.TaxAmount = Math.round(subTotal.value * (Number(voucher.value.TaxRate || 0) / 100));
};
watch(subTotal, handleUpdateTotals);

// Hàm demo: Nhận dữ liệu từ component OCR bắn sang và tự động điền vào Form
// Hàm nhận dữ liệu từ component OCR bắn sang và tự động điền vào Form
// Hàm nhận dữ liệu từ component OCR bắn sang và tự động điền vào Form
const handleAutoFillFromAI = (scannedData) => {
    // 1. Map dữ liệu chung (Master) - Cập nhật đúng key từ API (chữ thường)
    if (scannedData.taxCode) voucher.value.TaxCode = scannedData.taxCode;
    if (scannedData.address) voucher.value.Address = scannedData.address;
    if (scannedData.documentNumber) voucher.value.DocumentNo = scannedData.documentNumber;
    if (scannedData.note) voucher.value.Description = scannedData.note;

    // Cắt lấy phần ngày (VD: "2025-09-08T00:00:00" -> "2025-09-08")
    if (scannedData.documentDate) voucher.value.DocumentDate = scannedData.documentDate.split('T')[0];

    // Map phần thuế
    if (scannedData.vatRate !== undefined) voucher.value.TaxRate = scannedData.vatRate;
    if (scannedData.vatAmount !== undefined) voucher.value.TaxAmount = scannedData.vatAmount;

    // 2. Map dữ liệu bảng chi tiết hàng hóa (Đổi 'Details' thành 'items')
    if (scannedData.items && scannedData.items.length > 0) {

        voucher.value.Details = scannedData.items.map(item => {
            // Lấy dữ liệu từ key của API (chữ thường)
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unitPrice) || 0;
            const discount = Number(item.discountRate) || 0;

            return {
                ItemName: item.itemName || '',      // API: itemName -> Vue: ItemName
                Unit: item.unit || '',              // API: unit -> Vue: Unit
                Quantity: qty,
                UnitPrice: price,
                DiscountRate: discount,
                Amount: item.amount ? Number(item.amount) : Math.round(qty * price * (1 - discount / 100)),
                DebitAcc: item.debitAccount || '1561',
                CreditAcc: item.creditAccount || '331'
            };
        });
    }

    // 3. Gọi lại hàm tính tổng tiền
    handleUpdateTotals();
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

/* Master Row */
.master-extra-row {
    display: flex;
    gap: 16px;
}

/* Premium Input Style */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.flex-1 {
    flex: 1;
}

.flex-3 {
    flex: 3;
}

.label-premium {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.button-group {
    display: flex;
    gap: 10px;
}

/* --- TRẠNG THÁI MẶC ĐỊNH --- */
.btn-print-custom {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    /* Khoảng cách giữa icon fa-print và chữ */

    /* Ghi đè lại màu mặc định của btn-outline nếu cần */
    color: #4b5563;
    background-color: #ffffff;
    border: 2px solid #e5e7eb;

    /* Hiệu ứng chuyển động mượt mà cho tất cả (màu, viền, vị trí, bóng đổ) */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}


.btn-print-custom:hover {
    color: #10b981;
    border-color: #10b981;
    background-color: #ecfdf5;

    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(16, 185, 129, 0.2);
}


.btn-print-custom:active {
    transform: translateY(2px);
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);

    transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn-ai-assistant {
    color: white;
    padding: 10px 20px;
    border-radius: 8px; /* Bo góc ngoài cùng */
    font-weight: 700;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
    z-index: 1; /* Để text và icon nằm lên trên pseudo-elements */
    
    /* Thiết lập quan trọng cho hiệu ứng viền sáng */
    position: relative;
    overflow: hidden; /* Cắt đi phần ánh sáng thừa bên ngoài */
    background: transparent; /* Nền nút chính chuyển sang trong suốt để lộ lớp ::after */
}

.btn-ai-assistant:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(168, 85, 247, 0.35);
}

/* Lớp nền chính của nút (che phần ruột, tạo ra viền) */
.btn-ai-assistant::after {
    content: '';
    position: absolute;
    inset: 2px; /* Khoảng cách hở viền là 2px. Bạn có thể tăng/giảm số này để viền dày/mỏng hơn */
    background: linear-gradient(90deg, #7e5eff 0%, #c565ff 100%); /* Màu chính của nút */
    border-radius: 6px; /* Bo góc nhỏ hơn lớp ngoài (8px - 2px) */
    z-index: -1; /* Nằm giữa text/icon và ánh sáng chạy */
    transition: all 0.3s ease;
}

/* Hiệu ứng tia sáng chạy quanh viền */
.btn-ai-assistant::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%; /* Đảm bảo đủ rộng để khi xoay không bị hụt góc */
    height: 300%;
    /* Dải màu sáng: Trong suốt -> Trắng sáng -> Trong suốt */
    background: conic-gradient(
        from 0deg, 
        transparent 0%, 
        transparent 40%, 
        rgba(255, 255, 255, 0.9) 50%, 
        transparent 60%, 
        transparent 100%
    );
    transform: translate(-50%, -50%);
    animation: spin-border 2.5s linear infinite; /* Tốc độ chạy của ánh sáng. LUÔN CHẠY */
    z-index: -2; /* Đẩy ra sau cùng */
}
/* Keyframes cho ánh sáng xoay */
@keyframes spin-border {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.btn-ai-assistant:hover::after {
    filter: brightness(1.15);
    /* Làm nền bên trong sáng lên chút */
}

/* Hiệu ứng lấp lánh (Sparkle) cho Icon */
.btn-ai-assistant .icon {
    display: inline-block;
    animation: sparkle 1.5s ease-in-out infinite alternate;
}

/* Keyframes cho Icon Lấp lánh */
@keyframes sparkle {
    0% {
        transform: scale(0.9) rotate(0deg);
        opacity: 0.8;
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
    }

    100% {
        transform: scale(1.2) rotate(15deg);
        opacity: 1;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1));
    }
}

/* Trạng thái Active (Khi click mở/đóng) */
.btn-ai-assistant.active {
    box-shadow: 0 4px 15px rgba(126, 94, 255, 0.4); /* Đổi bóng đổ sang màu tím mờ */
}
/* Đổi màu nền bên trong khi active */
.btn-ai-assistant.active::after {
    background: linear-gradient(90deg, #7e5eff 0%, #c565ff 100%); 
}

/* Tuỳ chọn: Đổi màu ánh sáng chạy khi active (nhấn nhá thêm tông vàng cam) */
.btn-ai-assistant.active::before {
    background: conic-gradient(
        from 0deg, 
        transparent 0%, 
        transparent 40%, 
        rgba(255, 255, 255, 0.9) 50%, 
        rgba(197, 101, 255, 0.6) 60%, 
        transparent 100%
    );
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
    border-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
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
    margin-left: 10px;
    color: #94a3b8;
    font-size: 13px;
}

/* Footer Layout Bó gọn */
.footer-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 16px;
}

.compact-card {
    padding: 16px;
    gap: 8px;
}

/* Note Card */
.textarea-wrapper {
    align-items: flex-start;
}

.compact-textarea {
    min-height: 60px;
    height: 60px;
    resize: none;
    line-height: 1.4;
    padding: 8px 12px;
}

/* Summary Card */
.summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.summary-line .lbl {
    color: #64748b;
    font-weight: 500;
    font-size: 13px;
}

.summary-line .val {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;
}

.tax-config {
    display: flex;
    align-items: center;
    gap: 4px;
}

.tax-rate-input {
    width: 40px;
    border: 1.2px solid #e2e8f0;
    border-radius: 4px;
    text-align: center;
    font-weight: 700;
    color: #4f46e5;
    outline: none;
    padding: 2px;
    font-size: 13px;
}

.tax-amount-wrapper {
    width: 140px;
}

.tax-amount-wrapper .input-premium {
    padding: 6px 10px;
    font-size: 13px;
}

.grand-total {
    border-top: 1.5px solid #f1f5f9;
    padding-top: 12px;
    margin-top: 4px;
}

.lbl-total {
    font-weight: 800;
    color: #1e293b;
    font-size: 14px;
}

.val-total {
    font-size: 22px;
    font-weight: 900;
    color: #4f46e5;
}

/* Toolbar */
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
    color: #4f46e5;
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
    background: #4f46e5;
    color: #fff;
}

.btn-outline {
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #64748b;
}

.text-right {
    text-align: right;
}
</style>