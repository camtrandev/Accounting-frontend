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
        <tr v-for="doc in filteredDocuments" :key="doc.Id" :class="{ 'row-draft': doc.Status === 0 }">
          <td class="text-center">
            <input type="checkbox" v-model="selectedIds" :value="doc.Id" />
          </td>
          <td class="font-bold">{{ doc.DocumentNo }}</td>
          <td>
            <span :class="['type-badge', doc.DocType.toLowerCase()]">
              {{ translateType(doc.DocType) }}
            </span>
          </td>
          <td>{{ formatDate(doc.DocumentDate) }}</td>
          <td class="partner-name">{{ doc.PartnerName }}</td>
          <td class="text-right font-bold amount">
            {{ formatCurrency(doc.TotalAmount) }}
          </td>
          <td class="description" :title="doc.Description">
            {{ doc.Description }}
          </td>
          <td class="text-center">
            <span :class="['status-badge', doc.Status === 1 ? 'posted' : 'draft']">
              {{ doc.Status === 1 ? 'Đã ghi sổ' : 'Bản nháp' }}
            </span>
          </td>
          <td class="text-center actions">
            <button class="btn-action" @click="$emit('edit', doc)" title="Sửa">✏️</button>
            <button class="btn-action btn-delete" @click="$emit('delete', doc.Id)" title="Xóa">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="filteredDocuments.length === 0" class="empty-state">
      Không tìm thấy chứng từ nào phù hợp.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  filters: Object
});

defineEmits(['edit', 'delete']);

const selectedIds = ref([]);

// Dữ liệu Mockup mở rộng (Thêm PartnerName để hiển thị)
const documents = ref([
  { Id: 1, DocumentNo: 'HD00102', DocType: 'PURCHASE', DocumentDate: '2026-04-20', PartnerName: 'Cửa hàng Phong Vũ', TotalAmount: 25500000, Description: 'Hóa đơn mua thiết bị văn phòng (PC, Bàn ghế)', Status: 1 },
  { Id: 2, DocumentNo: 'PT0045', DocType: 'RECEIPT', DocumentDate: '2026-04-21', PartnerName: 'Công ty TNHH XYZ', TotalAmount: 15000000, Description: 'Thu tiền bán hàng công ty XYZ', Status: 1 },
  { Id: 3, DocumentNo: 'PC0089', DocType: 'PAYMENT', DocumentDate: '2026-04-21', PartnerName: 'Điện lực Hà Nội', TotalAmount: 5500000, Description: 'Chi tiền điện nước tháng 4', Status: 0 },
  { Id: 4, DocumentNo: 'HD00105', DocType: 'SALE', DocumentDate: '2026-04-22', PartnerName: 'Bệnh viện Việt Pháp', TotalAmount: 42000000, Description: 'Bán phần mềm quản lý cho đối tác', Status: 0 },
]);

// Logic lọc dữ liệu tại chỗ (Client-side filtering)
const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchSearch = doc.DocumentNo.toLowerCase().includes(props.filters.search.toLowerCase()) ||
      doc.PartnerName.toLowerCase().includes(props.filters.search.toLowerCase());
    const matchType = props.filters.type ? doc.DocType === props.filters.type : true;
    const matchStatus = props.filters.status !== '' ? doc.Status === parseInt(props.filters.status) : true;
    return matchSearch && matchType && matchStatus;
  });
});

const translateType = (type) => {
  const map = { 'PURCHASE': 'Mua hàng', 'SALE': 'Bán hàng', 'RECEIPT': 'Phiếu thu', 'PAYMENT': 'Phiếu chi' };
  return map[type] || type;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedIds.value = filteredDocuments.value.map(d => d.Id);
  } else {
    selectedIds.value = [];
  }
};
</script>

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