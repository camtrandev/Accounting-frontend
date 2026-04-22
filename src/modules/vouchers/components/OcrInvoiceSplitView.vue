<script setup>
import { ref, reactive } from 'vue';

// --- STATE CHO UI ---
const currentStep = ref(1);
const isDragging = ref(false);
const isLoading = ref(false);
const previewImageUrl = ref(null);
const fileInput = ref(null);

// --- STATE CHO FORM (Khớp với các cột trong Table: documents) ---
const formData = reactive({
    DocumentNo: '',
    DocType: 'PURCHASE', // Mặc định là mua hàng
    DocumentDate: '',
    PostingDate: '',
    PartnerId: null,
    TotalAmount: 0,
    Description: ''
});

// --- XỬ LÝ SỰ KIỆN KÉO THẢ & CHỌN FILE ---
const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) processFile(file);
};

const handleDrop = (event) => {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    if (file) processFile(file);
};

// Thêm emit để có thể đóng component này từ file cha
const emit = defineEmits(['close']);

// --- MÔ PHỎNG LUỒNG GỌI API AI ---
const processFile = (file) => {
    // 1. Tạo URL để hiển thị ảnh
    previewImageUrl.value = URL.createObjectURL(file);

    // 2. Chuyển NGAY sang Bước 2 (Split-View)
    currentStep.value = 2;

    // 3. Bật trạng thái Loading để chạy HIỆU ỨNG QUÉT ảnh
    isLoading.value = true;

    // Giả lập thời gian AI đọc ảnh mất 3 giây
    setTimeout(() => {
        const aiResponse = {
            DocumentNo: 'HD' + Math.floor(Math.random() * 10000),
            DocType: 'PURCHASE',
            DocumentDate: new Date().toISOString().split('T')[0],
            PostingDate: new Date().toISOString().split('T')[0],
            PartnerId: 101,
            TotalAmount: 25500000,
            Description: 'Hóa đơn mua thiết bị văn phòng (Dữ liệu trích xuất bởi AI)'
        };

        Object.assign(formData, aiResponse);

        // Tắt loading -> Thanh quét biến mất, form hiện dữ liệu rõ lên
        isLoading.value = false;
    }, 10000);
};

// --- CÁC HÀM XỬ LÝ NÚT BẤM ---
const resetView = () => {
    currentStep.value = 1;
    previewImageUrl.value = null;
    if (fileInput.value) fileInput.value.value = ''; // Reset input file
};

const saveDocument = () => {
    console.log('Dữ liệu chuẩn bị gọi API POST .NET:', formData);
    alert(`Đã lưu chứng từ ${formData.DocumentNo} thành công! (Kiểm tra console)`);
    // Thực tế: gọi API ở đây, sau đó chuyển hướng về trang danh sách
};

// Cập nhật hàm reset/đóng
const closeAssistant = () => {
    resetView();
    emit('close'); // Báo cho DocumentPage tắt AI đi
};
</script>

