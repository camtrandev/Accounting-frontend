<template>
    <div class="issue-form-container">
        <div class="form-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack">
                    <i class="fas fa-arrow-left"></i> Quay lại
                </button>
                <h2 class="page-title">Thêm mới Phiếu Xuất Kho</h2>
            </div>
            <div class="header-right">
                <button class="btn-outline">Hủy bỏ</button>
                <button class="btn-primary" @click="saveVoucher">
                    <i class="fas fa-save"></i> Lưu & Duyệt phiếu
                </button>
            </div>
        </div>

        <div class="form-section">
            <div class="section-grid">
                <div class="info-group">
                    <h3 class="group-title">Thông tin chung</h3>
                    <div class="form-row">
                        <label>Lý do xuất <span class="required">*</span></label>
                        <select v-model="masterData.reason" class="font-medium text-blue-600">
                            <option value="sales">Xuất bán hàng</option>
                            <option value="internal">Xuất tiêu dùng nội bộ</option>
                            <option value="destroy">Xuất hủy hàng hỏng</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Đối tượng nhận</label>
                        <div class="input-with-icon">
                            <input type="text" v-model="masterData.receiver"
                                :placeholder="masterData.reason === 'sales' ? 'Chọn khách hàng...' : 'Chọn nhân viên/phòng ban...'" />
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                    <div class="form-row">
                        <label>Diễn giải</label>
                        <input type="text" v-model="masterData.description"
                            placeholder="Ghi chú thêm về lô xuất này..." />
                    </div>
                </div>

                <div class="info-group">
                    <h3 class="group-title">Chứng từ</h3>
                    <div class="form-row">
                        <label>Số chứng từ <span class="required">*</span></label>
                        <input type="text" v-model="masterData.voucherNumber" class="font-bold text-orange-600" />
                    </div>
                    <div class="form-row">
                        <label>Ngày hạch toán <span class="required">*</span></label>
                        <input type="date" v-model="masterData.postDate" />
                    </div>
                    <div class="form-row">
                        <label>Trạng thái</label>
                        <span class="status-badge bg-gray-100 text-gray-600">Chờ duyệt</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-section detail-section">
            <h3 class="group-title">Chi tiết hàng hóa</h3>

            <div class="table-responsive">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;" class="text-center">#</th>
                            <th style="width: 150px;">Mã hàng</th>
                            <th style="width: 250px;">Tên hàng</th>
                            <th style="width: 80px;">ĐVT</th>
                            <th style="width: 100px;" class="text-right">Tồn kho</th>
                            <th style="width: 120px;" class="text-right">SL Xuất</th>
                            <th style="width: 150px;" class="text-right">Đơn giá bán</th>
                            <th style="width: 180px;" class="text-right">Thành tiền</th>
                            <th style="width: 60px;" class="text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in detailRows" :key="row.id" :class="{ 'row-error': row.error }">
                            <td class="text-center text-gray-500">{{ index + 1 }}</td>

                            <td>
                                <input type="text" v-model="row.itemCode" @blur="fetchItemData(index)"
                                    class="cell-input uppercase font-medium" placeholder="Gõ: IP15..." />
                            </td>

                            <td>
                                <input type="text" v-model="row.itemName" class="cell-input bg-gray-50" readonly
                                    tabindex="-1" />
                            </td>
                            <td>
                                <input type="text" v-model="row.unit" class="cell-input bg-gray-50" readonly
                                    tabindex="-1" />
                            </td>

                            <td>
                                <div class="cell-input bg-gray-50 text-right flex items-center justify-end font-semibold text-green-600"
                                    readonly>
                                    {{ row.inStock !== null ? row.inStock : '-' }}
                                </div>
                            </td>

                            <td>
                                <input type="number" v-model="row.quantity" @input="validateRow(index)"
                                    class="cell-input text-right" :class="{ 'text-red-600 font-bold': row.error }"
                                    min="0" />
                            </td>

                            <td>
                                <input type="number" v-model="row.price" @input="calculateAmount(index)"
                                    class="cell-input text-right" :disabled="masterData.reason !== 'sales'" min="0" />
                            </td>

                            <td>
                                <input type="text" :value="formatCurrency(row.amount)"
                                    class="cell-input text-right font-semibold text-blue-600 bg-gray-50" readonly
                                    tabindex="-1" />
                            </td>
                            <td class="text-center">
                                <button class="btn-delete-row" @click="removeRow(index)" title="Xóa dòng này">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="hasError" class="error-message">
                    <i class="fas fa-exclamation-triangle"></i> Lỗi: Có dòng hàng hóa đang xuất vượt quá số lượng tồn
                    kho khả dụng!
                </div>
            </div>

            <div class="detail-actions-summary">
                <button class="btn-add-row" @click="addRow">
                    <i class="fas fa-plus"></i> Thêm dòng mới
                </button>

                <div class="summary-box">
                    <div class="summary-item">
                        <span>Tổng SL Xuất:</span>
                        <span class="font-bold">{{ totalQuantity }}</span>
                    </div>
                    <div class="summary-item total-amount">
                        <span>Tổng tiền:</span>
                        <span class="font-bold text-red-600">{{ formatCurrency(totalAmount) }} </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- GIẢ LẬP DATABASE (MOCK DATA) ---
