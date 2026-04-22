<template>
  <div class="card">
    <div class="card-header">
      <h3>Top 5 nhà cung cấp</h3>
      <select>
        <option>Năm 2026</option>
      </select>
    </div>

    <div class="list">
      <div v-for="item in suppliers" :key="item.name" class="row">
        <div class="name">
          {{ item.name }}
        </div>
        <div class="bar-wrapper">
          <div
            class="bar"
            :style="{ width: item.percent + '%', backgroundColor: item.color }"
          ></div>
        </div>
        <div class="value">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const suppliers = [
  {
    name: "Công ty TNHH Nhà cung cấp A",
    percent: 90,
    value: "220.000.000 đ",
    color: "#ef4444" // Đỏ đậm
  },
  {
    name: "Công ty Cổ phần B",
    percent: 75,
    value: "180.000.000 đ",
    color: "#f87171" // Đỏ nhạt hơn
  },
  {
    name: "Công ty TNHH C",
    percent: 60,
    value: "150.000.000 đ",
    color: "#fca5a5" 
  },
  {
    name: "Công ty Cổ phần D",
    percent: 45,
    value: "100.000.000 đ",
    color: "#fecaca" 
  },
  {
    name: "Công ty TNHH E",
    percent: 30,
    value: "70.000.000 đ",
    color: "#fee2e2" // Đỏ rất nhạt
  }
]
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Tăng từ 20px lên 36px để cách xa dòng đầu tiên hơn */
  margin-bottom: 60px; 
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

/* List */
.row {
  display: grid;
  /* Lưu ý: Giữ nguyên grid-template-columns cũ của từng file nhé */
  grid-template-columns: 160px 1fr 110px; /* Của file Khách hàng (File Nhà cung cấp là 180px) */
  align-items: center;
  /* Tăng từ 16px lên 28px để các dòng dãn xa nhau ra */
  margin-bottom: 28px; 
  gap: 12px;
}

/* Bỏ margin ở dòng cuối cùng để padding đáy của card được đều */
.row:last-child {
  margin-bottom: 0;
}

.name {
  font-family: sans-serif;
  font-size: 13px;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-wrapper {
  height: 12px;
  display: flex;
  align-items: center;
  border-left: 2px solid #f3f4f6; 
}

.bar {
  height: 10px;
  border-radius: 0 6px 6px 0;
  transition: width 0.3s ease;
}

.value {
  font-family: sans-serif;
  text-align: right;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}
</style>