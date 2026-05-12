<template>
  <div class="table-container">
    <table class="m-table table-customer">
      <thead>
        <tr>
          <th class="sticky-left checkbox-col"><input type="checkbox" /></th>
          <th style="width: 150px">Mã khách hàng</th>
          <th style="width: 250px">Tên khách hàng</th>
          <th style="width: 150px">Mã số thuế</th>
          <th style="min-width: 250px">Địa chỉ</th>
          <th style="width: 150px" class="text-right">Hạn mức nợ</th>
          <th class="text-center sticky-right action-col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        
        <tr v-for="item in data" :key="item.id" @dblclick="$emit('edit', item)">
          <td class="sticky-left checkbox-col"><input type="checkbox" /></td>

          
          <td class="font-bold color-blue">{{ item.partnerCode }}</td>

          
          <td :title="item.partnerName">{{ item.partnerName }}</td>

          
          <td>{{ item.taxCode || '---' }}</td>

          
          <td class="truncate" :title="item.address">{{ item.address || '---' }}</td>

          <!-- Sửa: debtLimit (chữ d thường) -->
          <td class="text-right font-bold">{{ formatCurrency(item.debtLimit) }}</td>

          <td class="text-center sticky-right action-col">
            <div class="action-btns">
              <i class="fas fa-edit edit" @click="$emit('edit', item)" title="Sửa"></i>
              <!-- Sửa: item.id -->
              <i class="fas fa-trash-alt delete" @click="$emit('delete', item.id)" title="Xóa"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps(['data']);
defineEmits(['edit', 'delete']);


watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    console.log("=== DỮ LIỆU KHÁCH HÀNG ĐÃ KHỚP ===");
    console.log(newData);
  }
}, { immediate: true, deep: true });

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;

/* Layout giống hệt AccountTable */
.table-container {
  width: 100%;
  height: 100%;
  /* Lấp đầy khung flex: 1 của trang cha */
  overflow: auto;
  position: relative;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px 4px 0 0;
}

.m-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1050px;

  thead th {
    position: sticky;
    top: 0;
    z-index: 20;
    background-color: #f8f9fa;
  }
}

.table-customer .truncate {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
</style>