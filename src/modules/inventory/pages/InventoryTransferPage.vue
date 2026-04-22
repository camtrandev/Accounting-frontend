<template>
    <div class="inventory-form-container">
        <div class="form-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack"><i class="fas fa-arrow-left"></i> Quay lại</button>
                <h2 class="page-title">Phiếu Chuyển Kho Nội Bộ</h2>
            </div>
            <div class="header-right">
                <button class="btn-outline">Hủy bỏ</button>
                <button class="btn-primary" @click="saveVoucher">
                    <i class="fas fa-exchange-alt"></i> Thực hiện chuyển
                </button>
            </div>
        </div>

        <div class="form-section">
            <div class="section-grid">
                <div class="info-group">
                    <h3 class="group-title text-green-600">Thông tin luân chuyển</h3>

                    <div class="form-row">
                        <label>Từ kho (Xuất) <span class="required">*</span></label>
                        <select v-model="masterData.fromWarehouse" @change="revalidateAllRows" class="font-medium">
                            <option value="">-- Chọn kho xuất --</option>
                            <option value="KHO_TONG">Kho Tổng (Hà Nội)</option>
                            <option value="KHO_CH">Kho Cửa Hàng (Cầu Giấy)</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <label>Đến kho (Nhập) <span class="required">*</span></label>
                        <select v-model="masterData.toWarehouse" class="font-medium">
                            <option value="">-- Chọn kho nhận --</option>
                            <option value="KHO_TONG">Kho Tổng (Hà Nội)</option>
                            <option value="KHO_CH">Kho Cửa Hàng (Cầu Giấy)</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <label>Diễn giải</label>
                        <input type="text" v-model="masterData.description" placeholder="Lý do điều chuyển..." />
                    </div>
                </div>

                <div class="info-group">
                    <h3 class="group-title text-green-600">Chứng từ</h3>
                    <div class="form-row">
                        <label>Số chứng từ <span class="required">*</span></label>
                        <input type="text" v-model="masterData.voucherNumber" class="font-bold text-green-700" />
                    </div>
                    <div class="form-row">
                        <label>Ngày luân chuyển <span class="required">*</span></label>
                        <input type="date" v-model="masterData.postDate" />
                    </div>
                    <div class="form-row">
                        <label>Người vận chuyển</label>
                        <input type="text" v-model="masterData.transporter" placeholder="Họ tên người chở hàng..." />
                    </div>
                </div>
            </div>

            <div v-if="isSameWarehouse" class="alert-box error-alert mt-4">
                <i class="fas fa-exclamation-circle"></i> Lỗi: Kho xuất và Kho nhận không được trùng nhau!
            </div>
        </div>

        <div class="form-section detail-section">
            <h3 class="group-title text-green-600">Danh sách hàng hóa điều chuyển</h3>

            <div class="table-responsive">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;" class="text-center">#</th>
                            <th style="width: 150px;">Mã hàng</th>
                            <th>Tên hàng</th>
                            <th style="width: 100px;">ĐVT</th>
                            <th style="width: 150px;" class="text-right">Tồn tại Kho Xuất</th>
                            <th style="width: 150px;" class="text-right">SL Chuyển</th>
                            <th style="width: 60px;" class="text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in detailRows" :key="row.id" :class="{ 'row-error': row.error }">
                            <td class="text-center text-gray-500">{{ index + 1 }}</td>
                            <td>
                                <input type="text" v-model="row.itemCode" @blur="fetchItemData(index)"
                                    class="cell-input uppercase font-medium" placeholder="Mã HH..." />
                            </td>
                            <td>
                                <input type="text" v-model="row.itemName" class="cell-input bg-gray-50" readonly
                                    tabindex="-1" />
                            </td>
                            <td>
                                <input type="text" v-model="row.unit" class="cell-input bg-gray-50 text-center" readonly
                                    tabindex="-1" />
                            </td>
                            <td>
                                <div class="cell-input bg-gray-50 text-right flex items-center justify-end font-semibold text-green-600"
                                    readonly>
                                    {{ row.sourceStock !== null ? row.sourceStock : '-' }}
                                </div>
                            </td>
                            <td>
                                <input type="number" v-model="row.quantity" @input="validateRow(index)"
                                    class="cell-input text-right font-bold" :class="{ 'text-red-600': row.error }"
                                    min="0" />
                            </td>
                            <td class="text-center">
                                <button class="btn-delete-row" @click="removeRow(index)" title="Xóa dòng này">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="hasStockError" class="alert-box error-alert mt-4">
                    <i class="fas fa-exclamation-triangle"></i> Lỗi: Có mặt hàng đang chuyển vượt quá số lượng tồn tại
                    "Kho Xuất".
                </div>
            </div>

            <div class="detail-actions-summary">
                <button class="btn-add-row" @click="addRow">
                    <i class="fas fa-plus"></i> Thêm dòng
                </button>

                <div class="summary-box">
                    <div class="summary-item">
                        <span>Tổng số lượng chuyển:</span>
                        <span class="font-bold text-lg text-green-700">{{ totalQuantity }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const today = new Date().toISOString().split('T')[0]

// --- GIẢ LẬP DB (Mock Data) ---
const itemCatalog = {
    'IP15': { name: 'iPhone 15 Pro Max', unit: 'Cái' },
    'MACM3': { name: 'MacBook Pro M3', unit: 'Cái' }
}
// Giả lập tồn kho theo Từng Kho
const inventoryDB = {
    'KHO_TONG': { 'IP15': 50, 'MACM3': 20 },
    'KHO_CH': { 'IP15': 2, 'MACM3': 0 }
}

const masterData = reactive({
    fromWarehouse: 'KHO_TONG',
    toWarehouse: '',
    description: 'Bổ sung hàng cho chi nhánh',
    voucherNumber: 'CK2604-001',
    postDate: today,
    transporter: ''
})

const detailRows = ref([
    { id: Date.now(), itemCode: '', itemName: '', unit: '', sourceStock: null, quantity: 0, error: false }
])

// --- LOGIC KIỂM TRA ---
const isSameWarehouse = computed(() => {
    return masterData.fromWarehouse && masterData.toWarehouse && masterData.fromWarehouse === masterData.toWarehouse
})

const hasStockError = computed(() => detailRows.value.some(r => r.error))
const totalQuantity = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.quantity || 0), 0))

