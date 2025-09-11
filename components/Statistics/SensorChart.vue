<template>
  <div>    
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />

    <div v-else class="flex items-center justify-center h-64">
      <p class="text-gray-500">Đang tải dữ liệu...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Đăng ký plugin cho Chart.js
ChartJS.register(
  Title, Tooltip, Legend,
  LineElement, PointElement,
  LinearScale, CategoryScale
)

// Dữ liệu gốc
const data = ref([
  { temp: '32.8', humidity: '66', lux: '2151', time: '2024-06-11 14:30:00' },
  { temp: '30.8', humidity: '89', lux: '1000', time: '2024-06-12 14:30:00' },
  { temp: '28', humidity: '70', lux: '1500', time: '2024-06-13 14:30:00' },
  { temp: '20', humidity: '66', lux: '3000', time: '2024-06-13 14:31:00' },
  { temp: '15', humidity: '90', lux: '1250', time: '2024-06-14 14:32:00' },
  { temp: '32.8', humidity: '19', lux: '800', time: '2024-06-14 07:30:00' },
  { temp: '32.8', humidity: '66', lux: '2151', time: '2025-06-11 14:30:00' },
  { temp: '30.8', humidity: '89', lux: '1000', time: '2025-06-12 14:30:00' },
  { temp: '28', humidity: '70', lux: '1500', time: '2025-06-13 14:30:00' },
  { temp: '20', humidity: '66', lux: '3000', time: '2025-06-13 14:31:00' },
  { temp: '15', humidity: '90', lux: '1250', time: '2025-06-14 14:32:00' },
  { temp: '32.8', humidity: '19', lux: '800', time: '2025-06-14 07:30:00' }
])

// chartData luôn có labels + datasets
const chartData = computed(() => {
  if (!data.value || data.value.length === 0) return null

  return {
    labels: data.value.map(d => d.time),
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: data.value.map(d => parseFloat(d.temp)),
        borderColor: 'red',
        backgroundColor: 'red',
        yAxisID: 'y'
      },
      {
        label: 'Độ ẩm (%)',
        data: data.value.map(d => parseFloat(d.humidity)),
        borderColor: 'blue',
        backgroundColor: 'blue',
        yAxisID: 'y'
      },
      {
        label: 'Ánh sáng (lux)',
        data: data.value.map(d => parseFloat(d.lux)),
        borderColor: 'green',
        backgroundColor: 'green',
        yAxisID: 'y1'
      }
    ]
  }
})

// Cấu hình chart
const chartOptions = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Biểu đồ 2 trục Y (Temp + Humidity / Lux)'
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left'
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false
      }
    }
  }
}
</script>