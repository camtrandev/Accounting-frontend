<template>
    <div class="layout-wrapper" :class="{ 'is-split-mode': showAIAssistant }">

        <div class="ocr-left-panel" v-if="showAIAssistant">
            <OcrInvoiceSplitView :docType="1" @close="showAIAssistant = false" @fill-data="handleAutoFillFromAI" />
        </div>

        <div class="voucher-page right-form-panel">
            <header class="invoice-toolbar">
                <div class="title-block">
                    <h1 class="main-title">HÓA ĐƠN BÁN HÀNG</h1>
                    <div class="sub-info">
                        Số: <span class="highlight">{{ voucher.DocumentNo }}</span> | Ngày: {{ voucher.DocumentDate }}
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-outline"><i class="fas fa-print"></i> In hóa đơn</button>
                    <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu dữ liệu (F2)</button>
                    <button class="btn btn-ai-assistant" :class="{ 'active': showAIAssistant }"
                        @click="showAIAssistant = !showAIAssistant">
                        <span class="icon">✨</span>
                        {{ showAIAssistant ? 'Đóng Trợ lý AI' : 'Trợ lý Chứng từ AI' }}
                    </button>
                </div>
            </header>

            <section class="card-container">
                <VoucherPartnerInfo :model="voucher" :partners="listCustomers" />

                <div class="master-extra-row">
                    <div class="field-group flex-3">
                        <label class="label-premium">Địa chỉ xuất hóa đơn</label>
                        <div class="input-wrapper">
                            <i class="fas fa-map-marker-alt icon-inside"></i>
                            <input type="text" v-model="voucher.Address" class="input-premium"
                                placeholder="Nhập địa chỉ đầy đủ của khách hàng..." />
                        </div>
                    </div>
                    <div class="field-group flex-1">
                        <label class="label-premium">Mã số thuế</label>
                        <div class="input-wrapper">
                            <i class="fas fa-barcode icon-inside"></i>
                            <input type="text" v-model="voucher.TaxCode" class="input-premium"
                                placeholder="Nhập MST..." />
                        </div>
                    </div>
                </div>
            </section>

            <SaleDetailTable :details="voucher.Details" @update-totals="handleUpdateTotals" />

            <div class="footer-layout">
                <div class="card-container note-card compact-card">
                    <label class="label-premium">Ghi chú / Diễn giải</label>
                    <div class="input-wrapper textarea-wrapper">
                        <textarea v-model="voucher.Description" class="input-premium compact-textarea"
                            placeholder="Nhập nội dung diễn giải nghiệp vụ bán hàng..."></textarea>
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
                            <input type="number" v-model.number="voucher.TaxRate" class="tax-rate-input"
                                @input="handleUpdateTotals" placeholder="0" />
                            <span class="lbl">%):</span>
                        </div>
                        <div class="input-wrapper tax-amount-wrapper">
                            <input type="number" v-model.number="voucher.TaxAmount" class="input-premium text-right"
                                placeholder="0" />
                        </div>
                    </div>

                    <div class="summary-line grand-total">
                        <span class="lbl-total">TỔNG THANH TOÁN:</span>
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
import SaleDetailTable from '../components/SaleDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue'; // Thêm import AI

// Quản lý trạng thái mở/đóng AI
const showAIAssistant = ref(false);

const listCustomers = ref([
    { Id: 201, Name: 'Công ty TNHH Giải pháp Phần mềm ABC' },
    { Id: 202, Name: 'Trường Đại học Y Hà Nội' }
]);

const voucher = ref({
    DocumentNo: 'HDBH0001',
    PartnerId: null,
    BuyerName: '',
    DocumentDate: new Date().toLocaleDateString('en-GB'),
    Address: '',
    TaxCode: '',
    Description: '',
    Details: [
        { ItemName: '', Unit: '', Quantity: '', UnitPrice: '', DiscountRate: '', Amount: 0, RevenueAcc: '' }
    ],
    TaxRate: 10,
    TaxAmount: 0
});

// Tính tổng tiền hàng
const subTotal = computed(() => {
    return voucher.value.Details.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
});

// Hàm format tiền tệ
const formatVND = (val) => {
    if (!val) return "0";
    return new Intl.NumberFormat('vi-VN').format(Math.round(val));
};

// Cập nhật lại số tiền thuế khi có thay đổi
const handleUpdateTotals = () => {
    voucher.value.TaxAmount = Math.round(subTotal.value * (Number(voucher.value.TaxRate || 0) / 100));
};

// Lắng nghe sự thay đổi của subTotal
watch(subTotal, handleUpdateTotals);

// Hàm nhận dữ liệu từ AI bắn sang
// Hàm nhận dữ liệu từ AI bắn sang
const handleAutoFillFromAI = (scannedData) => {
    // 1. Map dữ liệu chung (Master)
    if (scannedData.taxCode) voucher.value.TaxCode = scannedData.taxCode;
    if (scannedData.address) voucher.value.Address = scannedData.address;
    if (scannedData.documentNumber) voucher.value.DocumentNo = scannedData.documentNumber;
    if (scannedData.note) voucher.value.Description = scannedData.note;

    // Xử lý ngày tháng: Cắt "2025-09-08T00:00:00" chuyển thành "08/09/2025"
    if (scannedData.documentDate) {
        const dateParts = scannedData.documentDate.split('T')[0].split('-');
        if (dateParts.length === 3) {
            voucher.value.DocumentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }
    }

    // Map phần thuế
    if (scannedData.vatRate !== undefined) voucher.value.TaxRate = scannedData.vatRate;
    if (scannedData.vatAmount !== undefined) voucher.value.TaxAmount = scannedData.vatAmount;

    // 2. Map dữ liệu bảng chi tiết hàng hóa
    if (scannedData.items && scannedData.items.length > 0) {
        voucher.value.Details = scannedData.items.map(item => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unitPrice) || 0;
            const discount = Number(item.discountRate) || 0;

            return {
                ItemName: item.itemName || '',
                Unit: item.unit || '',
                Quantity: qty,
                UnitPrice: price,
                DiscountRate: discount,
                Amount: item.amount ? Number(item.amount) : Math.round(qty * price * (1 - discount / 100)),
                // Tài khoản doanh thu mặc định cho hóa đơn bán hàng thường là 5111
                RevenueAcc: item.creditAccount || '5111'
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

/* Card Container chung */
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

/* Premium Input Style - Màu Xanh Dương cho Bán Hàng */
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

.button-group {
    display: flex;
    gap: 10px;
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
    border-color: #2563eb;
    /* Blue focus */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
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
    color: #2563eb;
    outline: none;
    padding: 2px;
    font-size: 13px;
    transition: 0.2s;
}

.tax-rate-input:focus {
    border-color: #2563eb;
    background: #eff6ff;
}

.tax-amount-wrapper {
    width: 140px;
}

.tax-amount-wrapper .input-premium {
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 600;
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
    color: #2563eb;
}

/* Xanh dương nổi bật */

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
    color: #2563eb;
    font-weight: 700;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 13px;
    transition: 0.2s;
}

.btn-primary {
    background: #2563eb;
    color: #fff;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-outline {
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #64748b;
}

.btn-outline:hover {
    background: #f8fafc;
}

.text-right {
    text-align: right;
}

/* Ẩn mũi tên input number */
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