<template>
  <div class="table-container">
    <table class="m-table table-customer">
      <thead>
        <tr>
          <th class="sticky-left"><input type="checkbox" /></th>
          <th style="width: 140px">Mã khách hàng</th>
          <th style="width: 220px">Tên khách hàng</th>
          <th style="width: 130px">Mã số thuế</th>
          <th style="width: 120px">Số điện thoại</th>
          <th style="width: 180px">Email</th>
          <th style="min-width: 200px">Địa chỉ</th>
          <th class="text-center sticky-right">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.Id" @dblclick="$emit('edit', item)">
          <td class="sticky-left"><input type="checkbox" /></td>
          <td class="font-bold color-blue">{{ item.CustomerCode }}</td>
          <td>{{ item.CustomerName }}</td>
          <td>{{ item.TaxCode || '---' }}</td>
          <td>{{ item.PhoneNumber }}</td>
          <td class="color-gray">{{ item.Email }}</td>
          <td class="truncate">{{ item.Address }}</td>
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
/**
 * Nhận dữ liệu từ MasterDataTable chung
 */
defineProps(['data']);
const emit = defineEmits(['edit', 'delete']);
</script>

<style lang="scss" scoped>
/* Import CSS dùng chung đã viết trong assets */
@use "../../assets/scss/masterData.scss" as *;

.table-customer {
  .truncate {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>