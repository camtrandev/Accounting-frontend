<template>
  <div class="table-container">
    <table class="m-table table-supplier">
      <thead>
        <tr>
          <th class="sticky-left checkbox-col">
            <input type="checkbox" v-model="isSelectAll" />
          </th>
          <th class="code-col">Mã nhà cung cấp</th>
          <th class="name-col">Tên nhà cung cấp</th>
          <th class="tax-col">Mã số thuế</th>
          <th class="address-col">Địa chỉ</th>
          <th class="debt-col text-right">Hạn mức nợ</th>
          <th class="text-center sticky-right action-col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" :class="{ 'row-selected': selectedIds.includes(item.id) }"
          @dblclick="$emit('edit', item)">
          <td class="sticky-left checkbox-col">
            <input type="checkbox" :value="item.id" v-model="selectedIds" />
          </td>
          <td class="code-col font-bold color-blue">{{ item.partnerCode }}</td>
          <td class="name-col" :title="item.partnerName">{{ item.partnerName }}</td>
          <td class="tax-col">{{ item.taxCode || '---' }}</td>
          <td class="address-col truncate" :title="item.address">{{ item.address || '---' }}</td>
          <td class="debt-col text-right font-bold">{{ formatCurrency(item.debtLimit) }}</td>
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
            Không tìm thấy dữ liệu nhà cung cấp nào.
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

// Mảng chứa ID các dòng được chọn
const selectedIds = ref([]);

// Logic tính toán "Chọn tất cả"
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

// Báo cho component cha khi danh sách chọn thay đổi
watch(selectedIds, (newVal) => {
  emit('update:selected', newVal);
}, { deep: true });

// Tự động bỏ chọn tất cả khi dữ liệu thay đổi (ví dụ: gõ tìm kiếm, chuyển trang)
watch(() => props.data, () => {
  selectedIds.value = [];
}, { deep: true });

// Hàm định dạng số tiền
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;

.truncate {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>