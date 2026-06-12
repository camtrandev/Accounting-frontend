<template>
  <div class="table-container">
    <table class="document-table">
      <thead>
        <tr>
          <th class="text-center" style="width: 40px;">
            <input type="checkbox" @change="toggleSelectAll" />
          </th>
          <th>Số CT</th>
          <th>Loại</th>
          <th>Ngày CT</th>
          <th>Đối tác</th>
          <th class="text-right">Tổng Tiền</th>
          <th>Diễn Giải</th>
          <th class="text-center">Trạng Thái</th>
          <th class="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.id" :class="{ 'row-draft': doc.status === 0 }">
          <td class="text-center">
            <input type="checkbox" v-model="selectedIds" :value="doc.id" />
          </td>
          <td class="font-bold">{{ doc.documentNo }}</td>
          <td>
            <span :class="['type-badge', doc.docType?.toLowerCase()]">
              {{ translateType(doc.docType) }}
            </span>
          </td>
          <td>{{ formatDate(doc.documentDate) }}</td>
          <td class="partner-name">{{ doc.partnerName || '-' }}</td>
          <td class="text-right font-bold amount">
            {{ doc.totalAmount ? formatCurrency(doc.totalAmount) : '-' }}
          </td>
          <td class="description" :title="doc.description">
            {{ doc.description }}
          </td>
          <td class="text-center">
            <span :class="['status-badge', doc.status === 1 ? 'posted' : (doc.status === 2 ? 'pending' : 'draft')]">
              {{ doc.status === 1 ? 'Đã ghi sổ' : (doc.status === 2 ? 'Chờ duyệt' : 'Bản nháp') }}
            </span>
          </td>
          <td class="text-center actions">
            <button class="btn-action" @click="$emit('edit', doc)" title="Sửa">✏️</button>
            <button class="btn-action btn-delete" @click="$emit('delete', doc.id)" title="Xóa">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="documents.length === 0" class="empty-state">
      Không tìm thấy chứng từ nào phù hợp.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  documents: {
    type: Array,
    default: () => []
  }
});

defineEmits(['edit', 'delete']);

const selectedIds = ref([]);

const translateType = (type) => {
  if (!type) return '';
  const map = {
    'PURCHASE': 'Mua hàng',
    'SALE': 'Bán hàng',
    'RECEIPT': 'Phiếu thu',
    'PAYMENT': 'Phiếu chi',
    'TRANSFER': 'Chuyển kho',
    'INVENTORY_RECEIPT': 'Nhập kho',
    'INVENTORY_ISSUE': 'Xuất kho'
  };
  return map[type.toUpperCase()] || type;
};

const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// Đổi từ filteredDocuments thành props.documents
const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedIds.value = props.documents.map(d => d.id);
  } else {
    selectedIds.value = [];
  }
};
</script>

<style scoped>
/* KIỂM SOÁT SCROLL KHI NHIỀU BẢN GHI (20 DÒNG TRỞ LÊN) */
.table-container {
  max-height: 520px;
  /* Chiều cao vừa đẹp cho khoảng 10 dòng dữ liệu */
  overflow-y: auto;
  /* Hiện thanh cuộn dọc nếu vượt quá max-height */
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #ffffff;
}

/* Cố định tiêu đề bảng khi cuộn chuột xuống */
.document-table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8fafc;
  /* Màu nền cho Header để không bị đè chữ */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  /* Bóng đổ mờ giúp tách biệt Header và Content */
}
</style>

<style scoped>
.table-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
}

.document-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1000px;
  /* Đảm bảo không bị vỡ trên màn hình nhỏ */
}

.document-table th,
.document-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.document-table th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
}

.row-draft {
  background-color: #fffcf5;
}

.document-table tbody tr:hover {
  background-color: #f1f5f9;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.amount {
  color: #1e40af;
}

.partner-name {
  font-weight: 500;
  color: #334155;
}

.description {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #64748b;
}

/* Badges */
.type-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.type-badge.purchase {
  background: #e0f2fe;
  color: #0369a1;
}

.type-badge.sale {
  background: #e0e7ff;
  color: #4338ca;
}

.type-badge.receipt {
  background: #dcfce7;
  color: #15803d;
}

.type-badge.payment {
  background: #fee2e2;
  color: #b91c1c;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.status-badge.posted {
  background: #10b981;
  color: #fff;
}

.status-badge.draft {
  background: #f59e0b;
  color: #fff;
}

.btn-action {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-action:hover {
  background: #e2e8f0;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
}
</style>