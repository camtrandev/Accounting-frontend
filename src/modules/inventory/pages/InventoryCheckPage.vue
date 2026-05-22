<template>
    <div class="inventory-form-container">
        <div class="form-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack"><i class="fas fa-arrow-left"></i> Quay lại</button>
                <h2 class="page-title">Phiếu Kiểm Kê Kho</h2>
            </div>
            <div class="header-right">
                <button class="btn-outline" @click="resetForm">Hủy bỏ / Làm mới</button>
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
                            <option value="0" disabled>-- Chọn kho cần kiểm kê --</option>
                            <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                                {{ wh.warehouseCode || wh.warehouse_code }} - {{ wh.warehouseName || wh.warehouse_name
                                }}
                            </option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Số chứng từ <span class="required">*</span></label>
                        <input type="text" v-model="masterData.voucherNumber" class="font-bold text-teal-700 bg-teal-50"
                            readonly />
                    </div>
                    <div class="form-row">
                        <label>Mục đích</label>
                        <input type="text" v-model="masterData.description" placeholder="Ví dụ: Kiểm kê định kỳ..." />
                    </div>
                </div>
                <div class="info-group">
                    <div class="form-row">
                        <label>Ngày kiểm kê <span class="required">*</span></label>
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

            <div class="table-responsive mt-2">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;" class="text-center">#</th>
                            <th style="width: 150px;">Mã hàng</th>
                            <th>Tên hàng</th>
                            <th style="width: 80px;" class="text-center">ĐVT</th>
                            <th style="width: 120px;" class="text-right bg-gray-100">Tồn sổ sách</th>
                            <th style="width: 150px;" class="text-right text-teal-700">Tồn thực tế đếm được</th>
                            <th style="width: 120px;" class="text-right">Chênh lệch</th>
                            <th style="width: 120px;" class="text-center">Kết luận</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="detailRows.length === 0">
                            <td colspan="8" class="text-center py-4 text-gray-500">
                                Vui lòng chọn Kho ở trên để tải danh sách và dữ liệu tồn kho hệ thống.
                            </td>
                        </tr>
                        <tr v-for="(row, index) in detailRows" :key="row.itemId" :class="getRowClass(row)">
                            <td class="text-center text-gray-500">{{ index + 1 }}</td>
                            <td class="font-medium text-gray-700">{{ row.itemCode }}</td>
                            <td class="text-gray-700">{{ row.itemName }}</td>
                            <td class="text-center text-gray-700">{{ row.unit }}</td>
                            <td class="text-right font-semibold bg-gray-50 text-gray-700">{{ row.systemStock }}</td>

                            <td class="bg-white">
                                <input type="number" v-model="row.actualStock" @input="calculateDiff(row)"
                                    class="cell-input text-right font-bold text-teal-700 focus:border-teal-500"
                                    min="0" />
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

            <div class="summary-box mt-4" v-if="detailRows.length > 0">
                <div class="flex gap-6 justify-end p-4 bg-gray-50 border rounded-lg">
                    <div class="text-center">
                        <span class="block text-sm text-gray-500">Tổng mặt hàng</span>
                        <span class="font-bold text-lg">{{ detailRows.length }}</span>
                    </div>
                    <div class="text-center">
                        <span class="block text-sm text-gray-500">Mặt hàng lệch</span>
                        <span class="font-bold text-lg text-red-600">{{detailRows.filter(r => r.diff !== 0).length
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '../store/inventory.store'
import { useToast } from 'vue-toastification'

const router = useRouter()
const inventoryStore = useInventoryStore()
const toast = useToast()

const today = new Date().toISOString().split('T')[0]

// Lấy danh sách kho từ Store
const warehouses = computed(() => inventoryStore.warehouses)

// Tạo mã chứng từ tự động
const generateVoucherNumber = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `KK${dd}${mm}${yy}-${randomNum}`;
};

const masterData = reactive({
    warehouse: 0,
    voucherNumber: generateVoucherNumber(),
    description: 'Kiểm kê định kỳ tháng',
    checkDate: today,
    checker: 'Trần Mạnh Cầm'
})

const detailRows = ref([])

onMounted(async () => {
    try {
        if (warehouses.value.length === 0) {
            await inventoryStore.fetchMetadata();
        }
    } catch (error) {
        toast.error("Không thể tải danh mục kho!");
    }
})

// Gọi API lấy tồn kho thực tế khi chọn kho
const loadSystemStock = async () => {
    const selectedWhId = Number(masterData.warehouse);

    if (!selectedWhId || selectedWhId === 0) {
        detailRows.value = [];
        return;
    }

    try {
        toast.info("Đang đồng bộ dữ liệu tồn kho hệ thống...");

        const response = await inventoryStore.fetchStockByWarehouse(selectedWhId);

        // Bóc tách lấy đúng cái mảng (Array) nằm bên trong
        const availableItems = Array.isArray(response) ? response : (response?.data || []);

        if (!availableItems || availableItems.length === 0) {
            toast.warning("Kho này hiện không có mặt hàng nào!");
            detailRows.value = [];
            return;
        }

        // Đổ dữ liệu lên lưới, gán actualStock mặc định bằng systemStock
        detailRows.value = availableItems.map(item => {
            return {
                itemId: item.itemId,
                itemCode: item.itemCode,
                itemName: item.itemName,
                unit: item.unit || 'Cái',
                systemStock: item.realStock,
                actualStock: item.realStock, // Mặc định là khớp, thủ kho chỉ sửa dòng bị lệch
                diff: 0
            };
        });

        toast.success(`Đã tải lên ${detailRows.value.length} mặt hàng để kiểm kê!`);

    } catch (error) {
        console.error("Lỗi lấy dữ liệu kiểm kê:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu kho!");
    }
}

// Hàm tính chênh lệch tự động khi gõ
const calculateDiff = (row) => {
    const actual = row.actualStock === '' || row.actualStock === null ? 0 : Number(row.actualStock);
    row.diff = actual - row.systemStock;
}

// Màu sắc UX
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
    if (row.diff > 0) return 'bg-blue-50'
    if (row.diff < 0) return 'bg-red-50'
    return ''
}