// Thực tế đoạn này sẽ gọi API GET /api/inventory/items?code=...
const mockDatabase = {
    'IP15': { name: 'iPhone 15 Pro Max 256GB', unit: 'Cái', stock: 12, defaultPrice: 29500000 },
    'MACM3': { name: 'MacBook Pro 14 M3', unit: 'Cái', stock: 4, defaultPrice: 39990000 },
    'AIRP': { name: 'AirPods Pro 2', unit: 'Cái', stock: 0, defaultPrice: 5500000 } // Hết hàng
}

// 1. Dữ liệu Master
const today = new Date().toISOString().split('T')[0]
const masterData = reactive({
    reason: 'sales',
    receiver: '',
    description: 'Xuất bán hàng hóa',
    voucherNumber: 'XK2604-001',
    postDate: today
})

// Tự động đổi diễn giải khi đổi lý do xuất
watch(() => masterData.reason, (newReason) => {
    if (newReason === 'sales') masterData.description = 'Xuất bán hàng hóa'
    else if (newReason === 'internal') masterData.description = 'Xuất sử dụng nội bộ'
    else masterData.description = 'Xuất hủy'
})

// 2. Dữ liệu Detail
const detailRows = ref([
    { id: Date.now(), itemCode: '', itemName: '', unit: '', inStock: null, quantity: 0, price: 0, amount: 0, error: false }
])

// 3. Nghiệp vụ: Lấy thông tin hàng hóa từ "Database"
const fetchItemData = (index) => {
    const row = detailRows.value[index]
    if (!row.itemCode) return

    const code = row.itemCode.toUpperCase()
    const item = mockDatabase[code]

    if (item) {
        row.itemName = item.name
        row.unit = item.unit
        row.inStock = item.stock // Lấy số tồn kho hiện tại
        row.price = masterData.reason === 'sales' ? item.defaultPrice : 0 // Chỉ gợi ý giá nếu là xuất bán
        row.error = false
        validateRow(index) // Kiểm tra lại SL ngay khi load
    } else {
        // Không tìm thấy mã
        row.itemName = 'Không tìm thấy mã hàng!'
        row.unit = ''
        row.inStock = null
    }
}

// 4. Nghiệp vụ cốt lõi: Validate Tồn Kho
const validateRow = (index) => {
    const row = detailRows.value[index]

    // Tính lại tiền
    row.amount = (row.quantity || 0) * (row.price || 0)

    // Bật cờ lỗi nếu Xuất > Tồn
    if (row.inStock !== null && row.quantity > row.inStock) {
        row.error = true
    } else {
        row.error = false
    }
}

// Gọi chung khi đổi giá tiền
const calculateAmount = (index) => {
    validateRow(index)
}

// 5. Thêm/Xóa dòng
const addRow = () => {
    detailRows.value.push({
        id: Date.now(), itemCode: '', itemName: '', unit: '', inStock: null, quantity: 0, price: 0, amount: 0, error: false
    })
}

const removeRow = (index) => {
    if (detailRows.value.length === 1) return alert('Phải có ít nhất 1 mặt hàng!')
    detailRows.value.splice(index, 1)
}

// 6. Computed properties
const hasError = computed(() => detailRows.value.some(row => row.error))

