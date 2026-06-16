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
                <VoucherPartnerInfo :model="voucher" :partners="listPartners" :warehouses="listWarehouses" />

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
import PurchaseDetailTable from '../components/PurchaseDetailTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue';

const vStore = useVouchersStore();

const showAIAssistant = ref(false);

const listPartners = computed(() => vStore.partners);

const listWarehouses = computed(() => vStore.warehouses);

const props = defineProps({
    editId: { type: Number, default: null }, // Nhận ID từ trang cha truyền xuống
    isApprovalMode: { type: Boolean, default: false } // Đánh dấu đây là Admin đang xem
});

const voucher = ref({
    DocumentNo: '',
    PartnerId: null,
    WarehouseId: null,
    BuyerName: '',
    DocumentDate: new Date().toISOString().substr(0, 10),
    Address: '',
    TaxCode: '',
    Description: '',
    TaxRate: 10,
    TaxAmount: 0,
    Details: [{ ItemName: '', Unit: '', Quantity: 0, UnitPrice: 0, DiscountRate: 0, Amount: 0, DebitAcc: '1561', CreditAcc: '331' }]
});

onMounted(async () => {
    console.log('--- Khởi tạo dữ liệu và tự sinh mã số ---');

    // 1. Tải danh mục khách hàng, hàng hóa
    await vStore.fetchMetaData();



    // 2. TỰ ĐỘNG ĐIỀN NGƯỜI MUA (Lấy từ localStorage)
    voucher.value.BuyerName = getLoggedInUserName();

    if (vStore.warehouses.length > 0 && !voucher.value.WarehouseId) {
        voucher.value.WarehouseId = vStore.warehouses[0].id;
    }
    // 3. SINH MÃ TỰ ĐỘNG TRÊN FRONTEND
    // Nếu chưa có số (đang tạo mới), thì sinh mã mới
    if (voucher.value.DocumentNo === 'HDMH0001' || !voucher.value.DocumentNo) {
        voucher.value.DocumentNo = generateFrontendVoucherNo('HDMH');
    }

    if (props.editId) {
        // Nếu có ID, gọi API lấy chi tiết chứng từ đó
        const data = await vStore.fetchVoucherById(props.editId);
        // Đổ dữ liệu vào ref voucher
        voucher.value = normalizeData(data);
    } else {
        // Nếu không có ID -> Đây là màn hình tạo mới (giữ nguyên logic cũ của bạn)
        voucher.value.BuyerName = getLoggedInUserName();
        generateDocumentNo();
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

// Theo dõi sự thay đổi của PartnerId trong object voucher
watch(() => voucher.value.PartnerId, (newId) => {
    console.log('Đã chọn PartnerId mới:', newId); // Log để kiểm tra ID có chạy vào đây không

    if (newId) {
        // Tìm đối tác trong danh sách store dựa trên id (chữ thường)
        const selected = vStore.partners.find(p => p.id === newId);

        if (selected) {
            console.log('Đã tìm thấy đối tác:', selected);

            // Gán giá trị từ đối tác vào form (Dùng chữ thường cho 'address' và 'taxCode')
            voucher.value.Address = selected.address || '';
            voucher.value.TaxCode = selected.taxCode || '';
        }
    } else {
        // Nếu xóa chọn khách hàng thì xóa trắng địa chỉ và MST
        voucher.value.Address = '';
        voucher.value.TaxCode = '';
    }
});

// Hàm demo: Nhận dữ liệu từ component OCR bắn sang và tự động điền vào Form
// Hàm nhận dữ liệu từ component OCR bắn sang và tự động điền vào Form
// Hàm nhận dữ liệu từ component OCR bắn sang và tự động điền vào Form
const handleAutoFillFromAI = (scannedData) => {
    // 1. Map dữ liệu chung
    if (scannedData.taxCode) voucher.value.TaxCode = scannedData.taxCode;
    if (scannedData.address) voucher.value.Address = scannedData.address;
    if (scannedData.documentNumber) voucher.value.DocumentNo = scannedData.documentNumber;
    if (scannedData.note) voucher.value.Description = scannedData.note;
    if (scannedData.documentDate) voucher.value.DocumentDate = scannedData.documentDate.split('T')[0];

    // 2. Gán tổng tiền thuế quét được từ AI
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
                DiscountRate: item.discountRate || 0, // Thuế suất dòng
                Amount: item.amount || Math.round(qty * price),
                DebitAcc: item.debitAccount || '1561',
                CreditAcc: item.creditAccount || '331'
            };
        });

        // 4. Logic hiển thị ô % thuế suất tổng
        const uniqueRates = [...new Set(scannedData.items.map(i => i.discountRate).filter(r => r !== null))];

        if (uniqueRates.length === 1) {
            voucher.value.TaxRate = uniqueRates[0];
        } else {
            voucher.value.TaxRate = null; // Đa thuế suất -> Để trống ô %
        }
    }

    handleUpdateTotals();
};

