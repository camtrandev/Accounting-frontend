<template>
    <div class="layout-wrapper" :class="{ 'is-split-mode': showAIAssistant }">
        <!-- Panel AI trợ lý chứng từ -->
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
                <!-- Thông tin đối tượng (Lấy từ store tương tự Phiếu Thu) -->
                <VoucherPartnerInfo :model="voucher" :partners="listPartners" :warehouses="listWarehouses" />

                <div class="master-extra-row">
                    <div class="field-group flex-2">
                        <label class="label-premium">Lý do chi</label>
                        <div class="input-wrapper">
                            <i class="fas fa-comment-dots icon-inside"></i>
                            <input type="text" v-model="voucher.Reason" class="input-premium"
                                placeholder="Ví dụ: Chi trả tiền nhà cung cấp, thanh toán lương..." />
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
            <PaymentDetailTable :details="voucher.Details" />

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
                        <span class="lbl-total">TỔNG TIỀN CHI :</span>
                        <span class="val-total">{{ formatVND(totalAmount) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVouchersStore } from '../store/vouchers.store';
import VoucherPartnerInfo from '../components/VoucherPartnerInfo.vue';
import PaymentDetailTable from '../components/PaymentDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue';
import { useToast } from "vue-toastification";

const vStore = useVouchersStore();
const showAIAssistant = ref(false);
const toast = useToast();

// --- 1. KHỞI TẠO DỮ LIỆU ---
const voucher = ref({
    DocumentNo: '',
    PartnerId: null,
    WarehouseId: null,
    BuyerName: '', // Tên người nhận tiền
    DocumentDate: new Date().toISOString().substr(0, 10),
    Reason: '',
    ReferenceDocs: '',
    Details: [
        { Description: '', DebitAcc: '331', CreditAcc: '1111', Amount: 0 }
    ]
});


const listPartners = computed(() => vStore.partners);
const listWarehouses = computed(() => vStore.warehouses);

onMounted(async () => {
    await vStore.fetchMetaData();

    if (!voucher.value.DocumentNo) {
        generateDocumentNo();
    }

    if (listWarehouses.value.length > 0 && !voucher.value.WarehouseId) {
        voucher.value.WarehouseId = listWarehouses.value[0].id;
    }
});

const generateDocumentNo = () => {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    // Tiền tố PC cho Phiếu Chi
    voucher.value.DocumentNo = `PC${dateStr}-${Math.floor(100 + Math.random() * 900)}`;
};

// --- 2. TÍNH TOÁN & ĐỊNH DẠNG ---
const totalAmount = computed(() => {
    return voucher.value.Details.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
});

const moneyInWords = computed(() => {
    return readVietnameseMoney(totalAmount.value);
});

const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0) + ' đ';
};

// --- 3. THUẬT TOÁN ĐỌC TIỀN CHUẨN ---
function readVietnameseMoney(number) {
    if (!number || number === 0) return "Không đồng";
    const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

    function readThreeDigits(n, showZero) {
        let res = "";
        let h = Math.floor(n / 100);
        let t = Math.floor((n % 100) / 10);
        let u = n % 10;
        if (h > 0 || showZero) res += digits[h] + " trăm ";
        if (t > 0) {
            if (t === 1) res += "mười ";
            else res += digits[t] + " mươi ";
        } else if (h > 0 && u > 0) res += "lẻ ";
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
        BuyerName: '', // Xóa tên người nhận tiền
        DocumentDate: new Date().toISOString().substr(0, 10),
        Reason: '',
        ReferenceDocs: '',
        Details: [
            // Trả về dòng trống mặc định (Nợ 331 / Có 1111) cho Phiếu chi
            { Description: '', DebitAcc: '331', CreditAcc: '1111', Amount: 0 }
        ]
    };
    
    // Tự động nhảy số Phiếu chi mới ngay lập tức
    generateDocumentNo();
};

