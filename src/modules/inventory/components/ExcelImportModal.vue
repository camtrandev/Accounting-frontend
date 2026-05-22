<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Nhập khẩu hàng hóa từ Excel</h2>
                <button class="btn-close" @click="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="step-text">
                    1. Tải tệp mẫu để chuẩn bị dữ liệu: <a href="#" class="text-blue-600 hover:underline">Tải tệp mẫu
                        tại đây</a>
                </div>
                <div class="step-text mt-2">2. Chọn tệp Excel (.xlsx hoặc .xls) đã có dữ liệu</div>

                <div class="upload-zone" :class="{ 'is-dragging': isDragging }" @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" @click="triggerFileInput">
                    <input type="file" ref="fileInput" accept=".xlsx, .xls" class="hidden" @change="handleFileSelect" />

                    <div class="upload-content">
                        <i class="fas fa-folder-open text-4xl text-yellow-400 mb-3"></i>
                        <p v-if="!selectedFileName">Kéo thả tệp vào đây hoặc Bấm để chọn tệp</p>
                        <p v-else class="font-medium text-blue-600">
                            Tệp đã chọn: {{ selectedFileName }}
                        </p>
                    </div>
                </div>

                <div v-if="previewData.length > 0" class="preview-section">
                    <h4 class="font-semibold mb-2">Xem trước 5 bản ghi đầu tiên:</h4>
                    <div class="table-responsive">
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th>Mã hàng</th>
                                    <th>Tên hàng</th>
                                    <th>ĐVT</th>
                                    <th class="text-right">Số lượng</th>
                                    <th class="text-right">Đơn giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in previewData" :key="index">
                                    <td>{{ row['Mã hàng'] }}</td>
                                    <td>{{ row['Tên hàng'] }}</td>
                                    <td>{{ row['ĐVT'] }}</td>
                                    <td class="text-right">{{ row['Số lượng'] }}</td>
                                    <td class="text-right">{{ row['Đơn giá'] }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="closeModal">Hủy bỏ</button>
                <button class="btn-confirm" :disabled="fullData.length === 0" @click="confirmImport">
                    Nhập khẩu
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close', 'import-success'])

const fileInput = ref(null)
const isDragging = ref(false)
const selectedFileName = ref('')
const previewData = ref([])
const fullData = ref([]) // Lưu toàn bộ dữ liệu bóc tách được

const triggerFileInput = () => {
    fileInput.value.click()
}

// Xử lý khi chọn file qua nút bấm
const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) processFile(file)
}

// Xử lý khi kéo thả file
const handleDrop = (event) => {
    isDragging.value = false
    const file = event.dataTransfer.files[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        processFile(file)
    } else {
        alert('Vui lòng chọn đúng định dạng file Excel (.xlsx, .xls)')
    }
}

// Hàm đọc và bóc tách Excel
const processFile = (file) => {
    selectedFileName.value = file.name
    const reader = new FileReader()

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        // Lấy sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Chuyển đổi sheet thành JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        fullData.value = jsonData
        // Cắt 5 dòng đầu để preview
        previewData.value = jsonData.slice(0, 5)
    }

    reader.readAsArrayBuffer(file)
}

const confirmImport = () => {
    // Gắn mảng data hoàn chỉnh ra component cha
    emit('import-success', fullData.value)
    closeModal()
}

const closeModal = () => {
    // Reset state trước khi đóng
    selectedFileName.value = ''
    previewData.value = []
    fullData.value = []
    if (fileInput.value) fileInput.value.value = ''
    emit('close')
}
</script>

<style scoped>
/* Lớp mờ nền */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Hộp thoại Modal */
.modal-content {
    background: white;
    width: 700px;
    max-width: 90%;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
}

/* CSS Header, Body, Footer cơ bản */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #6b7280;
}

.modal-body {
    padding: 20px;
}

.step-text {
    font-size: 0.95rem;
    color: #374151;
}

/* Khu vực Kéo thả */
.upload-zone {
    margin-top: 16px;
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #f8fafc;
}

.upload-zone:hover,
.upload-zone.is-dragging {
    border-color: #3b82f6;
    background-color: #eff6ff;
}

.hidden {
    display: none;
}

/* Bảng Preview */
.preview-section {
    margin-top: 24px;
}

.preview-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}

.preview-table th,
.preview-table td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
}

.preview-table th {
    background-color: #f3f4f6;
    font-weight: 600;
}

.text-right {
    text-align: right;
}

/* Footer Buttons */
.modal-footer {
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel {
    padding: 8px 16px;
    background-color: #e5e7eb;
    color: #374151;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.btn-confirm {
    padding: 8px 16px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.btn-confirm:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
}
</style>