const getLoggedInUserName = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const parsedUser = JSON.parse(userData);
            // Theo ảnh của bạn, key lưu tên là 'username'
            return parsedUser.username || 'Admin';
        } catch (e) {
            return 'Admin';
        }
    }
    return '';
};

// Hàm sinh mã chứng từ tự động trên Frontend
// Format: HDMH + YYMMDD + STT (ví dụ: HDMH26051301)
const generateFrontendVoucherNo = (prefix = 'HDMH') => {
    const now = new Date();

    // Lấy 2 số cuối của năm (26), tháng (05), ngày (13)
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    // Tạo phần ngày tháng: 260513
    const datePart = `${year}${month}${day}`;

    // Số thứ tự ngẫu nhiên hoặc dựa trên thời gian (ví dụ: lấy giây và miligiây để tránh trùng trong phiên làm việc)
    // Hoặc bạn có thể dùng một số đếm đơn giản
    const randomPart = Math.floor(Math.random() * 999).toString().padStart(3, '0');

    return `${prefix}${datePart}-${randomPart}`;
};

// Hàm reset toàn bộ form Hoá đơn mua hàng về trạng thái ban đầu
const resetForm = () => {
    voucher.value = {
        DocumentNo: generateFrontendVoucherNo('HDMH'), // Sinh ngay số chứng từ mới
        PartnerId: null,
        WarehouseId: vStore.warehouses.length > 0 ? vStore.warehouses[0].id : null, // Gán lại kho mặc định
        BuyerName: getLoggedInUserName(), // Lấy lại tên người dùng
        DocumentDate: new Date().toISOString().substr(0, 10),
        Address: '',
        TaxCode: '',
        Description: '',
        TaxRate: 10,
        TaxAmount: 0,
        Details: [{ 
            ItemName: '', Unit: '', Quantity: 0, UnitPrice: 0, DiscountRate: 0, Amount: 0, 
            DebitAcc: '1561', CreditAcc: '331' // Trả về cặp tài khoản mặc định của phiếu Mua hàng
        }]
    };
};

// Hàm xử lý lưu hóa đơn chuẩn theo Schema API
const handleSave = async () => {

    console.log('Toàn bộ giá trị voucher:', voucher.value);
    // 1. Kiểm tra các điều kiện bắt buộc trước khi lưu
    if (!voucher.value.PartnerId) {
        alert("Vui lòng chọn nhà cung cấp!");
        return;
    }
    if (!voucher.value.WarehouseId) { alert("Vui lòng chọn kho hàng!"); return; }

    // Kiểm tra danh sách hàng hóa
    const hasValidItems = voucher.value.Details.some(item => item.ItemName && item.Quantity > 0);
    if (!hasValidItems) {
        alert("Vui lòng nhập ít nhất một mặt hàng với số lượng lớn hơn 0!");
        return;
    }

    // 2. Đóng gói dữ liệu chuẩn theo DocumentCreateDto.cs và các thực thể Entities
    const payload = {
    // Khớp với thuộc tính 'Document' trong DocumentCreateDto
    document: {
        documentNo: voucher.value.DocumentNo,
        docType: "PURCHASE",
        // Chuyển đổi ngày sang định dạng ISO chuẩn cho .NET DateTime
        documentDate: new Date(voucher.value.DocumentDate).toISOString(),
        postingDate: new Date(voucher.value.DocumentDate).toISOString(),
        partnerId: Number(voucher.value.PartnerId),
        warehouseId: Number(voucher.value.WarehouseId),
        // Tính tổng tiền bao gồm thuế
        totalAmount: subTotal.value + (Number(voucher.value.TaxAmount) || 0),
        description: voucher.value.Description || "",
        status: 0, // Mặc định là 0 (Draft - Nháp) khi mới tạo
        
        // Bổ sung TK Nợ và TK Có với giá trị mặc định lên Document
        debitAcc: voucher.value.DebitAcc || "1561",
        creditAcc: voucher.value.CreditAcc || "331"
    },
    // Khớp với thuộc tính 'Lines' trong DocumentCreateDto (được đổi thành camelCase)
    lines: voucher.value.Details
        .filter(item => item.ItemName) // Chỉ lấy các dòng có tên hàng
        .map(item => ({
            itemId: item.ItemId || null, // ID hàng hóa từ danh mục
            quantity: Number(item.Quantity) || 0,
            unitPrice: Number(item.UnitPrice) || 0,
            taxRate: Number(voucher.value.TaxRate) || 0,
            description: item.ItemName // Diễn giải chi tiết cho từng dòng
        }))
};

    // 3. Thực thi gọi API qua Store
    try {
        console.log("%c [Payload] Gửi dữ liệu lưu xuống Backend:", "color: #007bff; font-weight: bold", payload);

        const result = await vStore.createVoucher(payload);

        if (result && result.success === true) {
            alert("Lưu hóa đơn thành công! ID mới: " + result.data);
            console.log("Dữ liệu đã nằm trong DB với ID:", result.data);

            resetForm();
        } else {
            // Nếu success = false, hiển thị lỗi thực tế từ Backend
            const errorMsg = result?.message || "Lỗi không xác định từ Server";
            alert("Thất bại: " + errorMsg);
            console.error("Chi tiết lỗi:", result);
        }
    } catch (error) {
        // Xử lý lỗi chi tiết hơn nếu từ Axios trả về
        const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi kết nối với máy chủ!";
        console.error("Lỗi khi lưu chứng từ:", error);
        alert(`Lỗi: ${errorMsg}`);
    }
};
// hàm duyệt 
const handleApprove = async () => {
   const result = await vStore.postVoucher(voucher.value.id);
   if (result.success) {
      toast.success("Đã duyệt!");
      emit('approved'); // Bắn tin cho Modal biết để quay về danh sách
   }
}
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

