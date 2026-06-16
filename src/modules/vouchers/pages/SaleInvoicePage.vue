<template>
    <div class="layout-wrapper" :class="{ 'is-split-mode': showAIAssistant }">

        <!-- Panel Trợ lý AI (docType 1 cho Bán hàng) -->
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
                    <button class="btn btn-outline btn-print-custom">
                        <i class="fas fa-print"></i> In hóa đơn
                    </button>
                    <button class="btn btn-primary" @click="handleSave">
                        <i class="fas fa-save"></i> Lưu dữ liệu (F2)
                    </button>
                    <button class="btn btn-ai-assistant" :class="{ 'active': showAIAssistant }"
                        @click="showAIAssistant = !showAIAssistant">
                        <span class="icon">✨</span>
                        {{ showAIAssistant ? 'Đóng Trợ lý AI' : 'Trợ lý Chứng từ AI' }}
                    </button>
                </div>
            </header>

            <section class="card-container">
                <!-- VoucherPartnerInfo dùng cho Khách hàng và Kho xuất hàng -->
                <VoucherPartnerInfo label="Khách hàng" :model="voucher" :partners="listCustomers"
                    :warehouses="listWarehouses" />

                <div class="master-extra-row">
                    <div class="field-group flex-3">
                        <label class="label-premium">Địa chỉ xuất hóa đơn</label>
                        <div class="input-wrapper">
                            <i class="fas fa-map-marker-alt icon-inside"></i>
                            <input type="text" v-model="voucher.Address" class="input-premium"
                                placeholder="Địa chỉ đầy đủ của khách hàng..." />
                        </div>
                    </div>
                    <div class="field-group flex-1">
                        <label class="label-premium">Mã số thuế</label>
                        <div class="input-wrapper">
                            <i class="fas fa-barcode icon-inside"></i>
                            <input type="text" v-model="voucher.TaxCode" class="input-premium"
                                placeholder="MST khách hàng..." />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Lưới chi tiết hàng hóa bán ra -->
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
                            <!-- Tự động đổi chữ thành 'Tổng thuế' nếu hóa đơn có nhiều mức thuế khác nhau -->
                            <span class="lbl">
                                {{ voucher.TaxRate === null ? 'Tổng thuế:' : 'Thuế GTGT:' }}
                            </span>
                        </div>
                        <div class="input-wrapper tax-amount-wrapper">
                            <!-- Giữ lại ô nhập số tiền thuế để hiển thị tổng tiền thuế từ AI hoặc tính toán -->
                            <input type="number" v-model="voucher.TaxAmount" class="input-premium text-right"
                                @input="handleUpdateTotals" />
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
import { ref, computed, watch, onMounted } from 'vue';
import { useVouchersStore } from '../store/vouchers.store';
import VoucherPartnerInfo from '../components/VoucherPartnerInfo.vue';
import SaleDetailTable from '../components/SaleDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue';

const vStore = useVouchersStore();
const showAIAssistant = ref(false);

// Lấy dữ liệu từ Store
const listCustomers = computed(() => vStore.partners);
const listWarehouses = computed(() => vStore.warehouses);

const voucher = ref({
    DocumentNo: '',
    PartnerId: null,
    WarehouseId: null, // Kho xuất hàng
    BuyerName: '',
    DocumentDate: new Date().toISOString().substr(0, 10),
    Address: '',
    TaxCode: '',
    Description: '',
    TaxRate: 10,
    TaxAmount: 0,
    Details: [{ ItemName: '', Unit: '', Quantity: 0, UnitPrice: 0, DiscountRate: 0, Amount: 0, DebitAcc: '131', CreditAcc: '5111' }]
});

onMounted(async () => {
    await vStore.fetchMetaData();

    // Tự động gán kho mặc định để tránh lỗi ID 1
    if (vStore.warehouses.length > 0 && !voucher.value.WarehouseId) {
        voucher.value.WarehouseId = vStore.warehouses[0].id;
    }

    if (!voucher.value.DocumentNo) {
        voucher.value.DocumentNo = generateFrontendVoucherNo('HDBH');
    }
});

const subTotal = computed(() => voucher.value.Details.reduce((sum, i) => sum + (Number(i.Amount) || 0), 0));
const formatVND = (val) => new Intl.NumberFormat('vi-VN').format(val || 0);

const handleUpdateTotals = () => {
    // 1. Tính tổng tiền hàng
    const subTotal = voucher.value.Details.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
    voucher.value.SubTotal = subTotal;

    // 2. Tính tiền thuế
    if (voucher.value.TaxRate !== null && voucher.value.TaxRate !== undefined) {
        // Nếu có 1 mức thuế cố định -> Tự động tính theo %
        voucher.value.TaxAmount = Math.round(subTotal * (voucher.value.TaxRate / 100));
    } else {
        // Nếu đa thuế suất -> Giữ nguyên số TaxAmount do AI đổ vào
        voucher.value.TaxAmount = voucher.value.TaxAmount || 0;
    }

    // 3. Tổng thanh toán
    voucher.value.TotalAmount = subTotal + (Number(voucher.value.TaxAmount) || 0);
};

watch(subTotal, handleUpdateTotals);

// Watcher tự động điền địa chỉ và MST khi chọn khách hàng
watch(() => voucher.value.PartnerId, (newId) => {
    if (newId) {
        const selected = vStore.partners.find(p => p.id === newId);
        if (selected) {
            voucher.value.Address = selected.address || '';
            voucher.value.TaxCode = selected.taxCode || '';
        }
    }
});

