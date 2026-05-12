<template>
  <div class="table-container">
    <table class="m-table table-warehouse">
      <thead>
        <tr>
          <th class="sticky-left checkbox-col">
            <input type="checkbox" v-model="isSelectAll" />
          </th>
          <th class="code-col" style="width: 150px;">Mã kho</th>
          <th class="name-col" style="min-width: 250px;">Tên kho</th>
          <th class="address-col" style="min-width: 250px;">Địa chỉ</th>
          <th style="width: 180px;">Người quản lý</th>
          <th style="width: 130px;" class="text-center">Trạng thái</th>
          <th class="text-center sticky-right action-col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" :class="{ 'row-selected': selectedIds.includes(item.id) }"
          @dblclick="$emit('edit', item)">
          <td class="sticky-left checkbox-col">
            <input type="checkbox" :value="item.id" v-model="selectedIds" />
          </td>
          <!-- .NET tự động parse thành camelCase: warehouseCode -->
          <td class="code-col font-bold color-blue">{{ item.warehouseCode }}</td>
          <td class="name-col" :title="item.warehouseName">{{ item.warehouseName }}</td>
          <td class="address-col truncate" :title="item.address">{{ item.address || '---' }}</td>
          <td>{{ item.managerName || '---' }}</td>
          <td class="text-center">
            <!-- Xử lý hiển thị trạng thái -->
            <span class="status-pill" :class="item.isActive ? 'active' : 'inactive'">
              {{ item.isActive ? 'Hoạt động' : 'Ngừng HĐ' }}
            </span>
          </td>
          <td class="text-center sticky-right action-col">
            <div class="action-btns">
              <i class="fas fa-edit edit" @click="$emit('edit', item)" title="Sửa"></i>
              <i class="fas fa-trash-alt delete" @click="$emit('delete', item.id)" title="Xóa"></i>
            </div>
          </td>
        </tr>

        <!-- Hiển thị khi không có dữ liệu -->
        <tr v-if="!data || data.length === 0">
          <td colspan="7" class="text-center" style="padding: 30px; color: #6b7280; font-style: italic;">
            Không tìm thấy dữ liệu kho nào.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'delete', 'update:selected']);

const selectedIds = ref([]);

const isSelectAll = computed({
  get() {
    return props.data && props.data.length > 0 && selectedIds.value.length === props.data.length;
  },
  set(value) {
    if (value) {
      selectedIds.value = props.data.map(item => item.id);
    } else {
      selectedIds.value = [];
    }
    emit('update:selected', selectedIds.value);
  }
});

watch(selectedIds, (newVal) => {
  emit('update:selected', newVal);
}, { deep: true });

watch(() => props.data, () => {
  selectedIds.value = [];
}, { deep: true });
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;
</style>