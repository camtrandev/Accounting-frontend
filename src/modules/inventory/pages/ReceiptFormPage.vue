<template>
  <div class="receipt-form-container">
    <div class="form-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="fas fa-arrow-left"></i> Quay lại
        </button>
        <h2 class="page-title">Thêm mới Phiếu Nhập Kho</h2>
      </div>
      <div class="header-right">
        <button class="btn-outline">Hủy bỏ</button>
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
            <label>Nhà cung cấp</label>
            <div class="input-with-icon">
              <input type="text" v-model="masterData.vendor" placeholder="Chọn hoặc nhập tên nhà cung cấp..." />
              <i class="fas fa-search"></i>
            </div>
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
            <input type="text" v-model="masterData.voucherNumber" class="font-bold text-blue-600" />
          </div>
          <div class="form-row">
            <label>Ngày hạch toán <span class="required">*</span></label>
            <input type="date" v-model="masterData.postDate" />
          </div>
          <div class="form-row">
            <label>Ngày chứng từ <span class="required">*</span></label>
            <input type="date" v-model="masterData.voucherDate" />
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
              <th>Tên hàng</th>
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
                <select v-model="row.unit" class="cell-input">
                  <option value="Cái">Cái</option>
                  <option value="Hộp">Hộp</option>
                  <option value="Thùng">Thùng</option>
                  <option value="Kg">Kg</option>
                </select>
              </td>
              <td>
                <input type="number" v-model="row.quantity" @input="calculateAmount(index)" class="cell-input text-right" min="0" />
              </td>
              <td>
                <input type="number" v-model="row.price" @input="calculateAmount(index)" class="cell-input text-right" min="0" />
              </td>
              <td>
                <input type="text" :value="formatCurrency(row.amount)" class="cell-input text-right font-semibold text-blue-600 bg-gray-50" readonly />
              </td>
              <td class="text-center">
                <button class="btn-delete-row" @click="removeRow(index)" title="Xóa dòng này">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. Dữ liệu Master (Thông tin chung)
const today = new Date().toISOString().split('T')[0]
const masterData = reactive({
  vendor: '',
  deliverer: '',
  description: 'Nhập kho mua hàng',
  voucherNumber: 'NK2604-002', // Thường sẽ call API lấy mã tự tăng
  postDate: today,
  voucherDate: today
})

// 2. Dữ liệu Detail (Các dòng hàng hóa)
const detailRows = ref([
  { id: Date.now(), itemCode: '', itemName: '', unit: 'Cái', quantity: 0, price: 0, amount: 0 }
])

// 3. Các hàm xử lý nghiệp vụ Bảng chi tiết
const addRow = () => {
  detailRows.value.push({
    id: Date.now(), // Tạo ID giả để Vue render
    itemCode: '', itemName: '', unit: 'Cái', quantity: 0, price: 0, amount: 0
  })
}

const removeRow = (index) => {
  if (detailRows.value.length === 1) {
    alert('Phiếu nhập phải có ít nhất 1 dòng hàng hóa!')
    return
  }
  detailRows.value.splice(index, 1)
}

const calculateAmount = (index) => {
  const row = detailRows.value[index]
  // Thành tiền = Số lượng * Đơn giá
  row.amount = (row.quantity || 0) * (row.price || 0)
}

// 4. Computed tự động tính tổng (Reactive)
const totalQuantity = computed(() => {
  return detailRows.value.reduce((sum, row) => sum + Number(row.quantity || 0), 0)
})

const totalAmount = computed(() => {
  return detailRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0)
})

// 5. Utils
const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN').format(value)
}
// back lại trang 
const goBack = () => router.push({ name: 'InventoryDashboard' }) 

const saveVoucher = () => {
  const payload = {
    master: masterData,
    details: detailRows.value,
    totalAmount: totalAmount.value
  }
  console.log('Dữ liệu chuẩn bị gửi API:', payload)
  alert('Lưu chứng từ thành công! (Check F12 Console để xem cục data)')
}
</script>

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

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title { margin: 0; font-size: 24px; color: #111827; }

.btn-back {
  background: transparent; border: none; font-size: 14px;
  color: #4b5563; cursor: pointer; display: flex; align-items: center; gap: 8px;
}
.btn-back:hover { color: #7c3aed; }

.btn-primary { background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 10px 20px; cursor: pointer; font-weight: 500;}
.btn-outline { background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 20px; cursor: pointer; }

/* Các khối thẻ Form */
.form-section {
  background: white; border-radius: 12px; padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.group-title { margin-top: 0; margin-bottom: 20px; font-size: 16px; color: #7c3aed; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;}

/* CSS Grid cho thông tin chung */
.section-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
@media (max-width: 1024px) { .section-grid { grid-template-columns: 1fr; gap: 20px; } }

.form-row { display: flex; align-items: center; margin-bottom: 16px; }
.form-row label { width: 140px; font-size: 14px; color: #4b5563; font-weight: 500; }
.form-row input, .form-row select { flex: 1; height: 38px; border: 1px solid #d1d5db; border-radius: 6px; padding: 0 12px; outline: none; }
.form-row input:focus { border-color: #7c3aed; }
.required { color: #dc2626; }

.input-with-icon { position: relative; flex: 1; display: flex; }
.input-with-icon input { width: 100%; }
.input-with-icon i { position: absolute; right: 12px; top: 12px; color: #9ca3af; }

/* Bảng chi tiết */
.detail-table { width: 100%; border-collapse: collapse; min-width: 900px; }
.detail-table th { background: #f3f4f6; padding: 12px 8px; text-align: left; font-size: 13px; font-weight: 600; color: #374151; border: 1px solid #e5e7eb; }
.detail-table td { border: 1px solid #e5e7eb; padding: 0; }

/* Ô input bên trong bảng - Thiết kế Seamless (không viền) */
.cell-input {
  width: 100%; height: 40px; border: none; padding: 0 8px; background: transparent; outline: none; font-size: 14px;
}
.cell-input:focus { background: #fef08a; /* Đổi màu nền vàng nhạt khi focus để dễ nhìn */ }
.uppercase { text-transform: uppercase; }
.bg-gray-50 { background-color: #f9fafb; }

.btn-delete-row { background: transparent; border: none; color: #9ca3af; cursor: pointer; width: 100%; height: 40px; }
.btn-delete-row:hover { color: #dc2626; }

/* Khu vực cộng tiền */
.detail-actions-summary { display: flex; justify-content: space-between; margin-top: 16px; }
.btn-add-row { background: transparent; border: 1px dashed #7c3aed; color: #7c3aed; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
.btn-add-row:hover { background: #ede9fe; }

.summary-box { background: #f9fafb; padding: 16px 24px; border-radius: 8px; border: 1px solid #e5e7eb; min-width: 300px; }
.summary-item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
.total-amount { font-size: 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #d1d5db; }
</style>