<template>
  <div class="card">
    <div class="card-header">
      <h3>Tỷ lệ chi phí</h3>
      <select>
        <option>Năm 2026</option>
      </select>
    </div>

    <div class="content">
      <div class="label">
        Chi phí / Doanh thu
      </div>

      <div class="progress-container">
        <div class="progress">
          <div
            class="bar"
            :style="{ width: percent + '%' }"
          ></div>
        </div>
        
        <div class="percent-text">
          <span class="current">{{ percent }}%</span>
          <span class="total">100%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Gán ref để làm reactive data gọi từ API
const percent = ref(68)
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h3 {
  font-family: "Times New Roman", Times, serif;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

select {
  font-family: "Times New Roman", Times, serif;
  background-color: #f3f4f6;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  outline: none;
  cursor: pointer;
}

/* Content */
.label {
  font-family: sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress {
  flex: 1;
  height: 12px;
  background: #f3f4f6;
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #22c55e; /* Màu xanh lá chuẩn */
  border-radius: 6px;
  transition: width 0.5s ease-in-out;
}

.percent-text {
  font-family: sans-serif;
  font-size: 13px;
  white-space: nowrap;
}

.current {
  font-weight: 700;
  color: #111827;
  margin-right: 4px;
}

.total {
  color: #9ca3af;
}
</style>