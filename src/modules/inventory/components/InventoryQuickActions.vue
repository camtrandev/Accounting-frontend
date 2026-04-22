<template>
  <div class="quick-actions-wrapper">
    <h3 class="section-title">Nghiệp vụ thường xuyên</h3>
    
    <div class="quick-actions-grid">
      <div 
        v-for="action in actionList" 
        :key="action.id" 
        class="action-card"
        @click="handleAction(action.route)"
      >
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
  {
    id: 'receipt',
    title: 'Nhập kho',
    icon: 'fas fa-download', // Đổi icon nhìn thanh thoát hơn
    colorClass: 'theme-blue',
    route: 'InventoryReceiptCreate'
  },
  {
    id: 'issue',
    title: 'Xuất kho',
    icon: 'fas fa-upload', 
    colorClass: 'theme-orange',
    route: 'InventoryIssueCreate'
  },
  {
    id: 'transfer',
    title: 'Chuyển kho',
    icon: 'fas fa-exchange-alt', 
    colorClass: 'theme-green',
    route: 'InventoryTransfer'
  },
  {
    id: 'inventory-check',
    title: 'Kiểm kê',
    icon: 'fas fa-clipboard-check',
    colorClass: 'theme-teal',
    route: 'InventoryCheck'
  },
  {
    id: 'costing',
    title: 'Tính giá xuất kho',
    icon: 'fas fa-calculator',
    colorClass: 'theme-purple',
    route: 'InventoryCosting'
  }
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
  font-size: 15px; /* Giảm nhẹ size tiêu đề */
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px; /* Giảm gap để các khối gần nhau hơn */
}

@media (min-width: 640px) {
  .quick-actions-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .quick-actions-grid { grid-template-columns: repeat(5, 1fr); }
}

.action-card {
  display: flex;
  flex-direction: row; /* Chuyển sang dàn ngang (icon bên trái, chữ bên phải) sẽ tiết kiệm chiều cao */
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px; /* Giảm padding */
  background-color: #ffffff;
  border: 1px solid #f3f4f6; /* Viền nhạt hơn nữa */
  border-radius: 10px; /* Bo góc mượt hơn */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  gap: 12px;
}

.action-card:hover {
  transform: translateY(-2px); /* Bay lên nhẹ nhàng hơn */
  border-color: #d1d5db; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.icon-wrapper {
  width: 36px; /* Thu nhỏ đáng kể từ 56px xuống 36px */
  height: 36px;
  border-radius: 8px; /* Bo góc icon vuông vức hơn */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px; /* Size icon bé lại */
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.action-card:hover .icon-wrapper {
  transform: scale(1.08); 
}

.action-label {
  font-size: 13px; /* Font chữ gọn gàng hơn */
  font-weight: 500;
  color: #4b5563;
}

/* Bảng màu nền trong suốt hơn, nhẹ nhàng hơn */
.theme-blue { background-color: #f0f9ff; color: #0284c7; }
.theme-orange { background-color: #fff7ed; color: #ea580c; }
.theme-green { background-color: #f0fdf4; color: #16a34a; }
.theme-teal { background-color: #f0fdfa; color: #0d9488; }
.theme-purple { background-color: #faf5ff; color: #9333ea; }
</style>