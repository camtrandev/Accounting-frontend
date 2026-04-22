<template>
  <div class="card">
    <div class="card-header">
      <h3>Dòng tiền</h3>
      <select>
        <option>Năm 2026</option>
      </select>
    </div>
    
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Bar } from "vue-chartjs"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,    // Thêm PointElement cho biểu đồ đường
  LineElement,     // Thêm LineElement cho biểu đồ đường
  LineController,  // Thêm Controller để vẽ Line trên Bar chart
  Tooltip,
  Legend,
  Title
} from "chart.js"

// Đăng ký tất cả các element cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
  Title
)

// Dữ liệu mẫu (Bạn có thể thay thế bằng dữ liệu gọi từ API sau này)
const dataThu = [350, 650, 550, 500, 800, 380, 380, 550, 520, 700, 500, 480];
const dataChi = [150, 350, 300, 400, 300, 350, 280, 250, 320, 200, 400, 350];
// Dòng tiền thuần = Thu - Chi
const dataThuan = dataThu.map((thu, index) => thu - dataChi[index]);

const chartData = {
  labels: [
    "T1", "T2", "T3", "T4", "T5", "T6", 
    "T7", "T8", "T9", "T10", "T11", "T12"
  ],
  datasets: [
    {
      type: "line", // Chỉ định dataset này là biểu đồ đường
      label: "Dòng tiền thuần",
      data: dataThuan,
      borderColor: "#3b82f6", // Màu xanh dương
      backgroundColor: "#3b82f6",
      borderWidth: 2,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#3b82f6",
      pointBorderWidth: 2,
      pointRadius: 4,
      tension: 0.4, // Tạo độ cong mềm mại cho đường (Bezier curve)
      order: 1 // Đảm bảo đường line vẽ đè lên trên cột
    },
    {
      type: "bar",
      label: "Tiền thu",
      data: dataThu,
      backgroundColor: "#22c55e", // Xanh lá
      borderRadius: 2,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
      order: 2
    },
    {
      type: "bar",
      label: "Tiền chi",
      data: dataChi,
      backgroundColor: "#ef4444", // Đỏ
      borderRadius: 2,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
      order: 3
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'center',
      labels: {
        usePointStyle: true, // Biến icon chú thích thành hình tròn/vuông nhỏ
        boxWidth: 8,
        boxHeight: 8,
        font: {
          family: 'sans-serif',
          size: 13
        },
        padding: 20
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '2024',
        color: '#9ca3af',
        font: { size: 12, weight: 'bold' }
      },
      grid: {
        display: false // Ẩn đường kẻ dọc để giống ảnh
      },
      ticks: {
        color: '#4b5563'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Triệu đồng',
        color: '#6b7280',
        font: { size: 12 }
      },
      min: -500,
      max: 1500,
      ticks: {
        stepSize: 500,
        color: '#4b5563'
      },
      grid: {
        color: '#f3f4f6', // Màu đường kẻ ngang mờ
        drawBorder: false // Ẩn viền trục Y
      }
    }
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.chart-container {
  position: relative;
  height: 320px; /* Cố định chiều cao cho chart */
  width: 100%;
}
</style>