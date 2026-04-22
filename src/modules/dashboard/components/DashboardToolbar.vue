<template>
  <div class="toolbar">

    <div class="left">

      <h1>Dashboard</h1>

      <p>
        Tổng quan tình hình hoạt động tài chính của doanh nghiệp
      </p>

    </div>

    <div class="right">

      <!-- Month -->

      <select class="month">
        <option>Tháng 5, 2024</option>
        <option>Tháng 4, 2024</option>
        <option>Tháng 3, 2024</option>
      </select>

      <!-- Export -->

      <button class="export">
        Xuất báo cáo
      </button>

    </div>

  </div>
</template>

<style scoped>

.toolbar {

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 20px 24px;
}

/* Left */

.left h1 {

  font-size: 24px;
  font-weight: 700;

  margin-bottom: 4px;
}

.left p {

  font-size: 13px;
  color: #6b7280;
}

/* Right */

.right {

  display: flex;
  align-items: center;
  gap: 12px;
}

/* Month */

.month {

  height: 36px;

  border-radius: 8px;
  border: 1px solid #e5e7eb;

  padding: 0 12px;
}

/* Export */

.export {

  height: 36px;

  background: linear-gradient(
    90deg,
    #6366f1,
    #8b5cf6
  );

  color: white;

  border: none;

  border-radius: 8px;

  padding: 0 16px;

  font-weight: 500;

  cursor: pointer;
}

.export:hover {
  opacity: 0.9;
}

</style>