<template>
  <div class="table-container">
    <table class="m-table table-supplier">
      <thead>
        <tr>
          <th class="sticky-left"><input type="checkbox" /></th>
          <th style="width: 150px">Mã nhà cung cấp</th>
          <th style="width: 250px">Tên nhà cung cấp</th>
          <th style="width: 150px">Mã số thuế</th>
          <th style="width: 150px" class="text-right">Hạn mức nợ</th>
          <th style="min-width: 250px">Địa chỉ</th>
          <th class="text-center sticky-right">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.Id" @dblclick="$emit('edit', item)">
          <td class="sticky-left"><input type="checkbox" /></td>
          <td class="font-bold color-blue">{{ item.SupplierCode }}</td>
          <td>{{ item.SupplierName }}</td>
          <td>{{ item.TaxCode }}</td>
          <td class="text-right font-bold color-red">{{ formatMoney(item.DebtLimit) }}</td>
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
defineProps(['data']);
const emit = defineEmits(['edit', 'delete']);

const formatMoney = (v) => new Intl.NumberFormat('vi-VN').format(v || 0);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;
.truncate {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>