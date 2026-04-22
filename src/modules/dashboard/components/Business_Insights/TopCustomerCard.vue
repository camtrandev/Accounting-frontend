<template>
  <div class="card">
    <div class="card-header">
      <h3>Top 5 khách hàng</h3>
      <select>
        <option>Năm 2026</option>
      </select>
    </div>

    <div class="list">
      <div v-for="item in customers" :key="item.name" class="row">
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
const customers = [
  {
    name: "Công ty TNHH ABC",
    percent: 90,
    value: "320.000.000 đ",
    color: "#3b82f6" // Xanh dương
  },
  {
    name: "Công ty Cổ phần XYZ",
    percent: 70,
    value: "250.000.000 đ",
    color: "#22c55e" // Xanh lá
  },
  {
    name: "Công ty TNHH DEF",
    percent: 50,
    value: "180.000.000 đ",
    color: "#eab308" // Vàng
  },
  {
    name: "Công ty Cổ phần GHI",
    percent: 30,
    value: "120.000.000 đ",
    color: "#ef4444" // Đỏ
  },
  {
    name: "Công ty TNHH JKL",
    percent: 15,
    value: "80.000.000 đ",
    color: "#c7d2fe" // Xanh dương nhạt
  }
]
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* Thêm shadow nhẹ cho nổi bật */
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
  height: 12px; /* Chiều cao bao ngoài */
  display: flex;
  align-items: center;
  border-left: 2px solid #f3f4f6; /* Đường kẻ dọc mờ làm gốc */
}

.bar {
  height: 10px; /* Chiều cao thực tế của bar */
  border-radius: 0 6px 6px 0; /* Chỉ bo tròn góc bên phải */
  transition: width 0.3s ease; /* Hiệu ứng mượt khi load */
}

.value {
  font-family: sans-serif;
  text-align: right;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}
</style>