<template>
    <div class="inventory-form-container">
        <div class="form-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack"><i class="fas fa-arrow-left"></i> Quay lại</button>
                <h2 class="page-title">{{ isEditMode ? 'Cập nhật Phiếu Chuyển Kho' : 'Thêm mới Phiếu Chuyển Kho Nội Bộ' }}</h2>
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
                    <h3 class="group-title text-green-700 font-bold">Thông tin luân chuyển</h3>

                    <div class="form-row">
                        <label>Từ kho (Xuất) <span class="required">*</span></label>
                        <select v-model="masterData.fromWarehouse" @change="onWarehouseChange"
                            class="font-medium cell-input w-full border-gray-300">
                            <option value="0" disabled>-- Chọn kho xuất --</option>
                            <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                                {{ wh.warehouseCode || wh.warehouse_code }} - {{ wh.warehouseName || wh.warehouse_name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-row">
                        <label>Đến kho (Nhập) <span class="required">*</span></label>
                        <select v-model="masterData.toWarehouse" class="font-medium cell-input w-full border-gray-300">
                            <option value="0" disabled>-- Chọn kho nhận --</option>
                            <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                                {{ wh.warehouseCode || wh.warehouse_code }} - {{ wh.warehouseName || wh.warehouse_name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-row">
                        <label>Diễn giải</label>
                        <input type="text" v-model="masterData.description" class="border-gray-300"
                            placeholder="Lý do điều chuyển..." />
                    </div>
                </div>

                <div class="info-group">
                    <h3 class="group-title text-green-700 font-bold">Chứng từ</h3>
                    <div class="form-row">
                        <label>Số chứng từ <span class="required">*</span></label>
                        <input type="text" v-model="masterData.voucherNumber"
                            class="font-bold text-green-700 bg-green-50 border-green-200" readonly />
                    </div>
                    <div class="form-row">
                        <label>Ngày luân chuyển <span class="required">*</span></label>
                        <input type="date" v-model="masterData.postDate" class="border-gray-300" />
                    </div>
                    <div class="form-row">
                        <label>Người vận chuyển</label>
                        <input type="text" v-model="masterData.transporter" class="border-gray-300"
                            placeholder="Họ tên người chở hàng..." />
                    </div>
                </div>
            </div>

            <div v-if="isSameWarehouse" class="alert-box error-alert mt-4">
                <i class="fas fa-exclamation-circle"></i> Lỗi: Kho xuất và Kho nhận không được trùng nhau!
            </div>
        </div>

        <div class="form-section detail-section">
            <div class="detail-section-header">
                <h3 class="group-title no-border font-bold text-gray-800">Danh sách hàng hóa điều chuyển</h3>

                <div class="header-actions-right">
                    <button class="btn-import-excel" @click="isExcelModalOpen = true">
                        <i class="fas fa-file-excel fa-lg"></i> Nhập từ Excel
                    </button>
                </div>
            </div>

            <ExcelImportModal :isOpen="isExcelModalOpen" @close="isExcelModalOpen = false"
                @import-success="handleExcelDataImported" />

            <div class="table-responsive mt-2">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;" class="text-center">#</th>
                            <th style="width: 250px;">Chọn Hàng Hóa</th>
                            <th>Tên hàng</th>
                            <th style="width: 100px;" class="text-center">ĐVT</th>
                            <th style="width: 150px;" class="text-right">Tồn tại Kho Xuất</th>
                            <th style="width: 150px;" class="text-right">SL Chuyển</th>
                            <th style="width: 50px;" class="text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in detailRows" :key="row.id" :class="{ 'row-error': row.error }">
                            <td class="text-center text-gray-500 bg-gray-50">{{ index + 1 }}</td>

                            <td class="bg-white">
                                <select v-model="row.itemId" @change="onItemChange(index)"
                                    class="cell-input font-medium w-full"
                                    :class="{ 'text-blue-700': row.itemId !== 0, 'text-red-500 font-bold': row.itemId === 0 && row.itemCode }">

                                    <option value="0" disabled>
                                        {{ row.itemCode ? `${row.itemCode} (Không có trong DB)` : '-- Chọn mặt hàng --' }}
                                    </option>

                                    <option v-for="item in itemsList" :key="item.id" :value="item.id">
                                        {{ item.itemCode }}
                                    </option>
                                </select>
                            </td>

                            <td class="bg-white">
                                <input type="text" v-model="row.itemName" class="cell-input text-gray-800"
                                    placeholder="Nhập tên hàng..." readonly tabindex="-1" />
                            </td>

                            <td class="bg-white">
                                <input type="text" v-model="row.unit" class="cell-input text-center text-gray-800"
                                    placeholder="VD: Cái" readonly tabindex="-1" />
                            </td>

                            <td class="bg-gray-100">
                                <input type="text" :value="row.sourceStock !== null ? row.sourceStock : '-'"
                                    class="cell-input bg-transparent text-right font-bold text-green-700" readonly
                                    tabindex="-1" />
                            </td>

                            <td class="bg-white">
                                <input type="number" v-model="row.quantity" @input="validateRow(index)"
                                    class="cell-input text-right font-bold" :class="{ 'text-red-600': row.error }"
                                    min="0" placeholder="0" />
                            </td>

                            <td class="text-center bg-white">
                                <button class="btn-delete-row" @click="removeRow(index)" title="Xóa dòng này">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="hasStockError" class="alert-box error-alert mt-4 inline-block">
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
                        <span class="text-gray-600 font-medium">Tổng số lượng chuyển:</span>
                        <span class="font-bold text-xl text-green-700">{{ totalQuantity }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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

// LẤY DỮ LIỆU TỪ STORE
const warehouses = computed(() => inventoryStore.warehouses)
const itemsList = computed(() => inventoryStore.items)

// 0. HÀM TẠO MÃ TỰ ĐỘNG (Bắt đầu bằng CK)
const generateVoucherNumber = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `CK${dd}${mm}${yy}-${randomNum}`;
};

// 1. DỮ LIỆU MASTER
const today = new Date().toISOString().split('T')[0]
const masterData = reactive({
    fromWarehouse: 0,
    toWarehouse: 0,
    description: 'Bổ sung hàng cho chi nhánh',
    voucherNumber: generateVoucherNumber(),
    postDate: today,
    transporter: ''
})

// 2. DỮ LIỆU DETAIL
const detailRows = ref([
    { id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: '', sourceStock: null, quantity: '', error: false }
])

// --- FETCH DATA TỪ API KHI LOAD TRANG (Bổ sung logic Sửa) ---
onMounted(async () => {
    try {
        await inventoryStore.fetchMetadata();

        // NẾU LÀ CHẾ ĐỘ SỬA: Lấy dữ liệu chứng từ cũ từ API
        if (isEditMode.value) {
            toast.info("Đang tải dữ liệu chứng từ...");
            const res = await inventoryStore.getDocumentById(editVoucherId.value);
            const actualData = res.data;

            console.group(`🔍 [Chế độ Sửa] Dữ liệu chứng từ ID: ${editVoucherId.value}`);
            console.log("TOÀN BỘ PAYLOAD TRẢ VỀ:", actualData);
            console.groupEnd();

            if (actualData && actualData.document) {
                // Đổ dữ liệu vào Master
                masterData.voucherNumber = actualData.document.documentNo;
                masterData.fromWarehouse = actualData.document.warehouseId || 0;
                masterData.toWarehouse = actualData.document.toWarehouseId || 0; // Đổ kho nhận
                
                // Tách Người vận chuyển ra khỏi phần Diễn giải nếu bạn lưu gộp
                // Ví dụ: "[Vận chuyển: Nguyễn Văn A] - Điều chuyển kho"
                let rawDescription = actualData.document.description || '';
                let match = rawDescription.match(/^\[Vận chuyển:\s*(.*?)\]\s*-\s*(.*)$/);
                if (match) {
                    masterData.transporter = match[1] === 'Nội bộ' ? '' : match[1];
                    masterData.description = match[2];
                } else {
                    masterData.description = rawDescription;
                }
                
                const postDate = actualData.document.postingDate ? actualData.document.postingDate.split('T')[0] : today;
                masterData.postDate = postDate;

                // Đổ dữ liệu vào Lines
                if (actualData.lines && actualData.lines.length > 0) {
                    detailRows.value = actualData.lines.map(line => ({
                        id: Date.now() + Math.random(),
                        itemId: line.itemId || 0,
                        itemCode: line.itemCode || '',
                        itemName: line.itemName || line.description || '',
                        unit: line.unit || 'Cái',
                        sourceStock: null, // Sẽ fetch tồn kho thực tế ngay bên dưới
                        quantity: line.quantity || 0,
                        error: false
                    }));

                    // Lặp qua danh sách để lấy tồn kho thời gian thực
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
        toast.error("Không thể tải danh mục. Vui lòng thử lại!");
    }
})

// --- LOGIC KIỂM TRA LỖI FORM CHÍNH ---
const isSameWarehouse = computed(() => {
    return masterData.fromWarehouse !== 0 &&
        masterData.toWarehouse !== 0 &&
        masterData.fromWarehouse === masterData.toWarehouse
})
const hasStockError = computed(() => detailRows.value.some(r => r.error))
const totalQuantity = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.quantity || 0), 0))

// 3. XỬ LÝ CHỌN HÀNG HÓA & GỌI API CHECK TỒN KHO
const onItemChange = async (index) => {
    const row = detailRows.value[index];
    const selectedItem = itemsList.value.find(i => i.id === row.itemId);

    if (selectedItem) {
        row.itemCode = selectedItem.itemCode;
        row.itemName = selectedItem.itemName;
        row.unit = selectedItem.unit || 'Cái';

        await fetchRealTimeStock(index);
    }
}

const fetchRealTimeStock = async (index) => {
    const row = detailRows.value[index];
    if (masterData.fromWarehouse === 0) {
        toast.warning("Vui lòng chọn 'Từ kho (Xuất)' trước khi chọn hàng hóa!");
        row.itemId = 0; // Xóa để ép chọn kho
        row.itemName = '';
        row.unit = '';
        return;
    }

    try {
        const response = await inventoryApi.checkStock(row.itemId, masterData.fromWarehouse);
        row.sourceStock = response.data !== undefined ? response.data : 0;
        validateRow(index);
    } catch (error) {
        row.sourceStock = 0;
        validateRow(index);
    }
}
// Hàm kéo các mặt hàng CÓ TỒN KHO tại Kho xuất
const onWarehouseChange = async () => {
    const selectedWhId = Number(masterData.fromWarehouse);

    if (!selectedWhId || selectedWhId === 0) {
        detailRows.value = [{ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: '', sourceStock: null, quantity: '', error: false }];
        return;
    }

    try {
        toast.info("Đang đồng bộ dữ liệu kho, vui lòng đợi...");
        const response = await inventoryStore.fetchStockByWarehouse(selectedWhId);

        const availableItems = Array.isArray(response) ? response : (response?.data || []);
        
        if (!availableItems || availableItems.length === 0) {
            toast.warning("Kho xuất này hiện trống, không có mặt hàng nào!");
            detailRows.value = [{ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: '', sourceStock: null, quantity: '', error: false }];
            return;
        }

        detailRows.value = availableItems.map(item => {
            return {
                id: Date.now() + Math.random(),
                itemId: item.itemId,
                itemCode: item.itemCode,
                itemName: item.itemName,
                unit: item.unit || 'Cái',
                sourceStock: item.realStock, // Gắn tồn kho thật từ C#
                quantity: '', // Để trống cho nhân viên tự gõ số lượng cần chuyển
                error: false
            };
        });

        toast.success(`Đã tải lên ${detailRows.value.length} mặt hàng từ kho xuất!`);

    } catch (error) {
        console.error("Lỗi khi đồng bộ hàng theo kho:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu kho!");
    }
}


// 5. VALIDATE LƯỚI
const validateRow = (index) => {
    const row = detailRows.value[index]
    if (row.sourceStock !== null && Number(row.quantity) > row.sourceStock) {
        row.error = true
    } else {
        row.error = false
    }
}

const addRow = () => detailRows.value.push({ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: '', sourceStock: null, quantity: '', error: false })
const removeRow = (index) => {
    if (detailRows.value.length === 1) return toast.warning('Phải có ít nhất 1 dòng!');
    detailRows.value.splice(index, 1);
}

const goBack = () => router.push({ name: 'InventoryDashboard' })

const resetForm = () => {
    masterData.fromWarehouse = 0;
    masterData.toWarehouse = 0;
    masterData.description = 'Bổ sung hàng cho chi nhánh';
    masterData.voucherNumber = generateVoucherNumber();
    masterData.postDate = today;
    masterData.transporter = '';
    detailRows.value = [{ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: '', sourceStock: null, quantity: '', error: false }];
}

// 6. GỌI API LƯU PHIẾU CHUYỂN (👉 PHÂN LUỒNG TẠO MỚI/CẬP NHẬT)
const saveVoucher = async () => {
    if (!masterData.voucherNumber) return toast.warning('Vui lòng nhập số chứng từ!');
    if (!masterData.fromWarehouse || masterData.fromWarehouse === 0) return toast.warning('Vui lòng chọn Kho xuất!');
    if (!masterData.toWarehouse || masterData.toWarehouse === 0) return toast.warning('Vui lòng chọn Kho nhận!');
    if (isSameWarehouse.value) return toast.error('Kho xuất và Kho nhận không được trùng nhau!');
    if (!masterData.postDate) return toast.warning('Vui lòng nhập Ngày luân chuyển!');

    if (hasStockError.value) {
        return toast.error('Không thể lưu! Có dòng chuyển vượt quá số lượng tồn kho tại Kho Xuất.');
    }

    const validLines = detailRows.value.filter(row => row.itemId !== 0 && row.quantity > 0);
    if (validLines.length === 0) return toast.warning('Vui lòng kiểm tra lưới: Chưa chọn mặt hàng hoặc Số lượng = 0!');

    const safeDateFormat = (dateStr) => `${dateStr}T00:00:00.000Z`;

    // Đóng gói Payload
    const payload = {
        document: {
            documentNo: masterData.voucherNumber,
            docType: "TRANSFER",
            documentDate: safeDateFormat(masterData.postDate), // Luân chuyển dùng chung 1 ngày
            postingDate: safeDateFormat(masterData.postDate),
            warehouseId: Number(masterData.fromWarehouse), // Kho Xuất

            partnerId: null, 
            toWarehouseId: Number(masterData.toWarehouse), // Kho Nhận

            description: `[Vận chuyển: ${masterData.transporter || 'Nội bộ'}] - ${masterData.description}`,
            totalAmount: 0, // Chuyển kho không sinh giá trị tiền
            status: 0 // Trạng thái Chờ ghi sổ
        },
        lines: validLines.map(row => ({
            itemId: Number(row.itemId),
            quantity: Number(row.quantity),
            unitPrice: 0,
            taxRate: 0,
            description: row.itemName
        }))
    }

    try {
        let response;
        if (isEditMode.value) {
            response = await inventoryStore.updateDocument(editVoucherId.value, payload);
        } else {
            response = await inventoryStore.createNewDocument(payload);
        }

        if (response && response.success === true) {
            toast.success(isEditMode.value ? 'Cập nhật phiếu chuyển kho thành công!' : (response.message || 'Lưu phiếu chuyển kho thành công!'));
            
            if (isEditMode.value) {
                goBack();
            } else {
                resetForm();
            }
            
            await inventoryStore.fetchMetadata();
        } else {
            toast.error(response?.message || 'Có lỗi xảy ra, không thể lưu chứng từ!');
        }
    } catch (error) {
        toast.error('Giao dịch thất bại do lỗi kết nối!');
    }
}

// Bổ sung hàm handleExcelDataImported bị thiếu so với đoạn code trên
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
            sourceStock: null,
            quantity: Number(row['Số lượng']) || 0,
            error: false
        };
    })

    detailRows.value = mappedRows;

    // Lặp lấy tồn kho
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
    font-weight: 600;
}

