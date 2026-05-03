<template>
  <!-- table-container đóng vai trò là vùng giới hạn scroll -->
  <div class="table-container">
    <table class="m-table table-account">
      <thead>
        <tr>
          <th class="sticky-left checkbox-col"><input type="checkbox" /></th>
          <th style="width: 150px">Số hiệu tài khoản</th>
          <th style="width: 250px">Tên tài khoản</th>
          <th style="width: 120px">Tính chất</th>
          <th style="min-width: 300px">Diễn giải</th>
          <th class="text-center sticky-right action-col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" @dblclick="$emit('edit', item)">
          <td class="sticky-left checkbox-col"><input type="checkbox" /></td>

          <td :style="{ paddingLeft: getIndent(item.id) + 'px' }" class="font-bold">
            {{ item.id }}
          </td>

          <td>{{ item.accountName }}</td>
          <td>{{ formatType(item.accountType) }}</td>

          <td class="text-italic text-gray-500">{{ item.description || '---' }}</td>

          <td class="text-center sticky-right action-col">
            <div class="action-btns">
              <i class="fas fa-edit edit" @click="$emit('edit', item)" title="Sửa"></i>
              <i class="fas fa-trash-alt delete" @click="$emit('delete', item.id)" title="Xóa"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps(['data']);
defineEmits(['edit', 'delete']);

const getIndent = (code) => {
  if (!code) return 0;
  return code.length > 3 ? (code.length - 3) * 20 : 0; // Tăng indent một chút cho rõ ràng
};

const formatType = (type) => {
  const maps = { 1: 'Dư Nợ', 2: 'Dư Có', 3: 'Lưỡng tính' };
  return maps[type] || type;
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;

.table-container {
  /* Quan trọng: Cho phép scroll cả ngang và dọc */
  overflow: auto;
  width: 100%;
  height: 100%;

  /* Tạo layout chắc chắn cho bảng */
  position: relative;
  border: 1px solid #e5e7eb;
  background: white;
}

.m-table {
  width: 100%;
  border-collapse: separate; // Cần thiết để sticky border hoạt động đúng
  border-spacing: 0;

  /* Bảng giữ kích thước cứng để không bị méo khi thu nhỏ màn hình */
  min-width: 1000px;

  thead {
    position: sticky;
    top: 0;
    z-index: 10; // Đảm bảo header luôn nằm trên body khi scroll dọc
    background: #f8f9fa;
  }

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap; // Không cho chữ xuống dòng để giữ layout cứng
  }
}

/* Xử lý Sticky Columns (Cột cố định khi scroll ngang) */
.sticky-left {
  position: sticky !important;
  left: 0;
  z-index: 5;
  background: inherit; // Lấy màu của dòng để không bị trong suốt

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    box-shadow: inset -2px 0 5px -2px rgba(0, 0, 0, 0.15); // Tạo bóng đổ phân cách
  }
}

.sticky-right {
  position: sticky !important;
  right: 0;
  z-index: 5;
  background: inherit;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    box-shadow: inset 2px 0 5px -2px rgba(0, 0, 0, 0.15);
  }
}

.checkbox-col {
  width: 45px;
  min-width: 45px;
  text-align: center;
}

.action-col {
  width: 100px;
  min-width: 100px;
}

tr:hover {
  background-color: #f1f5f9 !important;
}

.table-account .font-bold {
  color: #2c3e50;
}

.action-btns {
  display: flex;
  justify-content: center;
  gap: 12px;

  i {
    cursor: pointer;
    font-size: 14px;

    &.edit {
      color: #2563eb;
    }

    &.delete {
      color: #ef4444;
    }

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>