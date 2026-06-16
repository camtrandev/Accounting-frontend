<template>
    <div class="issue-form-container">
        <div class="form-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack">
                    <i class="fas fa-arrow-left"></i> Quay lại
                </button>
                <h2 class="page-title">{{ isEditMode ? 'Cập nhật Phiếu Xuất Kho' : 'Thêm mới Phiếu Xuất Kho' }}</h2>
            </div>
            <div class="header-right">
                <button class="btn-outline" @click="resetForm">Hủy bỏ</button>
                <button class="btn-primary" @click="saveVoucher">
                    <i class="fas fa-save"></i> Lưu chứng từ
                </button>
            </div>
        </div>

        <div class="form-section">
            <div class="section-grid">
                <div class="info-group">
                    <h3 class="group-title">Thông tin chung</h3>

                    <div class="form-row">
                        <label>Lý do xuất <span class="required">*</span></label>
                        <select v-model="masterData.reason" class="cell-input w-full font-medium text-blue-600">
                            <option value="sales">Xuất bán hàng</option>
                            <option value="internal">Xuất tiêu dùng nội bộ</option>
                            <option value="destroy">Xuất hủy hàng hỏng</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <label>Kho xuất <span class="required">*</span></label>
                        <select v-model="masterData.warehouseId" class="cell-input w-full" @change="onWarehouseChange">
                            <option value="0" disabled>-- Chọn kho xuất --</option>
                            <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                                {{ wh.warehouse_code || wh.warehouseCode }} - {{ wh.warehouse_name || wh.warehouseName
                                }}
                            </option>
                        </select>
                    </div>

                    <div class="form-row">
                        <label>Khách hàng nhận <span class="required">*</span></label>
                        <select v-model="masterData.partnerId" class="cell-input w-full">
                            <option value="0" disabled>-- Chọn khách hàng nhận --</option>
                            <option v-for="customer in customersList" :key="customer.id" :value="customer.id">
                                {{ customer.partnerCode }} - {{ customer.partnerName }}
                            </option>
                        </select>
                    </div>

                    <div class="form-row">
                        <label>Diễn giải</label>
                        <input type="text" v-model="masterData.description" placeholder="Lý do xuất kho..." />
                    </div>
                </div>

                <div class="info-group">
                    <h3 class="group-title">Chứng từ</h3>
                    <div class="form-row">
                        <label>Số chứng từ <span class="required">*</span></label>
                        <input type="text" v-model="masterData.voucherNumber" class="font-bold text-orange-600"
                            readonly />
                    </div>
                    <div class="form-row">
                        <label>Ngày hạch toán <span class="required">*</span></label>
                        <input type="date" v-model="masterData.postingDate" />
                    </div>
                    <div class="form-row">
                        <label>Ngày chứng từ <span class="required">*</span></label>
                        <input type="date" v-model="masterData.voucherDate" />
                    </div>
                </div>
            </div>
        </div>

        <div class="form-section detail-section">
            <div class="detail-section-header">
                <h3 class="group-title no-border">Chi tiết hàng hóa</h3>
                <div class="header-actions-right">
                    <button class="btn-import-excel" @click="isExcelModalOpen = true">
                        <i class="fas fa-file-excel fa-lg"></i> Nhập từ Excel
                    </button>
                </div>
            </div>

            <ExcelImportModal :isOpen="isExcelModalOpen" @close="isExcelModalOpen = false"
                @import-success="handleExcelDataImported" />

            <div class="table-responsive">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;" class="text-center">#</th>
                            <th style="width: 150px;">Mã hàng</th>
                            <th>Tên hàng</th>
                            <th style="width: 80px;">ĐVT</th>
                            <th style="width: 100px;" class="text-right">Tồn kho</th>
                            <th style="width: 120px;" class="text-right">SL Xuất</th>
                            <th style="width: 150px;" class="text-right">Đơn giá bán</th>
                            <th style="width: 180px;" class="text-right">Thành tiền</th>
                            <th style="width: 60px;" class="text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in detailRows" :key="row.id" :class="{ 'bg-red-50': row.error }">
                            <td class="text-center text-gray-500">{{ index + 1 }}</td>

                            <td>
                                <select v-model="row.itemId" @change="onItemChange(index)"
                                    class="cell-input uppercase font-medium">
                                    <option value="0" disabled>-- Chọn mã --</option>
                                    <option v-for="item in itemsList" :key="item.id" :value="item.id">
                                        {{ item.itemCode }}
                                    </option>
                                </select>
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
                                <div class="cell-input bg-gray-50 text-right font-bold text-green-600">
                                    {{ row.inStock !== null ? row.inStock : '-' }}
                                </div>
                            </td>

                            <td>
                                <input type="number" v-model="row.quantity" @input="validateRow(index)"
                                    class="cell-input text-right" :class="{ 'text-red-600 font-bold': row.error }"
                                    min="0" />
                            </td>

                            <td>
                                <input type="number" v-model="row.price" @input="validateRow(index)"
                                    class="cell-input text-right" min="0" />
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

                <div v-if="hasError" class="mt-3 text-red-600 font-medium px-4">
                    <i class="fas fa-exclamation-triangle"></i> Cảnh báo: Có dòng hàng hóa đang xuất vượt quá số lượng
                    tồn kho khả dụng!
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router' // 👉 Thêm useRoute
import { useInventoryStore } from '../store/inventory.store'
import inventoryApi from '../service/inventory.api'
import ExcelImportModal from '../components/ExcelImportModal.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute() // 👉 Khai báo route
const inventoryStore = useInventoryStore()
const toast = useToast()