const resetForm = () => {
    voucher.value = {
        DocumentNo: generateFrontendVoucherNo('HDBH'), // Tự sinh mã mới
        PartnerId: null,
        WarehouseId: vStore.warehouses.length > 0 ? vStore.warehouses[0].id : null,
        BuyerName: '', // Xóa tên người mua
        DocumentDate: new Date().toISOString().substr(0, 10),
        Address: '',
        TaxCode: '',
        Description: '',
        TaxRate: 10,
        TaxAmount: 0,
        Details: [{ 
            ItemName: '', Unit: '', Quantity: 0, UnitPrice: 0, DiscountRate: 0, Amount: 0, 
            DebitAcc: '131', CreditAcc: '5111' // Mặc định Nợ 131 - Có 5111 cho nghiệp vụ Bán hàng
        }]
    };
};

const handleSave = async () => {
    // 1. Validate thông tin Header
    if (!voucher.value.PartnerId) {
        alert("Vui lòng chọn khách hàng!");
        return;
    }
    if (!voucher.value.WarehouseId) {
        alert("Vui lòng chọn kho xuất hàng!");
        return;
    }
    if (!voucher.value.DocumentDate) {
        alert("Vui lòng chọn ngày chứng từ!");
        return;
    }

    // 2. Lọc và chuẩn bị danh sách hàng hóa (Bỏ các dòng trống)
    const validLines = voucher.value.Details
        .filter(item => item.ItemName && item.Quantity > 0)
        .map(item => ({
            itemId: item.ItemId || 0, // Đảm bảo có ID để Backend kiểm tra tồn kho
            quantity: Number(item.Quantity) || 0,
            unitPrice: Number(item.UnitPrice) || 0,
            taxRate: Number(voucher.value.TaxRate) || 0,
            description: item.ItemName
        }));

    if (validLines.length === 0) {
        alert("Vui lòng nhập ít nhất một mặt hàng hợp lệ!");
        return;
    }

    // 3. Xử lý định dạng ngày tháng (Chuyển từ DD/MM/YYYY sang ISO để Backend nhận diện đúng)
    let formattedDate;
    if (voucher.value.DocumentDate.includes('/')) {
        const parts = voucher.value.DocumentDate.split('/');
        formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
    } else {
        formattedDate = new Date(voucher.value.DocumentDate).toISOString();
    }

    // 4. Đóng gói Payload chuẩn
    const payload = {
        document: {
            documentNo: voucher.value.DocumentNo,
            docType: "SALE", // Nghiệp vụ bán hàng
            documentDate: formattedDate,
            postingDate: formattedDate,
            partnerId: Number(voucher.value.PartnerId),
            warehouseId: Number(voucher.value.WarehouseId),
            totalAmount: subTotal.value + (Number(voucher.value.TaxAmount) || 0),
            description: voucher.value.Description || "",
            status: 1 // Trạng thái đã ghi sổ
        },
        lines: validLines
    };

    // 5. Gửi dữ liệu và xử lý phản hồi
    try {
        // Hiển thị trạng thái đang xử lý nếu cần (Loading)
        const result = await vStore.createVoucher(payload);

        if (result && result.success) {
            alert("✅ Lưu hóa đơn bán hàng thành công!");
            // Có thể thêm logic reset form hoặc chuyển về danh sách tại đây
            resetForm();
        } else {
            // Hiển thị thông báo lỗi chi tiết (Ví dụ: "Không đủ tồn kho...")
            alert("❌ Thất bại: " + (result.message || "Không thể lưu chứng từ"));
        }
    } catch (error) {
        console.error("Save Error:", error);
        alert("💥 Lỗi kết nối Server! Vui lòng kiểm tra lại đường truyền.");
    }
};
const handleAutoFillFromAI = (scannedData) => {
    // 1. Map dữ liệu chung
    if (scannedData.taxCode) voucher.value.TaxCode = scannedData.taxCode;
    if (scannedData.address) voucher.value.Address = scannedData.address;
    if (scannedData.documentNumber) voucher.value.DocumentNo = scannedData.documentNumber;
    if (scannedData.note) voucher.value.Description = scannedData.note;
    if (scannedData.documentDate) voucher.value.DocumentDate = scannedData.documentDate.split('T')[0];

    // 2. Map tiền thuế tổng cộng (Dùng cho trường hợp đa thuế suất 8% + 10%)
    if (scannedData.vatAmount !== undefined) {
        voucher.value.TaxAmount = scannedData.vatAmount;
    }

    // 3. Map chi tiết hàng hóa
    if (scannedData.items && scannedData.items.length > 0) {
        voucher.value.Details = scannedData.items.map(item => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unitPrice) || 0;

            return {
                ItemName: item.itemName || '',
                Unit: item.unit || 'Chiếc',
                Quantity: qty,
                UnitPrice: price,
                // Đẩy thuế suất (8, 10) vào cột CK%
                DiscountRate: item.discountRate || 0,
                // Thành tiền không trừ chiết khấu vì DiscountRate đang đóng vai trò là Thuế suất
                Amount: item.amount || Math.round(qty * price),
                DebitAcc: item.debitAccount || '131',
                CreditAcc: item.creditAccount || '5111'
            };
        });

        // 4. Xử lý ô Thuế suất tổng ở phía dưới
        const uniqueRates = [...new Set(scannedData.items.map(i => i.discountRate).filter(r => r !== null))];

        if (uniqueRates.length === 1) {
            voucher.value.TaxRate = uniqueRates[0]; // Chỉ có 1 loại thuế
        } else {
            voucher.value.TaxRate = null; // Nhiều loại thuế -> Để trống ô % để hiện "Tổng thuế"
        }
    }

    handleUpdateTotals();
};

const generateFrontendVoucherNo = (prefix) => {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `${prefix}${datePart}-${randomPart}`;
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