<script setup>
import { Doughnut } from "vue-chartjs"
import { Chart, ArcElement, Tooltip } from "chart.js"

Chart.register(ArcElement, Tooltip)

/* DATA */
const dataValues = [60, 25, 15]
const total = 1250

const chartData = {
  labels: [
    "Doanh thu bán hàng",
    "Doanh thu dịch vụ",
    "Doanh thu khác"
  ],
  datasets: [
    {
      data: dataValues,
      backgroundColor: ["#2563eb", "#16a34a", "#f59e0b"],
      borderWidth: 0,
      spacing: 3 // tạo khoảng cách đẹp giữa các phần
    }
  ]
}

/* OPTIONS */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, //  tắt legend mặc định
    tooltip: {
      enabled: false,
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.raw}%`
      }
    }
  }
}

</script>

<template>
  <div class="card">
    <!-- HEADER -->
    <div class="header">
      <h3>Cơ cấu doanh thu</h3>
      <select>
        <option>Năm 2026</option>
      </select>
    </div>

    <!-- BODY -->
    <div class="body">
      <!-- CHART -->
      <div class="chart">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>

      <!-- LEGEND -->
      <div class="legend">
        <div class="item">
          <span class="dot blue"></span>
          <div class="info">
            <p>Doanh thu bán hàng</p>
            <span>60% · 750.000.000 đ</span>
          </div>
        </div>

        <div class="item">
          <span class="dot green"></span>
          <div class="info">
            <p>Doanh thu dịch vụ</p>
            <span>25% · 312.500.000 đ</span>
          </div>
        </div>

        <div class="item">
          <span class="dot orange"></span>
          <div class="info">
            <p>Doanh thu khác</p>
            <span>15% · 187.500.000 đ</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  height: 360px;
  padding-top: 50px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h3 {
  font-size: 16px;
  font-weight: 600;
}

/* BODY */
.body {
  display: flex;
  align-items: center;
  gap: 30px;
}

/* CHART */
.chart {
  width: 220px;
  height: 220px;
}

/* LEGEND */
.legend {
  flex: 1;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.blue {
  background: #2563eb;
}

.green {
  background: #16a34a;
}

.orange {
  background: #f59e0b;
}

.info p {
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

.info span {
  font-size: 13px;
  color: #6b7280;
}
</style>