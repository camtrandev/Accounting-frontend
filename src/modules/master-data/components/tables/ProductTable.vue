<template>
  <div class="table-container">
    <table class="m-table table-product">
      <thead>
        <tr>
          <th class="sticky-left checkbox-col">
            <input type="checkbox" v-model="isSelectAll" />
          </th>
          <th class="code-col">Mã hàng</th>
          <th class="name-col" style="min-width: 250px;">Tên vật tư/hàng hóa</th>
          <th style="width: 120px;">Tính chất</th>
          <th style="width: 100px;" class="text-center">ĐVT</th>
          <th style="width: 120px;" class="text-center">TK Kho</th>
          <th style="width: 150px;" class="text-center">TK Doanh thu</th>
          <th class="text-center sticky-right action-col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" :class="{ 'row-selected': selectedIds.includes(item.id) }"
          @dblclick="$emit('edit', item)">
          <td class="sticky-left checkbox-col">
            <input type="checkbox" :value="item.id" v-model="selectedIds" />
          </td>
          <!-- Lưu ý: C# trả về camelCase nên dùng itemCode, itemName... -->
          <td class="code-col font-bold color-blue">{{ item.itemCode }}</td>
          <td class="name-col" :title="item.itemName">{{ item.itemName }}</td>
          <td>{{ formatItemType(item.itemType) }}</td>
          <td class="text-center">{{ item.unit || '---' }}</td>
          <td class="text-center">{{ item.defaultAccountStock || '---' }}</td>
          <td class="text-center">{{ item.defaultAccountRevenue || '---' }}</td>
          <td class="text-center sticky-right action-col">
            <div class="action-btns">
              <i class="fas fa-edit edit" @click="$emit('edit', item)" title="Sửa"></i>
              <i class="fas fa-trash-alt delete" @click="$emit('delete', item.id)" title="Xóa"></i>
            </div>
          </td>
        </tr>

        <!-- Hiển thị khi không có dữ liệu -->
        <tr v-if="!data || data.length === 0">
          <td colspan="8" class="text-center" style="padding: 30px; color: #6b7280; font-style: italic;">
            Không tìm thấy vật tư hàng hóa nào.
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

// Hàm định dạng Tính chất hàng hóa (Dựa theo ảnh Database: 1 là Hàng hóa, 2 là Dịch vụ)
const formatItemType = (typeValue) => {
  switch (typeValue) {
    case 1: return 'Vật tư hàng hóa';
    case 2: return 'Dịch vụ';
    default: return 'Khác';
  }
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;
</style>