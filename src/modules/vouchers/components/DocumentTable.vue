<template>
  <div class="table-container">
    <table class="document-table">
      <thead>
        <tr>
          <th>Số CT</th>
          <th>Loại</th>
          <th>Ngày CT</th>
          <th>Ngày Ghi Sổ</th>
          <th class="text-right">Tổng Tiền</th>
          <th>Diễn Giải</th>
          <th class="text-center">Trạng Thái</th>
          <th class="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in fakeDocuments" :key="doc.Id">
          <td class="font-bold">{{ doc.DocumentNo }}</td>
          <td>
            <span :class="['type-badge', doc.DocType.toLowerCase()]">
              {{ doc.DocType }}
            </span>
          </td>
          <td>{{ formatDate(doc.DocumentDate) }}</td>
          <td>{{ formatDate(doc.PostingDate) }}</td>
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
            <button class="btn-action" title="Sửa">✏️</button>
            <button class="btn-action" title="Xóa">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dữ liệu Fake (Sau này Axios GET về sẽ gán vào mảng này)
const fakeDocuments = ref([
  { Id: 1, DocumentNo: 'HD00102', DocType: 'PURCHASE', DocumentDate: '2026-04-20', PostingDate: '2026-04-20', PartnerId: 101, TotalAmount: 25500000, Description: 'Hóa đơn mua thiết bị văn phòng (PC, Bàn ghế)', Status: 1 },
  { Id: 2, DocumentNo: 'PT0045', DocType: 'RECEIPT', DocumentDate: '2026-04-21', PostingDate: '2026-04-21', PartnerId: 205, TotalAmount: 15000000, Description: 'Thu tiền bán hàng công ty XYZ', Status: 1 },
  { Id: 3, DocumentNo: 'PC0089', DocType: 'PAYMENT', DocumentDate: '2026-04-21', PostingDate: '2026-04-21', PartnerId: 302, TotalAmount: 5500000, Description: 'Chi tiền điện nước tháng 4', Status: 0 },
  { Id: 4, DocumentNo: 'HD00105', DocType: 'SALE', DocumentDate: '2026-04-22', PostingDate: '2026-04-22', PartnerId: 108, TotalAmount: 42000000, Description: 'Bán phần mềm kế toán cho đối tác', Status: 0 },
]);

// Hàm format hiển thị
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};
</script>

<style scoped>
.table-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  overflow: hidden;
}

.document-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.document-table th, .document-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #edf2f7;
  text-align: left;
}

.document-table th {
  background-color: #f8fafc;
  color: #4a5568;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.document-table tbody tr:hover {
  background-color: #f8fafc;
}

.font-bold { font-weight: 600; }
.text-right { text-align: right; }
.text-center { text-align: center; }
.amount { color: #2b6cb0; }

.description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Badge Loại chứng từ */
.type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}
.type-badge.purchase { background-color: #e6fffa; color: #319795; }
.type-badge.sale { background-color: #ebf8ff; color: #3182ce; }
.type-badge.receipt { background-color: #f0fff4; color: #38a169; }
.type-badge.payment { background-color: #fff5f5; color: #e53e3e; }

/* Badge Trạng thái */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-badge.posted { background-color: #d1fae5; color: #065f46; }
.status-badge.draft { background-color: #fef3c7; color: #92400e; }

/* Thao tác */
.actions .btn-action {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.actions .btn-action:hover { opacity: 1; transform: scale(1.1); }
</style>