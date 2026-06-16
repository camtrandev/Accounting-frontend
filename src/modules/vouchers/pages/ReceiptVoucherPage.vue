<template>
    <div class="layout-wrapper" :class="{ 'is-split-mode': showAIAssistant }">
        <!-- Panel AI trợ lý chứng từ -->
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
                    <button class="btn btn-outline" @click="handlePrint"><i class="fas fa-print"></i> In phiếu</button>
                    <button class="btn btn-primary" @click="handleSave"><i class="fas fa-save"></i> Lưu phiếu
                        (F2)</button>
                    <button class="btn btn-ai-assistant" :class="{ 'active': showAIAssistant }"
                        @click="showAIAssistant = !showAIAssistant">
                        <span class="icon">✨</span>
                        {{ showAIAssistant ? 'Đóng Trợ lý AI' : 'Trợ lý Chứng từ AI' }}
                    </button>
                </div>
            </header>

            <section class="card-container">
                <!-- Thông tin đối tượng (Lấy tự động từ listPartners) -->
                <VoucherPartnerInfo :model="voucher" :partners="listPartners" :warehouses="listWarehouses" />

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

            <!-- Bảng hạch toán chi tiết -->
            <ReceiptDetailTable :details="voucher.Details" />

            <div class="footer-layout">
                <div class="card-container note-card compact-card">
                    <label class="label-premium">Số tiền bằng chữ</label>
                    <div class="words-box">
                        <i class="fas fa-quote-left quote-icon"></i>
                        <span class="money-text">{{ moneyInWords }}</span>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useVouchersStore } from '../store/vouchers.store'; // Giả định path store của bạn
import VoucherPartnerInfo from '../components/VoucherPartnerInfo.vue';
import ReceiptDetailTable from '../components/ReceiptDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue';

const vStore = useVouchersStore();
const showAIAssistant = ref(false);

// --- 1. KHỞI TẠO DỮ LIỆU ---
const voucher = ref({
    DocumentNo: '',
    PartnerId: null,
    WarehouseId: null, // Thêm kho theo yêu cầu của bạn
    BuyerName: '',
    DocumentDate: new Date().toISOString().substr(0, 10),
    Reason: '',
    ReferenceDocs: '',
    Details: [
        { Description: '', DebitAcc: '1111', CreditAcc: '131', Amount: 0 }
    ]
});

// Lấy dữ liệu từ Store
const listPartners = computed(() => vStore.partners);
const listWarehouses = computed(() => vStore.warehouses);

onMounted(async () => {
    // Gọi API lấy danh mục từ store
    await vStore.fetchMetaData();

    // Sinh mã chứng từ nếu chưa có
    if (!voucher.value.DocumentNo) {
        generateDocumentNo();
    }

    // Gán kho mặc định nếu có danh sách
    if (listWarehouses.value.length > 0 && !voucher.value.WarehouseId) {
        voucher.value.WarehouseId = listWarehouses.value[0].id;
    }
});

const generateDocumentNo = () => {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    voucher.value.DocumentNo = `PT${dateStr}-${Math.floor(100 + Math.random() * 900)}`;
};

// --- 2. TÍNH TOÁN & ĐỊNH DẠNG ---
const totalAmount = computed(() => {
    return voucher.value.Details.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
});

const moneyInWords = computed(() => {
    return readVietnameseMoney(totalAmount.value);
});

const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0);
};

// --- 3. THUẬT TOÁN ĐỌC TIỀN CHUẨN KẾ TOÁN ---
function readVietnameseMoney(number) {
    if (!number || number === 0) return "Không đồng";

    const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

    function readThreeDigits(n, showZero) {
        let res = "";
        let h = Math.floor(n / 100);
        let t = Math.floor((n % 100) / 10);
        let u = n % 10;

        if (h > 0 || showZero) {
            res += digits[h] + " trăm ";
        }

        if (t > 0) {
            if (t === 1) res += "mười ";
            else res += digits[t] + " mươi ";
        } else if (h > 0 && u > 0) {
            res += "lẻ ";
        }

        if (t > 0 && u === 1) res += "mốt";
        else if (t > 1 && u === 5) res += "lăm";
        else if (u > 0) res += digits[u];

        return res.trim();
    }

    let res = "";
    let unitIdx = 0;
    let tempNum = Math.abs(number);

    while (tempNum > 0) {
        let block = tempNum % 1000;
        if (block > 0) {
            let sBlock = readThreeDigits(block, tempNum >= 1000);
            res = sBlock + " " + units[unitIdx] + " " + res;
        }
        tempNum = Math.floor(tempNum / 1000);
        unitIdx++;
    }

    res = res.trim().charAt(0).toUpperCase() + res.trim().slice(1);
    return res + " đồng chẵn.";
}