const isExcelModalOpen = ref(false)

// 👉 BIẾN NHẬN DIỆN CHẾ ĐỘ SỬA
const isEditMode = computed(() => !!route.query.id);
const editVoucherId = computed(() => route.query.id);

// BIẾN LƯU DỮ LIỆU DANH MỤC
const warehouses = computed(() => inventoryStore.warehouses)
const itemsList = computed(() => inventoryStore.items)
const customersList = computed(() => inventoryStore.customers)

// Lọc Đối tác: Nếu lý do là Xuất bán thì chỉ hiện Khách hàng (partnerType = 1)
const partners = computed(() => {
    if (masterData.reason === 'sales') {
        return inventoryStore.partners.filter(p => p.partnerType === 1);
    }
    return inventoryStore.partners;
})

// 0. HÀM TẠO MÃ CHỨNG TỪ (Đổi thành XK)
const generateVoucherNumber = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `XK${dd}${mm}${yy}-${randomNum}`;
};

// 1. Dữ liệu Master
const today = new Date().toISOString().split('T')[0]
const masterData = reactive({
    reason: 'sales',
    partnerId: 0,
    warehouseId: 0,
    description: 'Xuất bán hàng hóa',
    voucherNumber: generateVoucherNumber(),
    postingDate: today,
    voucherDate: today
})

// Tự động nhảy diễn giải khi đổi lý do
watch(() => masterData.reason, (newReason) => {
    if (newReason === 'sales') masterData.description = 'Xuất bán hàng hóa'
    else if (newReason === 'internal') masterData.description = 'Xuất sử dụng nội bộ'
    else masterData.description = 'Xuất hủy hàng hỏng'
    masterData.partnerId = 0; // Reset lại ô chọn đối tác
})

// Cập nhật lại tồn kho nếu người dùng đổi Kho xuất ở trên form Master
const onWarehouseChange = () => {
    detailRows.value.forEach((row, index) => {
        if (row.itemId !== 0) fetchRealTimeStock(index);
    });
}

// 2. Dữ liệu Detail (Thêm inStock và error)
const detailRows = ref([
    { id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: 'Cái', inStock: null, quantity: 0, price: 0, amount: 0, error: false }
])

// --- FETCH DATA TỪ API KHI LOAD TRANG (👉 ĐÃ SỬA CẤU TRÚC LẤY DỮ LIỆU API) ---
onMounted(async () => {
    try {
        await inventoryStore.fetchMetadata();

        // NẾU LÀ CHẾ ĐỘ SỬA: Lấy dữ liệu chứng từ cũ từ API
        if (isEditMode.value) {
            toast.info("Đang tải dữ liệu chứng từ...");
            const res = await inventoryStore.getDocumentById(editVoucherId.value);
            const actualData = res.data;

            if (actualData && actualData.document) {
                // Đổ dữ liệu vào Master
                masterData.voucherNumber = actualData.document.documentNo;
                masterData.partnerId = actualData.document.partnerId || 0;
                masterData.warehouseId = actualData.document.warehouseId || 0;
                masterData.description = actualData.document.description || '';
                
                const docDate = actualData.document.documentDate ? actualData.document.documentDate.split('T')[0] : today;
                const postDate = actualData.document.postingDate ? actualData.document.postingDate.split('T')[0] : today;
                masterData.voucherDate = docDate;
                masterData.postingDate = postDate;

                // Đổ dữ liệu vào Lines
                if (actualData.lines && actualData.lines.length > 0) {
                    detailRows.value = actualData.lines.map(line => ({
                        id: Date.now() + Math.random(),
                        itemId: line.itemId || 0,
                        itemCode: line.itemCode || '',
                        itemName: line.itemName || line.description || '',
                        unit: line.unit || 'Cái',
                        inStock: null, // Đặt null tạm, sẽ fetch ngay sau vòng lặp này
                        quantity: line.quantity || 0,
                        price: line.unitPrice || 0,
                        amount: (line.quantity || 0) * (line.unitPrice || 0),
                        error: false
                    }));

                    // Lặp kiểm tra lại tồn kho thực tế cho tất cả các dòng vừa load ra
                    for (let i = 0; i < detailRows.value.length; i++) {
                        if (detailRows.value[i].itemId !== 0) {
                            await fetchRealTimeStock(i);
                        }
                    }
                }
            } else {
                toast.error("Không tìm thấy dữ liệu chi tiết của chứng từ!");
            }
        }
    } catch (error) {
        toast.error("Không thể tải dữ liệu. Vui lòng tải lại trang!");
        console.error("Lỗi khi tải dữ liệu form:", error);
    }
})

