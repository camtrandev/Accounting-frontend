<template>
  <div class="document-page">

    <DocumentToolbar @create="handleCreateNew" @export="handleExportExcel" />

    <div class="filter-section">
      <div class="search-box">
        <input type="text" v-model="filters.search" placeholder="Tìm theo số chứng từ, đối tác..." />
      </div>
      <div class="filter-group">
        <select v-model="filters.type">
          <option value="">Tất cả loại CT</option>
          <option value="PURCHASE">Hóa đơn mua hàng</option>
          <option value="SALE">Hóa đơn bán hàng</option>
          <option value="RECEIPT">Phiếu thu</option>
          <option value="PAYMENT">Phiếu chi</option>
        </select>

        <input type="date" v-model="filters.fromDate" title="Từ ngày" />
        <input type="date" v-model="filters.toDate" title="Đến ngày" />

        <select v-model="filters.status">
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đã ghi sổ</option>
          <option value="0">Bản nháp</option>
        </select>
      </div>
    </div>

    <DocumentTable :filters="filters" @edit="handleEdit" @delete="handleDelete" />

  </div>
</template>

<script setup>
import { reactive } from 'vue';
import DocumentToolbar from '../components/DocumentToolbar.vue';
import DocumentTable from '../components/DocumentTable.vue';

// Bộ lọc dữ liệu tập trung tại Page để dễ dàng quản lý API sau này
const filters = reactive({
  search: '',
  type: '',
  status: '',
  fromDate: '',
  toDate: ''
});

const handleCreateNew = () => {
  console.log("Mở Modal thêm mới chứng từ");
};

const handleEdit = (doc) => {
  console.log("Chỉnh sửa chứng từ:", doc);
};

const handleDelete = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa chứng từ này?")) {
    console.log("Xóa chứng từ ID:", id);
  }
};

const handleExportExcel = () => {
  console.log("Đang xuất dữ liệu ra Excel với bộ lọc:", filters);
  alert("Hệ thống đang khởi tạo file Excel...");
};
</script>

<style scoped>
.document-page {
  padding: 24px;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Style cho phần bộ lọc mới */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  flex-wrap: wrap;
  gap: 12px;
}

.search-box input {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 300px;
  outline: none;
}

.search-box input:focus {
  border-color: #5a67d8;
}

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  color: #4a5568;
}
</style>