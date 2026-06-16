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
          <th class="text-center" v-if="isAdmin">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.id">
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

          <td class="partner-name">{{ getPartnerName(doc.partnerId) || doc.partnerName || '-' }}</td>

          <td class="text-right font-bold amount">
            {{ doc.totalAmount ? formatCurrency(doc.totalAmount) : '-' }}
          </td>
          <td class="description" :title="doc.description">
            {{ doc.description }}
          </td>

          <td class="text-center">
            <span :class="['status-badge', doc.status === 1 ? 'posted' : (doc.status === 2 ? 'pending' : 'cancelled')]">
              {{ doc.status === 1 ? 'Đã ghi sổ' : (doc.status === 2 ? 'Chờ duyệt' : 'Huỷ') }}
            </span>
          </td>

          <td class="text-center actions" v-if="isAdmin">
            <template v-if="doc.status === 2">
              <button class="btn-action btn-approve" @click="openModal('approve', doc.id)" title="Duyệt">✔️
                Duyệt</button>
              <button class="btn-action btn-reject" @click="openModal('reject', doc.id)" title="Huỷ">❌ Huỷ</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="documents.length === 0" class="empty-state">
      Không tìm thấy chứng từ nào phù hợp.
    </div>

    <ConfirmModal :isOpen="modalConfig.isOpen" :title="modalConfig.title" :message="modalConfig.message"
      :confirmText="modalConfig.confirmText" :confirmColorClass="modalConfig.confirmColorClass" @close="closeModal"
      @confirm="handleConfirmAction" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import ConfirmModal from '../components/base/ConfirmModal.vue'

// IMPORT STORE
import { useVouchersStore } from '../store/vouchers.store';

const props = defineProps({
  documents: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['approve', 'reject']);

// Khởi tạo Store
const vStore = useVouchersStore();

const selectedIds = ref([]);
const isAdmin = ref(false);

// STATE VÀ HÀM XỬ LÝ MODAL
const selectedDocId = ref(null);
const actionType = ref('');

const modalConfig = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  confirmColorClass: ''
});

// Hàm mở Modal
const openModal = (type, id) => {
  selectedDocId.value = id;
  actionType.value = type;

  if (type === 'approve') {
    modalConfig.title = 'Xác nhận duyệt?';
    modalConfig.message = 'Bạn có chắc chắn muốn ghi sổ chứng từ này không?';
    modalConfig.confirmText = 'Ghi sổ';
    modalConfig.confirmColorClass = 'btn-success';
  } else if (type === 'reject') {
    modalConfig.title = 'Xác nhận huỷ?';
    modalConfig.message = 'Bạn có chắc chắn muốn huỷ chứng từ này không?';
    modalConfig.confirmText = 'Huỷ chứng từ';
    modalConfig.confirmColorClass = 'btn-danger';
  }

  modalConfig.isOpen = true;
};

// Hàm đóng Modal
const closeModal = () => {
  modalConfig.isOpen = false;
  selectedDocId.value = null;
  actionType.value = '';
};

// Hàm xử lý Xác nhận
const handleConfirmAction = () => {
  if (actionType.value === 'approve') {
    emit('approve', selectedDocId.value);
  } else if (actionType.value === 'reject') {
    emit('reject', selectedDocId.value);
  }
  closeModal();
};

onMounted(async () => {
  // 1. ĐỌC QUYỀN ADMIN TỪ LOCALSTORAGE
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      if (userObj.role === 'Admin') {
        isAdmin.value = true;
      }
    }
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu phân quyền từ LocalStorage:", error);
  }

  // 2. LẤY DỮ LIỆU DANH MỤC (Nếu chưa có)
  if (!vStore.partners || vStore.partners.length === 0) {
      await vStore.fetchMetaData();
  }
});

// HÀM TÌM TÊN ĐỐI TÁC DỰA TRÊN ID
const getPartnerName = (partnerId) => {
  if (!partnerId) return '';

  // Ép kiểu về Number để đảm bảo so sánh đúng
  const targetId = Number(partnerId);

  // Tìm trong store
  const partner = vStore.partners.find(p => Number(p.id) === targetId || Number(p.Id) === targetId);

  return partner ? (partner.partnerName || partner.PartnerName) : '';
};

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

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedIds.value = props.documents.map(d => d.id);
  } else {
    selectedIds.value = [];
  }
};
</script>

<style scoped>
/* Thêm một chút CSS cho 2 nút mới để nhìn rõ ràng hơn, bạn có thể chỉnh lại theo theme dự án */
.btn-approve {
  color: #16a34a;
  /* Xanh lá */
  font-weight: 500;
  margin-right: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-approve:hover {
  text-decoration: underline;
}

.btn-reject {
  color: #dc2626;
  /* Đỏ */
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-reject:hover {
  text-decoration: underline;
}
</style>

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
  /* Màu Xanh - Đã ghi sổ */
  color: #fff;
}

.status-badge.pending {
  background: #f59e0b;
  /* Màu Vàng - Chờ duyệt */
  color: #fff;
}

.status-badge.cancelled {
  background: #ef4444;
  /* Màu Đỏ - Huỷ */
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