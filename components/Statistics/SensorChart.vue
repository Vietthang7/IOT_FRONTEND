<template>
  <div>
    <div class="bg-white rounded-lg ">
      <Line v-if="chartData && !isLoading" :data="chartData" :options="chartOptions" />

      <div v-else class="flex items-center justify-center h-64">
        <div v-if="isLoading" class="flex flex-col items-center gap-2">
          <svg class="animate-spin w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p class="text-gray-500">Đang tải dữ liệu...</p>
        </div>
        <p v-else class="text-gray-500">Không có dữ liệu để hiển thị</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

// Define props
const props = defineProps({
  sensorData: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

// Define emits
const emit = defineEmits(['refresh']);

// Handle refresh button click
const handleRefresh = () => {
  emit('refresh');
}

// chartData computed từ props
const chartData = computed(() => {
  if (!props.sensorData || props.sensorData.length === 0) {
    return null;
  }

  const reversedData = [...props.sensorData].reverse();
  console.log('📈 Chart data computed with', reversedData.length, 'records');

  return {
    labels: reversedData.map(d => {
      const date = new Date(d.time);
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }),
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: reversedData.map(d => parseFloat(d.temp)),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Độ ẩm (%)',
        data: reversedData.map(d => parseFloat(d.humidity)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Ánh sáng (lux)',
        data: reversedData.map(d => parseFloat(d.lux)),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };
});

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
      text: 'Biểu đồ 2 trục Y (Temp + Humidity / Lux)',
      font: {
        size: 14
      }
    },
    legend: {
      display: true,
      position: 'top'
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'Nhiệt độ (°C) / Độ ẩm (%)'
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Ánh sáng (lux)'
      },
      grid: {
        drawOnChartArea: false
      }
    }
  }
};
</script>