<template>
  <div class="document-toolbar">
    <div class="left-content">
      <div class="page-title">
        <h2>Quản lý chứng từ</h2>
        <p>Danh sách toàn bộ hóa đơn, phiếu thu, phiếu chi từ hệ thống</p>
      </div>
    </div>
    
    <div class="header-actions">
      <!-- Nút Xuất Excel: Cần thiết cho báo cáo thuế/nội bộ -->
      <button class="btn-secondary" @click="$emit('export')" title="Xuất danh sách ra file Excel">
        <span class="icon">📊</span> Xuất Excel
      </button>

      <!-- Nút Thêm mới: Layout rõ ràng hơn -->
      <button class="btn-primary" @click="$emit('create')">
        <span class="icon">+</span> Thêm mới
      </button>
    </div>
  </div>
</template>

<script setup>
// Khai báo các sự kiện bắn lên DocumentPage
defineEmits(['create', 'open-ai', 'export']);
</script>

<style scoped>
.document-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.page-title h2 {
  margin: 0 0 4px 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
}

.page-title p {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Nút phụ (Xuất Excel) */
.btn-secondary {
  background-color: #fff;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

/* Nút chính (Thêm mới) */
.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #4338ca;
}


.icon {
  font-size: 16px;
}
</style>