<script setup>
import { ref } from 'vue';
import { useVouchersStore } from '../store/vouchers.store'; // Import store

// --- NHẬN DOC TYPE TỪ COMPONENT CHA ---
const props = defineProps({
    docType: {
        type: Number,
        default: 0 // Mặc định là 0 (Hóa đơn mua hàng)
    }
});

// --- STATE CHO UI ---
const currentStep = ref(1);
const isDragging = ref(false);
const isLoading = ref(false);
const previewImageUrl = ref(null);
const fileInput = ref(null);

const emit = defineEmits(['close', 'fill-data']);

const vouchersStore = useVouchersStore(); // Khởi tạo store

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

// --- GỌI API AI ĐỌC ẢNH THẬT ---
const processFile = async (file) => {
    // 1. Tạo URL để hiển thị ảnh
    previewImageUrl.value = URL.createObjectURL(file);

    // 2. Chuyển sang Bước 2 (Xem ảnh)
    currentStep.value = 2;

    // 3. Bật trạng thái Loading để chạy HIỆU ỨNG QUÉT ảnh
    isLoading.value = true;

    try {
        // Gửi file và docType lên API thông qua Store
        const aiResponse = await vouchersStore.processOcrInvoice(file, props.docType);

        // --- CODE IN DỮ LIỆU LẤY ĐƯỢC RA CONSOLE ---
        console.log('=== KẾT QUẢ AI TRẢ VỀ ===');
        console.log(aiResponse);
        console.log('=========================');
        // BẮN DỮ LIỆU SANG COMPONENT CHA ĐỂ TỰ ĐỘNG ĐIỀN VÀO FORM
        emit('fill-data', aiResponse);
    } catch (error) {
        alert(error.message || 'Có lỗi xảy ra khi quét hóa đơn!');
        // Tùy chọn: Đưa người dùng quay lại bước 1 nếu lỗi
        // resetView(); 
    } finally {
        // Tắt loading -> Thanh quét biến mất
        isLoading.value = false;
    }
};

// --- CÁC HÀM XỬ LÝ NÚT BẤM ---
const resetView = () => {
    currentStep.value = 1;
    previewImageUrl.value = null;
    if (fileInput.value) fileInput.value.value = ''; 
};

const closeAssistant = () => {
    resetView();
    emit('close'); 
};
</script>

<template>
<div class="ocr-ai-panel">
        <button class="btn-close-ai" v-if="currentStep === 1" @click="closeAssistant" title="Đóng trợ lý AI">
            ✕
        </button>

        <div v-if="currentStep === 1" class="upload-section">
            <div class="upload-header">
                <h2>Trí tuệ nhân tạo (AI)</h2>
                <p>Tải ảnh hóa đơn lên để AI quét dữ liệu</p>
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
            </div>
        </div>

        <div v-else-if="currentStep === 2" class="image-view-section">
            <div class="pane-header">
                <h3>Ảnh hóa đơn</h3>
                <button class="btn-outline btn-sm" @click="resetView">Tải ảnh khác</button>
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
    </div>
</template>

<style scoped>
/* --- BIẾN MÀU SẮC CHUNG --- */
.ocr-ai-panel {
    --primary-color: #5a67d8;
    --primary-hover: #434ce6;
    --bg-color: #f8f9fa;
    --card-bg: #ffffff;
    --border-color: #e2e8f0;
    --text-main: #2d3748;
    --text-muted: #718096;
    --danger-color: #e53e3e;

    background-color: var(--bg-color);
    height: 100%;
    min-height: calc(100vh - 120px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--text-main);
    display: flex;
    flex-direction: column;
    position: relative;
}

.btn-close-ai {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 20px;
    font-weight: bold;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.btn-close-ai:hover {
    color: var(--danger-color);
    background-color: #fee2e2;
}

/* --- BƯỚC 1: UPLOAD --- */
.upload-section {
    padding: 40px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.upload-header h2 {
    font-size: 20px;
    margin-bottom: 8px;
}

.upload-header p {
    color: var(--text-muted);
    margin-bottom: 20px;
    font-size: 14px;
}

.dropzone {
    background-color: var(--card-bg);
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    padding: 40px 20px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.dropzone:hover,
.dropzone.is-dragging {
    border-color: var(--primary-color);
    background-color: #ebf4ff;
}

.dropzone .icon {
    font-size: 40px;
    margin-bottom: 12px;
}

.btn-browse {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin: 12px 0;
    transition: background 0.2s;
}

.btn-browse:hover {
    background-color: var(--primary-hover);
}

.file-hint {
    font-size: 12px;
    color: var(--text-muted);
}

/* --- BƯỚC 2: HIỂN THỊ ẢNH --- */
.image-view-section {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--card-bg);
    border-radius: 8px;
    overflow: hidden;
}

.pane-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fcfcfc;
}

.pane-header h3 {
    margin: 0;
    font-size: 15px;
    color: var(--text-main);
}

.btn-outline {
    background-color: transparent;
    color: var(--text-main);
    border: 1px solid var(--border-color);
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

.btn-outline:hover {
    background-color: #f1f5f9;
}

.image-viewer {
    flex: 1;
    padding: 16px;
    overflow: auto;
    background-color: #e2e8f0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.image-wrapper {
    position: relative;
    display: inline-block;
    max-width: 100%;
    border-radius: 8px;
    overflow: hidden;
}

.image-wrapper img {
    max-width: 100%;
    height: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* --- HIỆU ỨNG QUÉT --- */
.image-wrapper.scanning img {
    opacity: 0.7;
    filter: contrast(120%) grayscale(20%);
    transition: all 0.3s;
}

.scanner-laser {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #00f2fe;
    box-shadow: 0 0 15px 5px rgba(0, 242, 254, 0.5),
        0 0 30px 10px rgba(79, 172, 254, 0.4);
    animation: scan-animation 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
    z-index: 10;
}

@keyframes scan-animation {
    0% { top: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
}

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

.scanning-text {
    background: rgba(0, 0, 0, 0.7);
    color: #00f3ff;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 14px;
    animation: pulse 1.5s infinite; /* Hiệu ứng nhấp nháy chữ */
}

@keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
    100% { transform: translate(-50%, -50%) scale(1); }
}
</style>