<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Statistics</h3>
        <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Fan</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Led</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-pink-400 rounded-full"></div>
            <span>Air conditioner</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Canvas -->
    <div class="h-64 relative">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const chartCanvas = ref(null)

// Fake data for the chart
const chartData = {
  labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
  datasets: [
    {
      label: 'Fan',
      data: [20, 25, 30, 35, 32, 38, 42, 45, 48, 50],
      borderColor: '#60A5FA',
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Led',
      data: [15, 20, 25, 28, 30, 35, 38, 40, 42, 45],
      borderColor: '#34D399',
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Air conditioner',
      data: [10, 15, 18, 22, 25, 28, 30, 32, 35, 38],
      borderColor: '#F472B6',
      backgroundColor: 'rgba(244, 114, 182, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}

// Simple chart drawing function
const drawChart = () => {
  const canvas = chartCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Set canvas size
  canvas.width = width
  canvas.height = height
  
  // Chart settings
  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding
  
  // Draw grid lines
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1
  
  // Vertical grid lines
  for (let i = 0; i <= 10; i++) {
    const x = padding + (i * chartWidth) / 10
    ctx.beginPath()
    ctx.moveTo(x, padding)
    ctx.lineTo(x, height - padding)
    ctx.stroke()
  }
  
  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * chartHeight) / 5
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }
  
  // Draw data lines
  chartData.datasets.forEach((dataset, index) => {
    ctx.strokeStyle = dataset.borderColor
    ctx.lineWidth = 3
    ctx.beginPath()
    
    dataset.data.forEach((value, i) => {
      const x = padding + (i * chartWidth) / (dataset.data.length - 1)
      const y = height - padding - (value / 60) * chartHeight
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
    
    // Fill area under curve
    ctx.fillStyle = dataset.backgroundColor
    ctx.fill()
  })
}

onMounted(async () => {
  await nextTick()
  drawChart()
  
  // Redraw on window resize
  window.addEventListener('resize', drawChart)
})
</script>