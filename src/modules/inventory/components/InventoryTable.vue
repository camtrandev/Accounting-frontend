<template>
  <div>
    <!-- Scroll dọc và ngang -->
    <div class="table-scroll">
      <table class="inventory-table">
        <colgroup>
          <col style="width: 9%;" />
          <col style="width: 9%;" />
          <col style="width: 11%;" />
          <col style="width: 10%;" />
          <col style="width: 15%;" />
          <col style="width: 12%;" />
          <col style="width: auto;" />
          <col style="width: 11%;" />
          <col style="width: 11%;" />
          <col style="width: 6%;" />
        </colgroup>

        <thead>
          <tr>
            <th>Ngày chứng từ</th>
            <th>Ngày hạch toán</th>
            <th>Số chứng từ</th>
            <th>Loại phiếu</th>
            <th>Đối tượng</th>
            <th>Kho hàng</th>
            <th>Diễn giải</th>
            <th class="text-right">Tổng tiền</th>
            <th class="text-center">Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody v-if="isLoading">
          <tr>
            <td colspan="10" class="text-center py-8">
              <span class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...</span>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="items.length === 0">
          <tr>
            <td colspan="10" class="text-center py-8 text-gray-500">
              Không tìm thấy chứng từ nào phù hợp với điều kiện lọc.
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr v-for="item in items" :key="item.id" class="table-row">
            <td>{{ formatDate(item.voucherDate) }}</td>
            <td>{{ formatDate(item.postingDate) }}</td>
            <td class="font-medium text-blue-600 cursor-pointer hover:underline" @click="emit('view', item)">
              {{ item.voucherNumber }}
            </td>
            <td>
              <span class="badge" :class="getTypeClass(item.type)">
                {{ getTypeName(item.type) }}
              </span>
            </td>
            <td class="font-medium text-gray-800 partner-col">{{ item.partnerName || '-' }}</td>
            <td>{{ item.warehouseName || '-' }}</td>
            <td class="text-gray-600 truncate-text" :title="item.description">
              {{ item.description || '-' }}
            </td>
            <td class="text-right font-semibold text-gray-800">
              {{ formatCurrency(item.totalAmount, item.type) }}
            </td>
            <td class="text-center">
              <div class="status-wrapper">
                <span class="status-dot" :class="item.isPosted ? 'bg-green-500' : 'bg-orange-500'"></span>
                <span :class="item.isPosted ? 'text-green-700 font-medium' : 'text-orange-700 font-medium'">
                  {{ item.isPosted ? 'Đã ghi sổ' : 'Chờ ghi sổ' }}
                </span>
              </div>
            </td>
            <td>
              <div class="actions-wrapper">
                <button class="action-btn text-blue-600" title="Xem/Sửa" @click="emit('edit', item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn text-red-600" title="Xóa" @click="emit('delete', item)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper" v-if="items.length > 0 && pagination">
      <div class="pagination-info">
        Hiển thị <span class="font-semibold text-gray-800">{{ startIndex }}-{{ endIndex }}</span>
        trên tổng số <span class="font-semibold text-gray-800">{{ pagination.total }}</span> bản ghi
      </div>
      <div class="page-controls">
        <button class="page-btn" :class="{ 'disabled': pagination.page === 1 }" :disabled="pagination.page === 1"
          @click="changePage(pagination.page - 1)">
          <i class="fas fa-chevron-left"></i>
        </button>

        <button class="page-btn active">{{ pagination.page }}</button>

        <button class="page-btn" :class="{ 'disabled': pagination.page === totalPages }"
          :disabled="pagination.page === totalPages" @click="changePage(pagination.page + 1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({ page: 1, pageSize: 10, total: 0 })
  }
})

const emit = defineEmits(['view', 'edit', 'delete', 'page-change'])

const totalPages = computed(() => {
  if (!props.pagination.total) return 1
  return Math.ceil(props.pagination.total / props.pagination.pageSize)
})

const startIndex = computed(() => {
  if (props.pagination.total === 0) return 0
  return (props.pagination.page - 1) * props.pagination.pageSize + 1
})

const endIndex = computed(() => {
  const end = props.pagination.page * props.pagination.pageSize
  return end > props.pagination.total ? props.pagination.total : end
})

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('page-change', newPage)
  }
}

const formatCurrency = (value, type) => {
  if (type === 'audit' || type === 'transfer' || value === 0 || value === null || value === undefined) return '-'
  return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const getTypeClass = (type) => {
  const normalizedType = type ? type.toLowerCase() : ''
  const map = { receipt: 'badge-blue', issue: 'badge-orange', transfer: 'badge-green', purchase: 'badge-blue', sale: 'badge-orange' }
  return map[normalizedType] || 'badge-gray'
}

const getTypeName = (type) => {
  const normalizedType = type ? type.toLowerCase() : ''
  const map = { receipt: 'Nhập kho', issue: 'Xuất kho', transfer: 'Chuyển kho', purchase: 'Mua hàng', sale: 'Bán hàng' }
  return map[normalizedType] || type || 'Khác'
}
</script>

<style scoped>
.table-scroll {
  max-height: 430px;
  /* Chiều cao tối đa, chỉnh theo ý bạn */
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

/* Cố định header */
.inventory-table thead th {
  position: sticky;
  top: 0;
  background-color: #f9fafb;
  z-index: 10;
}

/* Giữ nguyên CSS cũ */
.inventory-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1400px;
}

.inventory-table th,
.inventory-table td {
  padding: 16px 14px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  vertical-align: middle;
}

.inventory-table th.text-right,
.inventory-table td.text-right {
  text-align: right;
}

.inventory-table th.text-center,
.inventory-table td.text-center {
  text-align: center;
}

.table-row:hover {
  background-color: #f8fafc;
}

.partner-col {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate-text {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.font-semibold {
  font-weight: 600;
}

.font-medium {
  font-weight: 500;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.text-blue-600 {
  color: #2563eb;
}

.text-red-600 {
  color: #dc2626;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.text-green-700 {
  color: #15803d;
}

.text-orange-700 {
  color: #c2410c;
}

.badge {
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
  text-align: center;
  min-width: 95px;
}

.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-orange {
  background-color: #ffedd5;
  color: #c2410c;
}

.badge-green {
  background-color: #dcfce3;
  color: #15803d;
}

.badge-purple {
  background-color: #f3e8ff;
  color: #6b21a8;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #374151;
}

.status-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.bg-green-500 {
  background-color: #22c55e;
}

.bg-orange-500 {
  background-color: #f97316;
}

.actions-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: #f3f4f6;
  transform: scale(1.1);
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 4px 4px 4px;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.page-controls {
  display: flex;
  gap: 6px;
}

.page-btn {
  min-width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
  transition: all 0.2s ease;
  padding: 0 10px;
}

.page-btn:hover:not(.disabled):not(.active) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.page-btn.active {
  background-color: #7c3aed;
  color: #ffffff;
  border-color: #7c3aed;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
}

.page-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f9fafb;
}
</style>