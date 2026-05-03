<template>
  <div class="table-container">
    <table class="m-table table-warehouse">
      <thead>
        <tr>
          <th class="sticky-left"><input type="checkbox" /></th>
          <th style="width: 150px">Mã kho</th>
          <th style="width: 250px">Tên kho</th>
          <th style="min-width: 300px">Địa chỉ</th>
          <th class="text-center sticky-right">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.Id" @dblclick="$emit('edit', item)">
          <td class="sticky-left"><input type="checkbox" /></td>
          <td class="font-bold color-orange">{{ item.WarehouseCode }}</td>
          <td>{{ item.WarehouseName }}</td>
          <td>{{ item.Address }}</td>
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
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;
</style>