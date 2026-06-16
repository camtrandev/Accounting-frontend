<template>
  <div class="receipt-form-container">
    <div class="form-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="fas fa-arrow-left"></i> Quay lại
        </button>
        <h2 class="page-title">{{ isEditMode ? 'Cập nhật Phiếu Nhập Kho' : 'Thêm mới Phiếu Nhập Kho' }}</h2>
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
            <label>Nhà cung cấp <span class="required">*</span></label>
            <select v-model="masterData.partnerId" class="cell-input w-full">
              <option value="0" disabled>-- Chọn nhà cung cấp --</option>
              <option v-for="partner in partners" :key="partner.id" :value="partner.id">
                {{ partner.partnerCode }} - {{ partner.partnerName }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <label>Kho hàng <span class="required">*</span></label>
            <select v-model="masterData.warehouseId" class="cell-input w-full">
              <option value="0" disabled>-- Chọn kho nhập --</option>
              <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                {{ wh.warehouse_code || wh.warehouseCode }} - {{ wh.warehouse_name || wh.warehouseName }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <label>Người giao hàng</label>
            <input type="text" v-model="masterData.deliverer" placeholder="Họ và tên người giao..." />
          </div>
          <div class="form-row">
            <label>Diễn giải</label>
            <input type="text" v-model="masterData.description" placeholder="Lý do nhập kho..." />
          </div>
        </div>

        <div class="info-group">
          <h3 class="group-title">Chứng từ</h3>
          <div class="form-row">
            <label>Số chứng từ <span class="required">*</span></label>
            <input type="text" v-model="masterData.voucherNumber" class="font-bold text-blue-600" readonly />
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
              <th style="width: 250px;">Tên hàng</th>
              <th style="width: 100px;">ĐVT</th>
              <th style="width: 120px;" class="text-right">Số lượng</th>
              <th style="width: 150px;" class="text-right">Đơn giá</th>
              <th style="width: 180px;" class="text-right">Thành tiền</th>
              <th style="width: 60px;" class="text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in detailRows" :key="row.id">
              <td class="text-center text-gray-500">{{ index + 1 }}</td>
              <td>
                <input type="text" v-model="row.itemCode" class="cell-input uppercase" placeholder="Mã HH..." />
              </td>
              <td>
                <input type="text" v-model="row.itemName" class="cell-input" placeholder="Tên hàng hóa..." />
              </td>
              <td>
                <!-- SỬ DỤNG INPUT KẾT HỢP DATALIST -->
                <input type="text" v-model="row.unit" list="unit-list" class="cell-input"
                  placeholder="Chọn hoặc nhập..." />
              </td>
              <td>
                <input type="number" v-model="row.quantity" @input="calculateAmount(index)"
                  class="cell-input text-right" min="0" />
              </td>
              <td>
                <input type="number" v-model="row.price" @input="calculateAmount(index)" class="cell-input text-right"
                  min="0" />
              </td>
              <td>
                <input type="text" :value="formatCurrency(row.amount)"
                  class="cell-input text-right font-semibold text-blue-600 bg-gray-50" readonly />
              </td>
              <td class="text-center">
                <button class="btn-delete-row" @click="removeRow(index)" title="Xóa dòng này">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- DANH SÁCH GỢI Ý CHO ĐƠN VỊ TÍNH -->
        <datalist id="unit-list">
          <option value="Cái"></option>
          <option value="Chiếc"></option>
          <option value="Hộp"></option>
          <option value="Thùng"></option>
          <option value="Kg"></option>
          <option value="Tấn"></option>
          <option value="Lít"></option>
          <option value="Bộ"></option>
        </datalist>
      </div>

      <div class="detail-actions-summary">
        <button class="btn-add-row" @click="addRow">
          <i class="fas fa-plus"></i> Thêm dòng mới
        </button>

        <div class="summary-box">
          <div class="summary-item">
            <span>Tổng số lượng:</span>
            <span class="font-bold">{{ totalQuantity }}</span>
          </div>
          <div class="summary-item total-amount">
            <span>Tổng tiền hàng:</span>
            <span class="font-bold text-red-600">{{ formatCurrency(totalAmount) }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInventoryStore } from '../store/inventory.store'
import ExcelImportModal from '../components/ExcelImportModal.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const inventoryStore = useInventoryStore()
const toast = useToast()

const isExcelModalOpen = ref(false)

// 👉 BIẾN NHẬN DIỆN CHẾ ĐỘ SỬA
const isEditMode = computed(() => !!route.query.id);
const editVoucherId = computed(() => route.query.id);

// BIẾN LƯU DỮ LIỆU DANH MỤC
const partners = computed(() => inventoryStore.partners)
const warehouses = computed(() => inventoryStore.warehouses)
const itemsList = computed(() => inventoryStore.items)

// 0. HÀM TẠO MÃ CHỨNG TỪ TỰ ĐỘNG
const generateVoucherNumber = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `NK${dd}${mm}${yy}-${randomNum}`;
};

// 1. Dữ liệu Master (Thông tin chung)
const today = new Date().toISOString().split('T')[0]
const masterData = reactive({
  partnerId: 0,
  warehouseId: 0,
  deliverer: '',
  description: 'Nhập kho mua hàng',
  voucherNumber: generateVoucherNumber(),
  postingDate: today,
  voucherDate: today
})

// 2. Dữ liệu Detail (Các dòng hàng hóa)
const detailRows = ref([
  { id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: 'Cái', quantity: 0, price: 0, amount: 0 }
])

// --- FETCH DATA TỪ API KHI LOAD TRANG ---
onMounted(async () => {
  try {
    // 1. Luôn tải danh mục kho, đối tác, hàng hóa
    await inventoryStore.fetchMetadata();

    // 2. NẾU LÀ CHẾ ĐỘ SỬA: Lấy dữ liệu chứng từ cũ từ API
    if (isEditMode.value) {
      toast.info("Đang tải dữ liệu chứng từ...");
      const res = await inventoryStore.getDocumentById(editVoucherId.value);

      console.group(`🔍 [Chế độ Sửa] Dữ liệu chứng từ ID: ${editVoucherId.value}`);
      console.log("TOÀN BỘ PAYLOAD TRẢ VỀ:", res);
      console.groupEnd();

      // 👉 SỬA LỖI TẠI ĐÂY: Dữ liệu thực sự nằm trong res.data
      const actualData = res.data;

      if (actualData && actualData.document) {
        // Đổ dữ liệu vào Thông tin chung (Master)
        masterData.voucherNumber = actualData.document.documentNo;
        masterData.partnerId = actualData.document.partnerId || 0;
        masterData.warehouseId = actualData.document.warehouseId || 0;
        masterData.description = actualData.document.description || '';

        const docDate = actualData.document.documentDate ? actualData.document.documentDate.split('T')[0] : today;
        const postDate = actualData.document.postingDate ? actualData.document.postingDate.split('T')[0] : today;
        masterData.voucherDate = docDate;
        masterData.postingDate = postDate;

        // Đổ dữ liệu vào Chi tiết hàng hóa (Lines)
        if (actualData.lines && actualData.lines.length > 0) {
          detailRows.value = actualData.lines.map(line => ({
            id: Date.now() + Math.random(), // id ảo cho v-for
            itemId: line.itemId || 0,
            itemCode: line.itemCode || '',
            itemName: line.itemName || line.description || '',
            unit: line.unit || 'Cái',
            quantity: line.quantity || 0,
            price: line.unitPrice || 0,
            amount: (line.quantity || 0) * (line.unitPrice || 0)
          }));
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

// 3. Hàm nhận dữ liệu từ Component Excel nhả về
const handleExcelDataImported = (excelData) => {
  const missingCodes = [];

  const mappedRows = excelData.map(row => {
    const code = (row['Mã hàng'] || '').toString().trim();
    const foundItem = itemsList.value.find(i => i.itemCode === code);

    if (!foundItem && code !== '') {
      missingCodes.push(code);
    }

    return {
      id: Date.now() + Math.random(),
      itemId: foundItem ? foundItem.id : 0,
      itemCode: code,
      itemName: row['Tên hàng'] || (foundItem ? foundItem.itemName : ''),
      unit: row['ĐVT'] || 'Cái',
      quantity: Number(row['Số lượng']) || 0,
      price: Number(row['Đơn giá']) || 0,
      amount: (Number(row['Số lượng']) || 0) * (Number(row['Đơn giá']) || 0)
    };
  })

  detailRows.value = mappedRows;

  if (missingCodes.length > 0) {
    toast.warning(`Cảnh báo: Có ${missingCodes.length} mã hàng chưa tồn tại trong hệ thống (${missingCodes.join(', ')}). Bạn cần tạo mã này trước khi lưu!`, { timeout: 8000 });
  } else {
    toast.success(`Đã tải thành công ${mappedRows.length} dòng dữ liệu từ Excel!`);
  }
}

// 4. Các hàm xử lý nghiệp vụ Bảng chi tiết
const addRow = () => {
  detailRows.value.push({ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: 'Cái', quantity: 0, price: 0, amount: 0 })
}

const removeRow = (index) => {
  if (detailRows.value.length === 1) {
    toast.warning('Phiếu nhập phải có ít nhất 1 dòng hàng hóa!');
    return
  }
  detailRows.value.splice(index, 1)
}

const calculateAmount = (index) => {
  const row = detailRows.value[index]
  row.amount = (row.quantity || 0) * (row.price || 0)
}

// 5. Computed tự động tính tổng (Reactive)
const totalQuantity = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.quantity || 0), 0))
const totalAmount = computed(() => detailRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0))

// 6. Utils & Form Actions
const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN').format(value)
}

const goBack = () => router.push({ name: 'InventoryDashboard' })

const resetForm = () => {
  masterData.partnerId = 0;
  masterData.warehouseId = 0;
  masterData.deliverer = '';
  masterData.description = 'Nhập kho mua hàng';
  masterData.voucherNumber = generateVoucherNumber();
  masterData.postingDate = today;
  masterData.voucherDate = today;

  detailRows.value = [{ id: Date.now(), itemId: 0, itemCode: '', itemName: '', unit: 'Cái', quantity: 0, price: 0, amount: 0 }];
}

// 7. HÀM LƯU CHỨNG TỪ 
const saveVoucher = async () => {
  try {
    // BƯỚC 1: Validate
    if (!masterData.voucherNumber) {
      toast.warning('Vui lòng nhập số chứng từ!');
      return;
    }
    if (!masterData.partnerId || masterData.partnerId === 0) {
      toast.warning('Vui lòng chọn Nhà cung cấp!');
      return;
    }
    if (!masterData.warehouseId || masterData.warehouseId === 0) {
      toast.warning('Vui lòng chọn Kho hàng!');
      return;
    }
    if (!masterData.postingDate) {
      toast.warning('Vui lòng nhập Ngày hạch toán!');
      return;
    }
    if (!masterData.voucherDate) {
      toast.warning('Vui lòng nhập Ngày chứng từ!');
      return;
    }

    // BƯỚC 2: Validate Chi tiết
    const invalidLines = detailRows.value.filter(row => {
      if (row.quantity <= 0) return true;
      if (row.itemId === 0 && !row.itemName && !row.itemCode) return true;
      return false;
    });

    if (invalidLines.length > 0) {
      toast.warning('Vui lòng kiểm tra lại: Có dòng chưa nhập Số lượng hoặc chưa có Tên mặt hàng!');
      return;
    }

    const safeDateFormat = (dateStr) => {
      return `${dateStr}T00:00:00.000Z`;
    };

    // BƯỚC 3: Đóng gói Payload
    const payload = {
      document: {
        documentNo: masterData.voucherNumber,
        docType: "INVENTORY_RECEIPT",
        documentDate: safeDateFormat(masterData.voucherDate),
        postingDate: safeDateFormat(masterData.postingDate),
        partnerId: Number(masterData.partnerId),
        warehouseId: Number(masterData.warehouseId),
        description: masterData.description,
        totalAmount: totalAmount.value,
        status: 0
      },
      lines: detailRows.value.map(row => ({
        itemId: Number(row.itemId) || 0,
        quantity: Number(row.quantity) || 0,
        unitPrice: Number(row.price) || 0,
        taxRate: 0,
        description: row.itemName || row.itemCode
      }))
    }

    // BƯỚC 4: Phân luồng Gọi API Cập nhật / Thêm mới
    let response;

    if (isEditMode.value) {
      response = await inventoryStore.updateDocument(editVoucherId.value, payload);
    } else {
      response = await inventoryStore.createNewDocument(payload);
    }

    if (response && response.success === true) {
      toast.success(isEditMode.value ? 'Cập nhật chứng từ thành công!' : (response.message || 'Lưu chứng từ mới thành công!'));

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
    const errorMsg = error.response?.data?.message || error.message || 'Lỗi kết nối đến máy chủ!';
    toast.error(`Giao dịch thất bại: ${errorMsg}`);
    console.error('Lỗi khi thực thi lưu chứng từ:', error);
  }
}
</script>

<style scoped>
/* Chèn thêm đoạn CSS sau để Select đẹp hơn */
select.cell-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  appearance: auto;
  /* Hiển thị mũi tên thả xuống */
}
</style>

<style scoped>
.receipt-form-container {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header actions */
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
  color: #7c3aed;
}

.btn-primary {
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
}

.btn-outline {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
}

/* Các khối thẻ Form */
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
  color: #7c3aed;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

/* CSS Grid cho thông tin chung */
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

.form-row input:focus {
  border-color: #7c3aed;
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
}

/* Ô input bên trong bảng - Thiết kế Seamless (không viền) */
.cell-input {
  width: 100%;
  height: 40px;
  border: none;
  padding: 0 8px;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.cell-input:focus {
  background: #fef08a;
  /* Đổi màu nền vàng nhạt khi focus để dễ nhìn */
}

.uppercase {
  text-transform: uppercase;
}

.bg-gray-50 {
  background-color: #f9fafb;
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

/* Khu vực cộng tiền */
.detail-actions-summary {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.btn-add-row {
  background: transparent;
  border: 1px dashed #7c3aed;
  color: #7c3aed;
  padding: 6px 12px;
  /* Giảm padding xuống cho nút thon gọn hơn (cũ là 8px 16px) */
  font-size: 13px;
  /* Thu nhỏ cỡ chữ xuống một chút */
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start;
  /* QUAN TRỌNG: Ngăn nút bị kéo giãn chiều cao bằng với hộp tổng tiền */
}

.btn-add-row:hover {
  background: #ede9fe;
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


/* nhập nhanh excel */

/* Container chứa tiêu đề và nút */
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