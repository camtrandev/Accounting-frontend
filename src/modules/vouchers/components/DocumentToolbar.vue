<template>
  <div class="document-toolbar">
    <div class="page-title">
      <h2>Quản lý chứng từ</h2>
      <p>Danh sách toàn bộ hóa đơn, phiếu thu, phiếu chi</p>
    </div>
    
    <div class="header-actions">
      <button class="btn-primary" @click="$emit('create')">
        + Thêm mới
      </button>
      
      <button class="btn-ai-assistant" @click="$emit('open-ai')">
        <span class="icon">✨</span> Trợ lý Chứng từ AI
      </button>
    </div>
  </div>
</template>

<script setup>
// Khai báo các sự kiện bắn lên DocumentPage
defineEmits(['create', 'open-ai']);
</script>

<style scoped>
.document-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.page-title h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #2d3748;
}

.page-title p {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  background-color: #5a67d8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #434ce6;
}

.btn-ai-assistant {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-ai-assistant:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
}
</style>