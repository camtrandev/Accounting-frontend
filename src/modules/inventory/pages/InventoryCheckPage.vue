<template>
    <div class="inventory-form-container">
        <div class="form-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack"><i class="fas fa-arrow-left"></i> Quay lại</button>
                <h2 class="page-title">Phiếu Kiểm Kê Kho</h2>
            </div>
            <div class="header-right">
                <button class="btn-outline">Lưu nháp</button>
                <button class="btn-primary" @click="processAdjustment">
                    <i class="fas fa-check-double"></i> Cân bằng kho (Xử lý chênh lệch)
                </button>
            </div>
        </div>

        <div class="form-section">
            <div class="section-grid">
                <div class="info-group">
                    <div class="form-row">
                        <label>Kho kiểm kê <span class="required">*</span></label>
                        <select v-model="masterData.warehouse" @change="loadSystemStock"
                            class="font-medium text-teal-700">
                            <option value="">-- Chọn kho cần kiểm kê --</option>
                            <option value="KHO_TONG">Kho Tổng (Hà Nội)</option>
                            <option value="KHO_CH">Kho Cửa Hàng (Cầu Giấy)</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Mục đích</label>
                        <input type="text" v-model="masterData.description"
                            placeholder="Kiểm kê định kỳ tháng 4/2026..." />
                    </div>
                </div>
                <div class="info-group">
                    <div class="form-row">
                        <label>Ngày kiểm kê</label>
                        <input type="date" v-model="masterData.checkDate" />
                    </div>
                    <div class="form-row">
                        <label>Người kiểm kê</label>
                        <input type="text" v-model="masterData.checker" placeholder="Tên nhân viên..." />
                    </div>
                </div>
            </div>
        </div>

        <div class="form-section detail-section">
            <h3 class="group-title text-teal-600">Chi tiết đối chiếu</h3>

            <div class="table-responsive">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;" class="text-center">#</th>
                            <th style="width: 120px;">Mã hàng</th>
                            <th>Tên hàng</th>
                            <th style="width: 80px;">ĐVT</th>
                            <th style="width: 120px;" class="text-right bg-gray-100">Tồn sổ sách</th>
                            <th style="width: 150px;" class="text-right text-teal-700">Tồn thực tế đếm được</th>
                            <th style="width: 120px;" class="text-right">Chênh lệch</th>
                            <th style="width: 120px;" class="text-center">Kết luận</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="detailRows.length === 0">
                            <td colspan="8" class="text-center py-4 text-gray-500">Vui lòng chọn Kho để tải dữ liệu tồn
                                kho.</td>
                        </tr>
                        <tr v-for="(row, index) in detailRows" :key="row.itemCode" :class="getRowClass(row)">
                            <td class="text-center text-gray-500">{{ index + 1 }}</td>
                            <td class="font-medium">{{ row.itemCode }}</td>
                            <td>{{ row.itemName }}</td>
                            <td>{{ row.unit }}</td>
                            <td class="text-right font-semibold bg-gray-50">{{ row.systemStock }}</td>

                            <td>
                                <input type="number" v-model="row.actualStock" @input="calculateDiff(row)"
                                    class="cell-input text-right font-bold text-teal-700" min="0" />
                            </td>

                            <td class="text-right font-bold" :class="getDiffColor(row.diff)">
                                {{ row.diff > 0 ? '+' + row.diff : row.diff }}
                            </td>
                            <td class="text-center">
                                <span class="badge" :class="getDiffBadge(row.diff)">
                                    {{ row.diff === 0 ? 'Khớp' : (row.diff > 0 ? 'Thừa' : 'Thiếu') }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const today = new Date().toISOString().split('T')[0]

const masterData = reactive({
    warehouse: '',
    description: 'Kiểm kê cuối tháng',
    checkDate: today,
    checker: ''
})

const detailRows = ref([])

// Giả lập gọi API lấy tồn kho khi chọn kho
const loadSystemStock = () => {
    if (!masterData.warehouse) {
        detailRows.value = []
        return
    }
    // Data giả lập từ DB
    detailRows.value = [
        { itemCode: 'IP15', itemName: 'iPhone 15 Pro Max', unit: 'Cái', systemStock: 12, actualStock: 12, diff: 0 },
        { itemCode: 'MACM3', itemName: 'MacBook Pro M3', unit: 'Cái', systemStock: 5, actualStock: 4, diff: -1 }, // Mất 1 cái
        { itemCode: 'AIRP', itemName: 'AirPods Pro 2', unit: 'Cái', systemStock: 20, actualStock: 22, diff: 2 }  // Dư 2 cái
    ]
}

const calculateDiff = (row) => {
    row.diff = (row.actualStock === '' ? 0 : Number(row.actualStock)) - row.systemStock
}

// Giao diện màu sắc
const getDiffColor = (diff) => {
    if (diff > 0) return 'text-blue-600'
    if (diff < 0) return 'text-red-600'
    return 'text-gray-500'
}

const getDiffBadge = (diff) => {
    if (diff > 0) return 'bg-blue-100 text-blue-700'
    if (diff < 0) return 'bg-red-100 text-red-700'
    return 'bg-green-100 text-green-700'
}

const getRowClass = (row) => {
    if (row.diff > 0) return 'bg-blue-50/30'
    if (row.diff < 0) return 'bg-red-50/30'
    return ''
}

const goBack = () => router.push({ name: 'InventoryDashboard' })

const processAdjustment = () => {
    const hasDiff = detailRows.value.some(r => r.diff !== 0)
    if (hasDiff) {
        alert('Hệ thống sẽ tự động tạo:\n- 1 Phiếu Xuất Kho cho các mặt hàng bị THIẾU.\n- 1 Phiếu Nhập Kho cho các mặt hàng bị THỪA.\n\nSổ sách đã được cân bằng với thực tế!')
    } else {
        alert('Kho khớp 100%, không cần điều chỉnh!')
    }
}
</script>

<style scoped>
/* Dùng chung style cơ bản của form Nhập/Xuất */
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
    background: #0d9488;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
}

.btn-primary:hover {
    background: #0f766e;
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
    border-color: #0d9488;
}

.detail-table {
    width: 100%;
    border-collapse: collapse;
}

.detail-table th,
.detail-table td {
    border: 1px solid #e5e7eb;
    padding: 10px;
    font-size: 14px;
}

.detail-table th {
    background: #f9fafb;
    font-weight: 600;
}

.cell-input {
    width: 100%;
    height: 36px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 0 8px;
    outline: none;
}

.cell-input:focus {
    border-color: #0d9488;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
}

.badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.py-4 {
    padding-top: 16px;
    padding-bottom: 16px;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}
</style>