<template>
    <div class="ocr-invoice-container">
        <button class="btn-close-ai" v-if="currentStep === 1" @click="closeAssistant" title="Đóng trợ lý AI">
            ✕
        </button>
        <div v-if="currentStep === 1" class="upload-section">
            <div class="upload-header">
                <h2>Trí tuệ nhân tạo (AI) Đọc Hóa Đơn</h2>
                <p>Kéo thả ảnh hóa đơn hoặc file PDF vào đây để AI tự động trích xuất dữ liệu thành chứng từ.</p>
            </div>

            <div class="dropzone" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop" :class="{ 'is-dragging': isDragging }">
                <div v-if="!isLoading">
                    <div class="icon">📄</div>
                    <h3>Kéo thả file vào đây</h3>
                    <p>hoặc</p>
                    <button class="btn-browse" @click="triggerFileInput">Chọn file từ máy tính</button>
                    <input type="file" ref="fileInput" style="display: none"
                        accept="image/jpeg, image/png, application/pdf" @change="handleFileSelect">
                    <p class="file-hint">Hỗ trợ: JPG, PNG, PDF (Tối đa 5MB)</p>
                </div>

                <div v-else class="loading-state">
                    <div class="spinner"></div>
                    <h3>AI đang quét dữ liệu hóa đơn...</h3>
                    <p>Vui lòng chờ trong giây lát.</p>
                </div>
            </div>
        </div>

        <div v-else-if="currentStep === 2" class="split-view-section">

            <div class="left-pane">
                <div class="pane-header">
                    <h3>Ảnh hóa đơn</h3>
                    <button class="btn-outline" @click="closeAssistant">Quay lại danh sách</button>
                </div>

                <div class="image-viewer">
                    <div class="image-wrapper" :class="{ 'scanning': isLoading }">
                        <img :src="previewImageUrl" alt="Hóa đơn tải lên" />

                        <div v-if="isLoading" class="scanner-laser"></div>
                        <div v-if="isLoading" class="scanning-overlay">
                            <span class="scanning-text">AI đang đọc dữ liệu...</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="right-pane">
                <div class="pane-header">
                    <h3>Thông tin chứng từ (AI đề xuất)</h3>
                    <span class="status-badge">Chưa lưu</span>
                </div>

                <div class="form-container">
                    <form @submit.prevent="saveDocument" class="document-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Số chứng từ <span class="required">*</span></label>
                                <input type="text" v-model="formData.DocumentNo" required />
                            </div>
                            <div class="form-group">
                                <label>Loại chứng từ</label>
                                <select v-model="formData.DocType">
                                    <option value="PURCHASE">Hóa đơn mua vào (PURCHASE)</option>
                                    <option value="SALE">Hóa đơn bán ra (SALE)</option>
                                    <option value="RECEIPT">Phiếu thu (RECEIPT)</option>
                                    <option value="PAYMENT">Phiếu chi (PAYMENT)</option>
                                    <option value="JOURNAL">Khác (JOURNAL)</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Ngày chứng từ</label>
                                <input type="date" v-model="formData.DocumentDate" required />
                            </div>
                            <div class="form-group">
                                <label>Ngày hạch toán</label>
                                <input type="date" v-model="formData.PostingDate" required />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Mã Đối tác (PartnerId)</label>
                                <input type="number" v-model="formData.PartnerId" />
                            </div>
                            <div class="form-group">
                                <label>Tổng tiền (VNĐ)</label>
                                <input type="number" v-model="formData.TotalAmount" class="text-right" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Diễn giải</label>
                            <textarea v-model="formData.Description" rows="3"
                                placeholder="Nhập nội dung chứng từ..."></textarea>
                        </div>
                    </form>
                </div>

                <div class="form-actions">
                    <button class="btn-outline" @click="resetView">Hủy bỏ</button>
                    <button class="btn-primary" @click="saveDocument">Lưu chứng từ</button>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* --- BIẾN MÀU SẮC CHUNG (Khớp với UI của bạn) --- */
.ocr-invoice-container {
    --primary-color: #5a67d8;
    /* Xanh tím giống menu của bạn */
    --primary-hover: #434ce6;
    --bg-color: #f8f9fa;
    --card-bg: #ffffff;
    --border-color: #e2e8f0;
    --text-main: #2d3748;
    --text-muted: #718096;
    --danger-color: #e53e3e;

    padding: 24px;
    background-color: var(--bg-color);
    min-height: calc(100vh - 80px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--text-main);
}

