<template>
  <div class="master-table-wrapper">
    <transition name="fade" mode="out-in">
      <div v-if="items && items.length > 0" class="h-full">
        <component 
          :is="renderTable" 
          :data="items" 
          @edit="handleEdit" 
          @delete="handleDelete"
        />
      </div>

      <div v-else class="empty-data">
        <div class="empty-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <p>Không có dữ liệu để hiển thị</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Import tương đối để tránh lỗi alias @ nếu chưa cấu hình
import AccountTable from '../components/tables/AccountTable.vue';
import CustomerTable from '../components/tables/CustomerTable.vue';
import SupplierTable from '../components/tables/SupplierTable.vue';
import ProductTable from '../components/tables/ProductTable.vue';
import WarehouseTable from '../components/tables/WarehouseTable.vue';

const props = defineProps({
  type: { type: String, required: true },
  items: { type: Array, default: () => [] }
});

const emit = defineEmits(['edit', 'delete']);

const renderTable = computed(() => {
  const map = {
    'ACCOUNT': AccountTable,
    'CUSTOMER': CustomerTable,
    'SUPPLIER': SupplierTable,
    'PRODUCT': ProductTable,
    'WAREHOUSE': WarehouseTable
  };
  return map[props.type] || null;
});

const handleEdit = (item) => emit('edit', item);
const handleDelete = (id) => emit('delete', id);
</script>

<style lang="scss" scoped>
.master-table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  min-height: 400px;
}

.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>