const goBack = () => router.push({ name: 'InventoryDashboard' })

const resetForm = () => {
    masterData.warehouse = 0;
    masterData.voucherNumber = generateVoucherNumber();
    masterData.description = 'Kiểm kê định kỳ tháng';
    masterData.checkDate = today;
    detailRows.value = [];
}

// XỬ LÝ CÂN BẰNG KHO (Chuẩn Kế Toán)
const processAdjustment = async () => {
    if (!masterData.warehouse || masterData.warehouse === 0) {
        return toast.warning('Vui lòng chọn Kho kiểm kê!');
    }

    // Bóc tách mảng hàng Thừa và hàng Thiếu
    const surplusLines = detailRows.value.filter(r => r.diff > 0); // Thừa -> Cần tạo Phiếu Nhập
    const deficitLines = detailRows.value.filter(r => r.diff < 0); // Thiếu -> Cần tạo Phiếu Xuất

    if (surplusLines.length === 0 && deficitLines.length === 0) {
        return toast.info('Kho khớp 100%, không có chênh lệch cần điều chỉnh!');
    }

    const safeDateFormat = (dateStr) => `${dateStr}T00:00:00.000Z`;
    let successCount = 0;

    try {
        // 1. Xử lý tạo Phiếu Nhập Điều Chỉnh (Cho hàng thừa)
        if (surplusLines.length > 0) {
            const receiptPayload = {
                document: {
                    documentNo: `${masterData.voucherNumber}-N`,
                    docType: "RECEIPT", // Hoặc "ADJUSTMENT_RECEIPT" theo định nghĩa DB của bạn
                    documentDate: safeDateFormat(masterData.checkDate),
                    postingDate: safeDateFormat(masterData.checkDate),
                    warehouseId: Number(masterData.warehouse),
                    partnerId: null,
                    description: `[Cân bằng kho - THỪA] ${masterData.description} - NV: ${masterData.checker}`,
                    status: 0
                },
                lines: surplusLines.map(row => ({
                    itemId: Number(row.itemId),
                    quantity: Number(row.diff), // Nhập đúng số lượng thừa vào kho
                    unitPrice: 0,
                    taxRate: 0,
                    description: `Điều chỉnh thừa kiểm kê`
                }))
            };
            await inventoryStore.createNewDocument(receiptPayload);
            successCount++;
        }

        // 2. Xử lý tạo Phiếu Xuất Điều Chỉnh (Cho hàng thiếu)
        if (deficitLines.length > 0) {
            const issuePayload = {
                document: {
                    documentNo: `${masterData.voucherNumber}-X`,
                    docType: "SALE", // Hoặc "ADJUSTMENT_ISSUE" theo định nghĩa DB của bạn
                    documentDate: safeDateFormat(masterData.checkDate),
                    postingDate: safeDateFormat(masterData.checkDate),
                    warehouseId: Number(masterData.warehouse),
                    partnerId: null,
                    description: `[Cân bằng kho - THIẾU] ${masterData.description} - NV: ${masterData.checker}`,
                    status: 0
                },
                lines: deficitLines.map(row => ({
                    itemId: Number(row.itemId),
                    quantity: Math.abs(Number(row.diff)), // Trừ đi đúng số lượng thiếu (Lấy trị tuyệt đối)
                    unitPrice: 0,
                    taxRate: 0,
                    description: `Điều chỉnh thiếu kiểm kê`
                }))
            };
            await inventoryStore.createNewDocument(issuePayload);
            successCount++;
        }

        toast.success(`Cân bằng kho thành công! Đã tạo ${successCount} phiếu điều chỉnh.`);
        resetForm();

    } catch (error) {
        console.error("Lỗi khi cân bằng kho:", error);
        toast.error("Có lỗi xảy ra khi tạo phiếu điều chỉnh!");
    }
}
</script>

<style scoped>
/* CSS Đã được tối ưu giữ nguyên bản sắc của bạn */
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
    font-weight: 600;
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
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
}

.required {
    color: #dc2626;
}

.detail-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
    border: 1px solid #d1d5db;
}

.detail-table th,
.detail-table td {
    border: 1px solid #d1d5db;
    padding: 10px;
    font-size: 14px;
}

.detail-table th {
    background: #f0fdfa;
    font-weight: 600;
    color: #0f766e;
}

.cell-input {
    width: 100%;
    height: 38px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 0 8px;
    outline: none;
    transition: all 0.2s;
}

.cell-input:focus {
    border-color: #0d9488;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
    background: #f0fdfa;
}

.badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    display: inline-block;
}

.bg-gray-100 {
    background-color: #f3f4f6;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.bg-white {
    background-color: #ffffff;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.font-medium {
    font-weight: 500;
}

.font-bold {
    font-weight: 700;
}

.mt-2 {
    margin-top: 8px;
}

.mt-4 {
    margin-top: 16px;
}

.py-4 {
    padding-top: 16px;
    padding-bottom: 16px;
}

.flex {
    display: flex;
}

.gap-6 {
    gap: 24px;
}

.justify-end {
    justify-content: flex-end;
}

.p-4 {
    padding: 16px;
}

.border {
    border: 1px solid #e5e7eb;
}

.rounded-lg {
    border-radius: 8px;
}

.block {
    display: block;
}

.text-sm {
    font-size: 14px;
}

.text-lg {
    font-size: 18px;
}
</style>