.full-form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #f1f5f9;
    /* Màu nền xám nhạt của app */
    z-index: 10000;
    /* Cao nhất để đè lên cả Modal cũ */
    display: flex;
    flex-direction: column;
}

.overlay-header {
    background: #1e293b;
    /* Màu tối chuyên nghiệp */
    color: white;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-close-overlay {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.overlay-content {
    flex: 1;
    overflow-y: auto;
    /* Cho phép cuộn form nếu dài */
    padding: 20px;
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
    border-radius: 8px;
    /* Bo góc ngoài cùng */
    font-weight: 700;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
    z-index: 1;
    /* Để text và icon nằm lên trên pseudo-elements */

    /* Thiết lập quan trọng cho hiệu ứng viền sáng */
    position: relative;
    overflow: hidden;
    /* Cắt đi phần ánh sáng thừa bên ngoài */
    background: transparent;
    /* Nền nút chính chuyển sang trong suốt để lộ lớp ::after */
}

.btn-ai-assistant:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(168, 85, 247, 0.35);
}

/* Lớp nền chính của nút (che phần ruột, tạo ra viền) */
.btn-ai-assistant::after {
    content: '';
    position: absolute;
    inset: 2px;
    /* Khoảng cách hở viền là 2px. Bạn có thể tăng/giảm số này để viền dày/mỏng hơn */
    background: linear-gradient(90deg, #7e5eff 0%, #c565ff 100%);
    /* Màu chính của nút */
    border-radius: 6px;
    /* Bo góc nhỏ hơn lớp ngoài (8px - 2px) */
    z-index: -1;
    /* Nằm giữa text/icon và ánh sáng chạy */
    transition: all 0.3s ease;
}

/* Hiệu ứng tia sáng chạy quanh viền */
.btn-ai-assistant::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    /* Đảm bảo đủ rộng để khi xoay không bị hụt góc */
    height: 300%;
    /* Dải màu sáng: Trong suốt -> Trắng sáng -> Trong suốt */
    background: conic-gradient(from 0deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.9) 50%,
            transparent 60%,
            transparent 100%);
    transform: translate(-50%, -50%);
    animation: spin-border 2.5s linear infinite;
    /* Tốc độ chạy của ánh sáng. LUÔN CHẠY */
    z-index: -2;
    /* Đẩy ra sau cùng */
}

/* Keyframes cho ánh sáng xoay */
@keyframes spin-border {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
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
    box-shadow: 0 4px 15px rgba(126, 94, 255, 0.4);
    /* Đổi bóng đổ sang màu tím mờ */
}

/* Đổi màu nền bên trong khi active */
.btn-ai-assistant.active::after {
    background: linear-gradient(90deg, #7e5eff 0%, #c565ff 100%);
}

/* Tuỳ chọn: Đổi màu ánh sáng chạy khi active (nhấn nhá thêm tông vàng cam) */
.btn-ai-assistant.active::before {
    background: conic-gradient(from 0deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(197, 101, 255, 0.6) 60%,
            transparent 100%);
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