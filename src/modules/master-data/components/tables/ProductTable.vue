<template>
  <div class="table-container">
    <table class="m-table table-product">
      <thead>
        <tr>
          <th class="sticky-left"><input type="checkbox" /></th>
          <th style="width: 150px">Mã hàng</th>
          <th style="width: 250px">Tên hàng hóa</th>
          <th style="width: 100px" class="text-center">ĐVT</th>
          <th style="width: 150px" class="text-right">Giá bán</th>
          <th style="width: 180px">Kho mặc định</th>
          <th class="text-center sticky-right">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.Id" @dblclick="$emit('edit', item)">
          <td class="sticky-left"><input type="checkbox" /></td>
          <td class="font-bold">{{ item.ProductCode }}</td>
          <td>{{ item.ProductName }}</td>
          <td class="text-center">{{ item.Unit }}</td>
          <td class="text-right font-bold">{{ formatMoney(item.SalePrice) }}</td>
          <td><span class="tag-warehouse">{{ item.WarehouseName || 'Chưa chọn' }}</span></td>
          <td class="text-center sticky-right">
            <div class="action-btns">
              <i class="fas fa-edit edit" @click="$emit('edit', item)"></i>
              <i class="fas fa-trash-alt delete" @click="$emit('delete', item.Id)"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps(['data']);
const emit = defineEmits(['edit', 'delete']);

const formatMoney = (v) => new Intl.NumberFormat('vi-VN').format(v || 0);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;
</style>