// Lấy thông tin hàng và số tồn tại Kho Xuất
const fetchItemData = (index) => {
    const row = detailRows.value[index]
    if (!row.itemCode) return

    const code = row.itemCode.toUpperCase()
    const itemInfo = itemCatalog[code]

    if (itemInfo) {
        row.itemName = itemInfo.name
        row.unit = itemInfo.unit

        // Tìm tồn kho ở Kho Xuất
        if (masterData.fromWarehouse) {
            row.sourceStock = inventoryDB[masterData.fromWarehouse][code] || 0
        } else {
            row.sourceStock = null
        }

        validateRow(index)
    } else {
        row.itemName = 'Mã không hợp lệ!'
        row.unit = ''
        row.sourceStock = null
    }
}

const validateRow = (index) => {
    const row = detailRows.value[index]
    if (row.sourceStock !== null && Number(row.quantity) > row.sourceStock) {
        row.error = true
    } else {
        row.error = false
    }
}

// Chạy lại check nếu người dùng bất ngờ đổi Kho Xuất
const revalidateAllRows = () => {
    detailRows.value.forEach((row, idx) => {
        fetchItemData(idx)
    })
}

const addRow = () => {
    detailRows.value.push({ id: Date.now(), itemCode: '', itemName: '', unit: '', sourceStock: null, quantity: 0, error: false })
}

const removeRow = (index) => {
    if (detailRows.value.length === 1) return
    detailRows.value.splice(index, 1)
}

const goBack = () => router.push({ name: 'InventoryDashboard' })

const saveVoucher = () => {
    if (!masterData.fromWarehouse || !masterData.toWarehouse) {
        return alert('Vui lòng chọn đầy đủ Kho Xuất và Kho Nhận!')
    }
    if (isSameWarehouse.value) {
        return alert('Kho xuất và nhận không được trùng nhau!')
    }
    if (hasStockError.value) {
        return alert('Có mặt hàng chuyển vượt quá số lượng tồn kho. Không thể lưu!')
    }
    if (totalQuantity.value === 0) {
        return alert('Bạn chưa nhập số lượng chuyển!')
    }

    alert('Đã tạo Phiếu Chuyển Kho thành công!\nHệ thống tự động: Trừ kho nguồn & Cộng kho đích.')
    goBack()
}
</script>

<style scoped>
.inventory-form-container {
    padding: 24px;
    background-color: #f8f9fc;
    min-height: 100vh;
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

.btn-primary {
    background: #16a34a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
}

.btn-primary:hover {
    background: #15803d;
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
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
}

.section-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
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
    border-color: #16a34a;
}

.required {
    color: #dc2626;
}

.alert-box {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
}

.error-alert {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
}

.mt-4 {
    margin-top: 16px;
}

/* Bảng chi tiết */
.detail-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
}

.detail-table th {
    background: #f0fdf4;
    padding: 12px 8px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #166534;
    border: 1px solid #e5e7eb;
}

.detail-table td {
    border: 1px solid #e5e7eb;
    padding: 0;
}

.row-error td {
    background-color: #fef2f2 !important;
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
    background: #dcfce3;
}

.uppercase {
    text-transform: uppercase;
}

.bg-gray-50 {
    background-color: #f9fafb;
    color: #6b7280;
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

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
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

.detail-actions-summary {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    align-items: flex-start;
}

.btn-add-row {
    background: transparent;
    border: 1px dashed #16a34a;
    color: #16a34a;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.btn-add-row:hover {
    background: #f0fdf4;
}

.summary-box {
    background: #f9fafb;
    padding: 16px 24px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    min-width: 250px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>