.btn-close-ai {
    position: absolute;
    top: 13%;
    right: 15%;
    background: transparent;
    border: none;
    font-size: 24px;
    font-weight: bold;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close-ai:hover {
    color: var(--danger-color);
    
    background-color: #fee2e2;
    
    transform: scale(1.1);
   
}

/* 
   GIAO DIỆN UPLOAD (DROPZONE)
   */
.upload-section {
    max-width: 800px;
    margin: 40px auto;
    text-align: center;
}

.upload-header h2 {
    font-size: 24px;
    margin-bottom: 8px;
}

.upload-header p {
    color: var(--text-muted);
    margin-bottom: 30px;
}

.dropzone {
    background-color: var(--card-bg);
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    padding: 60px 20px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.dropzone:hover,
.dropzone.is-dragging {
    border-color: var(--primary-color);
    background-color: #ebf4ff;
}

.dropzone .icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.btn-browse {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin: 16px 0;
    transition: background 0.2s;
}

.btn-browse:hover {
    background-color: var(--primary-hover);
}

.file-hint {
    font-size: 13px;
    color: var(--text-muted);
}

/* Hiệu ứng Loading */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* =========================================
   BƯỚC 2: GIAO DIỆN SPLIT-VIEW
   ========================================= */
.split-view-section {
    display: flex;
    gap: 24px;
    height: calc(100vh - 120px);
}

/* Cột trái (Ảnh) và Cột phải (Form) */
.left-pane,
.right-pane {
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.left-pane {
    flex: 4;
}

/* Chiếm 40% */
.right-pane {
    flex: 6;
}

/* Chiếm 60% */

.pane-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fcfcfc;
}

.pane-header h3 {
    margin: 0;
    font-size: 16px;
    color: var(--text-main);
}

/* Khu vực hiển thị ảnh */
.image-viewer {
    flex: 1;
    padding: 20px;
    overflow: auto;
    /* Thêm thanh cuộn nếu ảnh to */
    background-color: #e2e8f0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.image-viewer img {
    max-width: 100%;
    height: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Khu vực Form */
.form-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.form-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
}

.form-group label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--text-main);
}

.required {
    color: var(--danger-color);
}

input,
select,
textarea {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
}

input:focus,
select:focus,
textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(90, 103, 216, 0.1);
}

.text-right {
    text-align: right;
    font-weight: bold;
    color: var(--primary-color);
}

/* Khu vực nút bấm dưới cùng Form */
.form-actions {
    padding: 16px 20px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background-color: #fcfcfc;
}

.btn-outline {
    background-color: transparent;
    color: var(--text-main);
    border: 1px solid var(--border-color);
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.btn-outline:hover {
    background-color: #f1f5f9;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.status-badge {
    background-color: #feebc8;
    color: #dd6b20;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
}

/* Container bao bọc ảnh để thanh quét không chạy ra ngoài */
.image-wrapper {
    position: relative;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    /* Cắt phần laser tràn ra ngoài ảnh */
    border-radius: 4px;
}

/* Làm mờ ảnh một chút khi đang quét */
.image-wrapper.scanning img {
    opacity: 0.7;
    filter: contrast(120%) grayscale(20%);
    transition: all 0.3s;
}

/* TIA LASER QUÉT */
.scanner-laser {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #00f2fe;
    /* Màu tia laser (Xanh Neon) */
    box-shadow: 0 0 15px 5px rgba(0, 242, 254, 0.5),
        /* Vùng sáng quanh laser */
        0 0 30px 10px rgba(79, 172, 254, 0.4);
    /* Animation chạy từ trên xuống dưới và lặp lại */
    animation: scan-animation 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    z-index: 10;
}

@keyframes scan-animation {
    0% {
        top: 0%;
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        top: 100%;
        opacity: 0;
    }
}

/* Chữ báo hiệu đè lên ảnh */
.scanning-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: #00f2fe;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 1px;
    z-index: 20;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        transform: translate(-50%, -50%) scale(1.05);
    }

    100% {
        transform: translate(-50%, -50%) scale(1);
    }
}

/* Bạn có thể làm mờ cột Form bên phải khi đang quét bằng class này */
.right-pane .form-container {
    transition: opacity 0.3s;
}

.right-pane .form-container[style*="opacity: 0.5"] {
    pointer-events: none;
    /* Khóa không cho bấm vào form khi đang quét */
}
</style>