/* FIX BORDER RÕ RÀNG CHO INPUT MASTER */
.form-row input,
.form-row select {
    flex: 1;
    height: 38px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 0 12px;
    outline: none;
}

.form-row input:focus,
.form-row select:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.1);
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

/* FIX CSS BẢNG: NGĂN CÁCH RÕ RÀNG */
.detail-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
    border: 1px solid #9ca3af;
    /* Viền bảng đậm hơn */
}

.detail-table th {
    background: #f0fdf4;
    padding: 12px 8px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #166534;
    border: 1px solid #9ca3af;
    /* Viền header đậm */
}

/* Ô td nào cũng có viền xám đậm */
.detail-table td {
    border: 1px solid #9ca3af;
    padding: 0;
}

.row-error td {
    border-color: #fca5a5 !important;
}

/* Input chìm gọn vào trong ô td */
.cell-input {
    width: 100%;
    height: 42px;
    border: none;
    padding: 0 12px;
    background: transparent;
    outline: none;
    font-size: 14px;
    box-sizing: border-box;
}

.cell-input:focus:not([readonly]) {
    background: #f0fdf4;
}

/* MÀU NỀN TÁCH BIỆT */
.bg-gray-50 {
    background-color: #f9fafb !important;
}

.bg-gray-100 {
    background-color: #f3f4f6 !important;
}

.bg-white {
    background-color: #ffffff !important;
}

.uppercase {
    text-transform: uppercase;
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
    height: 42px;
}

.btn-delete-row:hover {
    color: #dc2626;
    background: #fef2f2;
}

.detail-actions-summary {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    align-items: flex-start;
}

.btn-add-row {
    background: transparent;
    border: 1px dashed #16a34a;
    color: #16a34a;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.btn-add-row:hover {
    background: #f0fdf4;
}

.summary-box {
    background: #f0fdf4;
    padding: 16px 24px;
    border-radius: 8px;
    border: 1px solid #bbf7d0;
    min-width: 250px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detail-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.group-title.no-border {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.btn-import-excel {
    background: #10b981;
    border: none;
    color: white;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-import-excel:hover {
    background: #059669;
}
</style>