const resetForm = () => {
    voucher.value = {
        DocumentNo: '', 
        PartnerId: null,
        WarehouseId: listWarehouses.value.length > 0 ? listWarehouses.value[0].id : null,
        BuyerName: '',
        DocumentDate: new Date().toISOString().substr(0, 10),
        Reason: '',
        ReferenceDocs: '',
        Details: [
            // Trả về một dòng trống chuẩn của Phiếu thu
            { Description: '', DebitAcc: '1111', CreditAcc: '131', Amount: 0 }
        ]
    };
    
    // Tự động sinh ngay số Phiếu thu mới
    generateDocumentNo();
};

// --- 4. LOGIC LƯU DỮ LIỆU ---
const handleSave = async () => {
    // Validate cơ bản
    if (!voucher.value.PartnerId) return alert("Vui lòng chọn đối tượng nộp tiền!");
    if (totalAmount.value <= 0) return alert("Số tiền phải lớn hơn 0!");

    const payload = {
        document: {
            documentNo: voucher.value.DocumentNo,
            docType: "RECEIPT",
            documentDate: new Date(voucher.value.DocumentDate).toISOString(),
            partnerId: Number(voucher.value.PartnerId),
            warehouseId: voucher.value.WarehouseId ? Number(voucher.value.WarehouseId) : null,
            totalAmount: totalAmount.value,
            description: voucher.value.Reason,
            status: 1
        },
        lines: voucher.value.Details.map(line => ({
            description: line.Description || voucher.value.Reason,
            debitAcc: line.DebitAcc,
            creditAcc: line.CreditAcc,
            amount: Number(line.Amount)
        }))
    };

    try {
        const result = await vStore.createVoucher(payload);
        if (result && result.success) {
            alert("✅ Lưu phiếu thu thành công!");
            resetForm();
        } else {
            alert("❌ Lỗi: " + (result.message || "Không thể lưu"));
        }
    } catch (error) {
        console.error("Save Error:", error);
        alert("💥 Lỗi kết nối hệ thống!");
    }
};

// --- 5. HÀM TRỢ LÝ AI ---
const handleAutoFillFromAI = (scannedData) => {
    // --- PHẦN HEADER ---
    if (scannedData.documentNumber) {
        voucher.value.DocumentNo = scannedData.documentNumber; // "PT260515-322"
    }

    if (scannedData.documentDate) {
        // Chuyển "2026-05-14T00:00:00" thành "2026-05-14"
        voucher.value.DocumentDate = scannedData.documentDate.split('T')[0];
    }

    if (scannedData.reason) {
        voucher.value.Reason = scannedData.reason;
    }

    if (scannedData.attachedDocuments) {
        voucher.value.ReferenceDocs = scannedData.attachedDocuments;
    }

    // Gán tên người nộp tiền (nếu component VoucherPartnerInfo có dùng trường này)
    if (scannedData.targetName) {
        voucher.value.BuyerName = scannedData.targetName; // "Nguyễn Văn An"
    }

    /// --- PHẦN TABLE (CHI TIẾT) ---
    if (scannedData.details && scannedData.details.length > 0) {
        voucher.value.Details = scannedData.details.map(item => ({
            // SỬA LẠI: Viết hoa chữ cái đầu cho khớp hoàn toàn với state khởi tạo ban đầu
            Description: item.description || scannedData.reason,
            DebitAcc: item.debitAccount || '1111',
            CreditAcc: item.creditAccount || '131',
            Amount: Number(item.amount) || 0
        }));
    }
};
</script>

<style scoped>
.money-text {
    font-style: italic;
    color: #2c3e50;
    font-weight: 500;
}

.highlight {
    color: #e74c3c;
    font-weight: bold;
}

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