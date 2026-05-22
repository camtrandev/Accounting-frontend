<template>
  <div class="quick-actions-wrapper">
    <h3 class="section-title">Nghiệp vụ thường xuyên</h3>

    <div class="quick-actions-grid">
      <div v-for="action in actionList" :key="action.id" class="action-card" @click="handleAction(action.route)">
        <div class="icon-wrapper" :class="action.colorClass">
          <i :class="action.icon"></i>
        </div>
        <span class="action-label">{{ action.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const actionList = ref([
  { id: 'receipt', title: 'Nhập kho', icon: 'fas fa-download', colorClass: 'theme-blue', route: 'InventoryReceiptCreate' },
  { id: 'issue', title: 'Xuất kho', icon: 'fas fa-upload', colorClass: 'theme-orange', route: 'InventoryIssueCreate' },
  { id: 'transfer', title: 'Chuyển kho', icon: 'fas fa-exchange-alt', colorClass: 'theme-green', route: 'InventoryTransfer' },
  { id: 'inventory-check', title: 'Kiểm kê', icon: 'fas fa-clipboard-check', colorClass: 'theme-teal', route: 'InventoryCheck' },
  { id: 'costing', title: 'Tính giá xuất kho', icon: 'fas fa-calculator', colorClass: 'theme-purple', route: 'InventoryCosting' }
])

const handleAction = (routeName) => {
  if (!routeName) return
  router.push({ name: routeName })
}
</script>

<style scoped>
.quick-actions-wrapper {
  width: 100%;
}

.section-title {
  font-size: 14px;
  /* nhỏ hơn để tiết kiệm không gian */
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  /* giảm margin xuống còn 8px */
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  /* giảm gap */
}

@media (min-width: 640px) {
  .quick-actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .quick-actions-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.action-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 12px;
  /* giảm padding */
  background-color: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  /* hơi nhỏ hơn */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  gap: 8px;
  /* giảm khoảng cách icon và label */
}

.action-card:hover {
  transform: translateY(-1px);
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  width: 28px;
  /* thu nhỏ icon */
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  /* nhỏ hơn */
  flex-shrink: 0;
}

.action-card:hover .icon-wrapper {
  transform: scale(1.05);
}

.action-label {
  font-size: 12px;
  /* nhỏ hơn */
  font-weight: 500;
  color: #4b5563;
}

/* Theme colors */
.theme-blue {
  background-color: #f0f9ff;
  color: #0284c7;
}

.theme-orange {
  background-color: #fff7ed;
  color: #ea580c;
}

.theme-green {
  background-color: #f0fdf4;
  color: #16a34a;
}

.theme-teal {
  background-color: #f0fdfa;
  color: #0d9488;
}

.theme-purple {
  background-color: #faf5ff;
  color: #9333ea;
}
</style>