// --- 4. LOGIC LƯU DỮ LIỆU ---
const handleSave = async () => {
    if (!voucher.value.PartnerId) return toast.warning("Vui lòng chọn đối tượng nhận tiền!");
    if (totalAmount.value <= 0) return toast.warning("Số tiền chi phải lớn hơn 0!");

    const payload = {
        document: {
            documentNo: voucher.value.DocumentNo,
            docType: "PAYMENT", // Đổi type thành PAYMENT
            documentDate: new Date(voucher.value.DocumentDate).toISOString(),
            partnerId: Number(voucher.value.PartnerId),
            warehouseId: voucher.value.WarehouseId ? Number(voucher.value.WarehouseId) : null,
            totalAmount: totalAmount.value,
            description: voucher.value.Reason,
            status: 0
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
        if (result?.success) {
            toast.success("✅ Lưu phiếu chi thành công!");
            resetForm();
        } else {
            toast.error("❌ Lỗi: " + (result.message || "Không thể lưu"));
        }
    } catch (error) {
        toast.error("💥 Lỗi kết nối hệ thống!");
    }
};

// --- 5. HÀM TRỢ LÝ AI (Áp dụng mapping chi tiết hơn) ---
const handleAutoFillFromAI = (scannedData) => {
    if (scannedData.documentNumber) voucher.value.DocumentNo = scannedData.documentNumber;

    if (scannedData.documentDate) {
        voucher.value.DocumentDate = scannedData.documentDate.split('T')[0];
    }

    if (scannedData.reason || scannedData.note) {
        voucher.value.Reason = scannedData.reason || scannedData.note;
    }

    if (scannedData.attachedDocuments) {
        voucher.value.ReferenceDocs = scannedData.attachedDocuments;
    }

    if (scannedData.targetName) {
        voucher.value.BuyerName = scannedData.targetName;
    }

    // Xử lý chi tiết bảng
    if (scannedData.details && scannedData.details.length > 0) {
        voucher.value.Details = scannedData.details.map(item => ({
            Description: item.description || scannedData.reason,
            Amount: Number(item.amount) || 0,
            // Ưu tiên tài khoản từ AI, nếu AI không trả về thì mới dùng mặc định
            DebitAcc: item.debitAccount || '642',
            CreditAcc: item.creditAccount || '1111'
        }));
    } else if (scannedData.totalAmount) {
        // Trường hợp AI trả về tổng nhưng ko có mảng chi tiết
        voucher.value.Details = [{
            Description: scannedData.reason || 'Chi tiền tự động từ AI',
            Amount: Number(scannedData.totalAmount),
            DebitAcc: '642', // Mặc định chi phí nếu ko rõ
            CreditAcc: '1111'
        }];
    }
};

const handlePrint = () => {
    window.print();
};
</script>

<style scoped>
/* ================= THIẾT KẾ ĐỒNG NHẤT VỚI PHIẾU THU (THEME ĐỎ) ================= */

.layout-wrapper {
    display: flex;
    width: 100%;
    gap: 20px;
    transition: all 0.3s ease;
}

.ocr-left-panel {
    flex: 0 0 45%;
    max-width: 36%;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
}

.right-form-panel {
    flex: 1;
    min-width: 0;
    transition: all 0.3s ease;
}

.voucher-page {
    padding: 16px 24px;
    background: #f1f5f9;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: 'Inter', sans-serif;
}

/* Card Container Premium */
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

/* Màu chủ đạo Phiếu Chi: Đỏ/Rose */
.highlight {
    color: #ef4444;
    font-weight: bold;
}

.master-extra-row {
    display: flex;
    gap: 16px;
}

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
    border-color: #ef4444;
    /* Đỏ khi focus cho Phiếu Chi */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
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

/* Buttons */
.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 13px;
}

.button-group {
    display: flex;
    gap: 10px;
}

.btn-primary {
    background: #ef4444;
    color: #fff;
}

.btn-outline {
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #64748b;
}

.btn-ai-assistant {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
}

/* Footer Layout */
.footer-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 16px;
}

.compact-card {
    padding: 16px;
    justify-content: center;
}

.words-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff1f2;
    /* Nền đỏ nhạt */
    border: 1px dashed #fecaca;
    padding: 10px 14px;
    border-radius: 8px;
    color: #be123c;
}

.money-text {
    font-size: 14px;
    font-weight: 500;
    font-style: italic;
}

.val-total {
    font-size: 24px;
    font-weight: 900;
    color: #ef4444;
    /* Tổng tiền màu đỏ */
}

.is-split-mode .master-extra-row {
    flex-direction: column;
}
</style>