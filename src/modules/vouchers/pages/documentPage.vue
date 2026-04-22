<template>
  <div class="document-page">
    
    <template v-if="!showAIAssistant">
      <DocumentToolbar 
        @create="handleCreateNew" 
        @open-ai="showAIAssistant = true" 
      />
      <DocumentTable />
    </template>

    <OcrInvoiceSplitView 
      v-else 
      @close="showAIAssistant = false" 
    />
    
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Import các component con đã tách
import DocumentToolbar from '../components/DocumentToolbar.vue';
import DocumentTable from '../components/DocumentTable.vue';
import OcrInvoiceSplitView from '../components/OcrInvoiceSplitView.vue';

// State quản lý việc bật/tắt màn hình AI
const showAIAssistant = ref(false);

// Hàm xử lý nút thêm mới thủ công (sau này sẽ mở Modal hoặc chuyển trang)
const handleCreateNew = () => {
  console.log("Đã bấm thêm mới chứng từ thủ công!");
  alert("Tính năng thêm thủ công đang phát triển...");
};
</script>

<style scoped>
.document-page {
  padding: 24px;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
}
</style>