const totalQuantity = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.quantity || 0), 0))
const totalAmount = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0))

// 7. Utils
const formatCurrency = (value) => value ? new Intl.NumberFormat('vi-VN').format(value) : '0'

const goBack = () => router.push({ name: 'InventoryDashboard' }) // Hoặc router.go(-1)

const saveVoucher = () => {
    // Chặn lưu nếu có lỗi tồn kho
    if (hasError.value) {
        alert('Không thể lưu! Vui lòng kiểm tra lại các dòng bị đỏ (xuất quá số lượng tồn).')
        return
    }

    // Chặn nếu SL = 0
    if (totalQuantity.value <= 0) {
        alert('Phiếu xuất phải có số lượng lớn hơn 0!')
        return
    }

    const payload = {
        master: masterData,
        details: detailRows.value.map(({ error, ...rest }) => rest), // Loại bỏ cờ error trước khi gửi API
        totalAmount: totalAmount.value
    }
    console.log('API Payload Xuất Kho:', payload)
    alert('Đã lưu Phiếu Xuất thành công! Kho đã được trừ.')
    goBack()
}
</script>

<style scoped>
/* CSS Tương tự phiếu nhập nhưng chỉnh tông màu nhấn sang Cam/Đỏ để phân biệt */
.issue-form-container {
    padding: 24px;
    background-color: #f8f9fc;
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.page-title {
    margin: 0;
    font-size: 24px;
    color: #111827;
}

.btn-back {
    background: transparent;
    border: none;
    font-size: 14px;
    color: #4b5563;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-back:hover {
    color: #ea580c;
}

/* Màu hover cho xuất kho (Cam) */

.btn-primary {
    background: #ea580c;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
}

.btn-primary:hover {
    background: #c2410c;
}

.btn-outline {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
}

.form-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.group-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 16px;
    color: #ea580c;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
}

.section-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
}

@media (max-width: 1024px) {
    .section-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

.form-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.form-row label {
    width: 140px;
    font-size: 14px;
    color: #4b5563;
    font-weight: 500;
}

.form-row input,
.form-row select {
    flex: 1;
    height: 38px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0 12px;
    outline: none;
}

.form-row input:focus,
.form-row select:focus {
    border-color: #ea580c;
}

.required {
    color: #dc2626;
}

.input-with-icon {
    position: relative;
    flex: 1;
    display: flex;
}

.input-with-icon input {
    width: 100%;
}

.input-with-icon i {
    position: absolute;
    right: 12px;
    top: 12px;
    color: #9ca3af;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
}

/* Bảng chi tiết */
.detail-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
}

.detail-table th {
    background: #f3f4f6;
    padding: 12px 8px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    border: 1px solid #e5e7eb;
}

.detail-table td {
    border: 1px solid #e5e7eb;
    padding: 0;
    transition: background-color 0.3s;
}

/* CSS cho ô Lỗi */
.row-error td {
    background-color: #fef2f2 !important;
}

.row-error input.cell-input {
    background-color: transparent;
}

.cell-input {
    width: 100%;
    height: 40px;
    border: none;
    padding: 0 8px;
    background: transparent;
    outline: none;
    font-size: 14px;
}

.cell-input:focus:not([readonly]) {
    background: #ffedd5;
}

/* Hover màu vàng cam */
.uppercase {
    text-transform: uppercase;
}

.bg-gray-50 {
    background-color: #f9fafb;
    color: #6b7280;
}

input[disabled] {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.justify-end {
    justify-content: flex-end;
}

.btn-delete-row {
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    width: 100%;
    height: 40px;
}

.btn-delete-row:hover {
    color: #dc2626;
}

.error-message {
    margin-top: 12px;
    color: #dc2626;
    font-size: 14px;
    font-weight: 500;
    padding: 12px;
    background: #fef2f2;
    border-radius: 8px;
    border: 1px solid #fecaca;
}

.detail-actions-summary {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    align-items: flex-start;
}

.btn-add-row {
    background: transparent;
    border: 1px dashed #ea580c;
    color: #ea580c;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.btn-add-row:hover {
    background: #fff7ed;
}

.summary-box {
    background: #f9fafb;
    padding: 16px 24px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    min-width: 300px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
}

.total-amount {
    font-size: 16px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #d1d5db;
}
</style>