// 3. XỬ LÝ CHỌN MÃ HÀNG VÀ KIỂM TRA TỒN KHO
const onItemChange = async (index) => {
    const row = detailRows.value[index];
    const selectedItem = itemsList.value.find(i => i.id === row.itemId);

    if (selectedItem) {
        row.itemCode = selectedItem.itemCode;
        row.itemName = selectedItem.itemName;
        row.unit = selectedItem.unit || 'Cái';
        // Nếu là xuất bán thì tự động gợi ý giá bán mặc định, nếu không thì = 0
        row.price = masterData.reason === 'sales' ? (selectedItem.defaultPrice || 0) : 0;

        // Check tồn kho
        await fetchRealTimeStock(index);
    }
}

const fetchRealTimeStock = async (index) => {
    const row = detailRows.value[index];
    if (masterData.warehouseId === 0) {
        toast.warning("Vui lòng chọn Kho xuất trước khi chọn mã hàng!");
        row.inStock = 0;
        return;
    }

    try {
        // Gọi API checkStock của bạn (truyền itemId và warehouseId)
        const response = await inventoryApi.checkStock(row.itemId, masterData.warehouseId);
        row.inStock = response.data !== undefined ? response.data : 0;
        validateRow(index); // Tính toán lại xem có bị xuất lố không
    } catch (error) {
        console.error("Lỗi lấy tồn kho:", error);
        row.inStock = 0;
        validateRow(index);
    }
}

// 4. IMPORT EXCEL DÀNH CHO XUẤT KHO
const handleExcelDataImported = async (excelData) => {
    const missingCodes = [];

    const mappedRows = excelData.map(row => {
        const code = (row['Mã hàng'] || '').toString().trim();
        const foundItem = itemsList.value.find(i => i.itemCode === code);

        if (!foundItem && code !== '') missingCodes.push(code);

        return {
            id: Date.now() + Math.random(),
            itemId: foundItem ? foundItem.id : 0,
            itemCode: code,
            itemName: row['Tên hàng'] || (foundItem ? foundItem.itemName : ''),
            unit: row['ĐVT'] || 'Cái',
            inStock: null,
            quantity: Number(row['Số lượng']) || 0,
            price: Number(row['Đơn giá']) || 0,
            amount: (Number(row['Số lượng']) || 0) * (Number(row['Đơn giá']) || 0),
            error: false
        };
    })

    detailRows.value = mappedRows;

    // Lặp lấy tồn kho cho toàn bộ danh sách vừa import
    for (let i = 0; i < detailRows.value.length; i++) {
        if (detailRows.value[i].itemId !== 0) {
            await fetchRealTimeStock(i);
        }
    }

    if (missingCodes.length > 0) {
        toast.warning(`Cảnh báo: Có ${missingCodes.length} mã hàng chưa tồn tại (${missingCodes.join(', ')}). Vui lòng tạo mã này trước!`, { timeout: 8000 });
    } else {
        toast.success(`Đã tải và kiểm tra tồn kho thành công ${mappedRows.length} dòng từ Excel!`);
    }
}

// 5. CÁC HÀM XỬ LÝ LƯỚI & TÍNH TOÁN
const validateRow = (index) => {
    const row = detailRows.value[index]
    row.amount = (row.quantity || 0) * (row.price || 0)

    // Bật cờ lỗi đỏ nếu Xuất > Tồn kho khả dụng
    if (row.inStock !== null && row.quantity > row.inStock) {
        row.error = true;
    } else {
        row.error = false;
    }
}

const addRow = () => {
    detailRows.value.push({ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: 'Cái', inStock: null, quantity: 0, price: 0, amount: 0, error: false })
}

const removeRow = (index) => {
    if (detailRows.value.length === 1) {
        toast.warning('Phiếu xuất phải có ít nhất 1 dòng hàng hóa!');
        return
    }
    detailRows.value.splice(index, 1)
}

// Tính tổng và bắt lỗi toàn form
const hasError = computed(() => detailRows.value.some(row => row.error))
const totalQuantity = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.quantity || 0), 0))
const totalAmount = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0))

