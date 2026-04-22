<template>
  <div>
    <div class="table-responsive">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>Ngày hạch toán</th>
            <th>Số chứng từ</th>
            <th>Loại phiếu</th>
            <th>Diễn giải</th>
            <th class="text-right">Tổng tiền</th>
            <th class="text-center">Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        
        <tbody v-if="isLoading">
          <tr>
            <td colspan="7" class="text-center py-8">
              <span class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...</span>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="items.length === 0">
          <tr>
            <td colspan="7" class="text-center py-8 text-gray-500">
              Không tìm thấy chứng từ nào phù hợp với điều kiện lọc.
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr v-for="item in items" :key="item.id" class="table-row">
            <td>{{ formatDate(item.date) }}</td>
            <td class="font-medium text-blue-600 cursor-pointer" @click="emit('view', item)">
              {{ item.voucherNumber }}
            </td>
            <td>
              <span class="badge" :class="getTypeClass(item.type)">
                {{ getTypeName(item.type) }}
              </span>
            </td>
            <td class="text-gray-600 truncate-text">{{ item.description }}</td>
            <td class="text-right font-semibold">{{ formatCurrency(item.totalAmount) }}</td>
            <td class="text-center">
              <span class="status-dot" :class="item.isPosted ? 'bg-green-500' : 'bg-orange-500'"></span>
              {{ item.isPosted ? 'Đã ghi sổ' : 'Chờ ghi sổ' }}
            </td>
            <td class="text-center actions">
              <button class="action-btn text-blue-600" title="Xem/Sửa" @click="emit('edit', item)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn text-red-600" title="Xóa" @click="emit('delete', item)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-wrapper" v-if="items.length > 0">
      <span class="text-gray-500 text-sm">Hiển thị 1-10 trên tổng số 45 bản ghi</span>
      <div class="page-controls">
        <button class="page-btn disabled" disabled><i class="fas fa-chevron-left"></i></button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Khai báo Props để nhận dữ liệu từ cha
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// Khai báo Emits để báo cho cha biết khi người dùng thao tác
const emit = defineEmits(['view', 'edit', 'delete'])

// Utils: Format tiền tệ (VNĐ)
const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN').format(value)
}

// Utils: Format ngày tháng (dd/mm/yyyy)
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

// Utils: Lấy màu Badge và Tên loại chứng từ
const getTypeClass = (type) => {
  const map = { receipt: 'badge-blue', issue: 'badge-orange', transfer: 'badge-green' }
  return map[type] || 'badge-gray'
}

const getTypeName = (type) => {
  const map = { receipt: 'Nhập kho', issue: 'Xuất kho', transfer: 'Chuyển kho' }
  return map[type] || 'Khác'
}
</script>

<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Chống vỡ layout khi co màn hình */
}

.inventory-table th, .inventory-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.inventory-table th {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  text-align: left;
}

.table-row:hover {
  background-color: #f3f4f6; 
}

/* Tiện ích căn lề */
.text-right { text-align: right; }
.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
.truncate-text { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Trạng thái (Badges) */
.badge {
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
.badge-blue { background-color: #dbeafe; color: #1e40af; }
.badge-orange { background-color: #ffedd5; color: #c2410c; }
.badge-green { background-color: #dcfce3; color: #15803d; }
.badge-gray { background-color: #f3f4f6; color: #374151; }


.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.bg-green-500 { background-color: #22c55e; }
.bg-orange-500 { background-color: #f97316; }

/* Nút thao tác (Actions) */
.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.action-btn:hover { background-color: #e5e7eb; }
.text-blue-600 { color: #2563eb; }
.text-red-600 { color: #dc2626; }

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
}
.page-controls { display: flex; gap: 4px; }
.page-btn {
  width: 32px; height: 32px;
  border: 1px solid #d1d5db;
  background: white; border-radius: 6px;
  cursor: pointer; font-size: 14px;
}
.page-btn.active {
  background-color: #7c3aed; color: white; border-color: #7c3aed;
}
.page-btn.disabled { opacity: 0.5; cursor: not-allowed; }
</style>