// 6. Utils & Navigation
const formatCurrency = (value) => {
    if (!value) return '0'
    return new Intl.NumberFormat('vi-VN').format(value)
}

const goBack = () => router.push({ name: 'InventoryDashboard' })

const resetForm = () => {
    masterData.partnerId = 0;
    masterData.warehouseId = 0;
    masterData.description = 'Xuất bán hàng hóa';
    masterData.voucherNumber = generateVoucherNumber();
    masterData.postingDate = today;
    masterData.voucherDate = today;

    detailRows.value = [{ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: 'Cái', inStock: null, quantity: 0, price: 0, amount: 0, error: false }];
}

// 7. HÀM LƯU CHỨNG TỪ (👉 ĐÃ SỬA PHÂN LUỒNG TẠO MỚI / CẬP NHẬT)
const saveVoucher = async () => {
    try {
        // Validate Master
        if (!masterData.voucherNumber) return toast.warning('Vui lòng nhập số chứng từ!');
        if (!masterData.warehouseId || masterData.warehouseId === 0) return toast.warning('Vui lòng chọn Kho xuất!');
        if (!masterData.partnerId || masterData.partnerId === 0) return toast.warning('Vui lòng chọn Đối tượng nhận!');
        if (!masterData.postingDate || !masterData.voucherDate) return toast.warning('Vui lòng nhập đủ Ngày chứng từ và Ngày hạch toán!');

        // Chặn luồng nếu có bất kỳ dòng nào bị đỏ (lỗi tồn kho)
        if (hasError.value) {
            toast.error('Không thể lưu! Vui lòng điều chỉnh lại các dòng báo đỏ (xuất quá số lượng tồn khả dụng).');
            return;
        }

        // Validate Detail
        const invalidLines = detailRows.value.filter(row => {
            if (row.quantity <= 0) return true;
            if (row.itemId === 0 && !row.itemName && !row.itemCode) return true;
            return false;
        });

        if (invalidLines.length > 0) {
            toast.warning('Vui lòng kiểm tra lại: Có dòng chưa nhập Số lượng hoặc chưa có Tên mặt hàng!');
            return;
        }

        const safeDateFormat = (dateStr) => `${dateStr}T00:00:00.000Z`;

        // Đóng gói Payload
        const payload = {
            document: {
                documentNo: masterData.voucherNumber,
                docType: "INVENTORY_ISSUE", // Bắt buộc là INVENTORY_ISSUE để nhận dạng xuất kho
                documentDate: safeDateFormat(masterData.voucherDate),
                postingDate: safeDateFormat(masterData.postingDate),
                partnerId: Number(masterData.partnerId),
                warehouseId: Number(masterData.warehouseId),
                description: masterData.description,
                totalAmount: totalAmount.value,
                status: 0 // Đẩy lên với trạng thái Chờ ghi sổ
            },
            lines: detailRows.value.map(row => ({
                itemId: Number(row.itemId) || 0,
                quantity: Number(row.quantity) || 0,
                unitPrice: Number(row.price) || 0,
                taxRate: 0,
                description: row.itemName || row.itemCode
            }))
        }

        // 👉 Phân luồng Gọi API Cập nhật / Thêm mới
        let response;
        if (isEditMode.value) {
            response = await inventoryStore.updateDocument(editVoucherId.value, payload);
        } else {
            response = await inventoryStore.createNewDocument(payload);
        }

        if (response && response.success === true) {
            toast.success(isEditMode.value ? 'Cập nhật chứng từ thành công!' : (response.message || 'Lưu phiếu xuất kho thành công!'));
            
            if (isEditMode.value) {
                goBack(); // Đang sửa thì đá về list
            } else {
                resetForm(); // Thêm mới thì reset form nhập tiếp
            }
            
            await inventoryStore.fetchMetadata();
        } else {
            toast.error(response?.message || 'Có lỗi xảy ra, không thể lưu chứng từ!');
        }

    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Lỗi kết nối đến máy chủ!';
        toast.error(`Giao dịch thất bại: ${errorMsg}`);
    }
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

.detail-section-header {
    display: flex;
    justify-content: space-between;
    /* Đẩy tiêu đề sang trái, nút sang phải */
    align-items: center;
    /* Căn giữa theo chiều dọc */
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
    /* Kéo dài đường gạch dưới ra toàn bộ bề ngang */
    padding-bottom: 8px;
}

/* Xóa border và margin cũ của thẻ h3 vì div bọc ngoài đã đảm nhận rồi */
.group-title.no-border {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

/* Kế thừa lại CSS của nút Excel ở bước trước */
.btn-import-excel {
    background: #10b981;
    border: none;
    color: white;
    padding: 6px 12px;
    font-size: 13px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
}

.btn-import-excel:hover {
    background: #059669;
}
</style>