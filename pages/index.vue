<!-- filepath: c:\IOT\Frontend\pages\index.vue -->
<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Sensor Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-15">
      <StatisticsStatsCard 
        title="Nhiệt độ" 
        :value="`${latestSensorData.temp || 0}°C`" 
        icon="IconTemperature"
        color="pink" 
      />
      <StatisticsStatsCard 
        title="Độ ẩm" 
        :value="`${latestSensorData.humidity || 0}%`" 
        icon="IconHumidity"
        color="blue" 
      />
      <StatisticsStatsCard 
        title="Ánh sáng" 
        :value="`${latestSensorData.lux || 0} LUX`" 
        icon="IconLight"
        color="green" 
      />
    </div>

    <!-- Chart and Controls -->
    <div class="flex flex-col xl:flex-row gap-8 lg:gap-6">
      <!-- Chart Section -->
      <div class="flex-1 rounded-lg p-3 lg:p-4 max-h-[700px] max-w-[700px] mr-20">
        <StatisticsSensorChart :sensor-data="sensorData" :is-loading="isSensorLoading" />
      </div>

      <!-- Device Controls Section -->
      <div class="w-full xl:w-96 2xl:w[28rem] rounded-lg p-0">
        <div class="space-y-4">
          <!-- Device Control Cards -->
          <div v-if="results?.data?.devices?.length > 0">
            <div v-for="device in results.data.devices" :key="device.device_name"
              class="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-102 mb-5">
              
              <div class="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <!-- Glow effect khi ON -->
                    <div v-if="device.action === 'ON'" class="absolute inset-0 rounded-2xl blur-md opacity-30" 
                      :class="getGlowClass(device.device_name)"></div>

                    <!-- Icon Container -->
                    <div class="relative p-4 rounded-2xl transition-all duration-300 group-hover:transform group-hover:rotate-6" 
                      :class="getIconClass(device.device_name)">
                      <!-- Dynamic Icons -->
                      <component 
                        :is="getDeviceIcon(device.device_name)" 
                        class="w-8 h-8 text-white drop-shadow-lg transition-transform duration-500" 
                        :class="getIconAnimation(device)" 
                      />
                    </div>
                  </div>

                  <div>
                    <h4 class="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {{ getDeviceName(device.device_name) }}
                    </h4>
                    <p class="text-sm transition-colors" 
                      :class="device.action === 'ON' ? 'text-green-600 font-medium' : 'text-gray-500'">
                      {{ getDeviceStatus(device) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300" 
                    :class="device.action === 'ON' ? 'bg-green-100 text-green-700 shadow-green-100' : 'bg-gray-100 text-gray-600'">
                    {{ device.action === 'ON' ? 'ON' : 'OFF' }}
                  </div>

                  <!-- Toggle Switch -->
                  <label class="relative inline-flex items-center cursor-pointer group/toggle">
                    <input 
                      type="checkbox" 
                      :checked="device.action === 'ON'" 
                      class="sr-only peer"
                      @change="toggleDevice(device)" 
                      :disabled="isToggling" 
                    />

                    <div class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer transition-all duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 shadow-lg hover:shadow-xl group-hover/toggle:scale-105">
                      <div v-if="device.action === 'ON'" class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="isLoadingDevices" class="text-center py-4">
            <p class="text-gray-500">Đang tải danh sách thiết bị...</p>
          </div>
          
          <div v-else class="text-center py-4">
            <p class="text-gray-500">Không có thiết bị nào</p>
          </div>

          <!-- Stats Panel -->
          <div class="mt-8">
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Thống kê hôm nay
                </h3>
                <span class="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                  {{ deviceStats?.date || '' }}
                </span>
              </div>

              <!-- Loading State -->
              <div v-if="isLoadingStats" class="text-center py-8">
                <div class="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p class="text-sm text-gray-500 mt-2">Đang tải...</p>
              </div>

              <!-- Stats Data -->
              <div v-else-if="deviceStats?.stats?.length > 0" class="space-y-3">
                <div v-for="stat in deviceStats.stats" :key="stat.device_name"
                  class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                  
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg" :class="getStatIconBgClass(stat.device_name)">
                        <component :is="getDeviceIcon(stat.device_name)" class="w-4 h-4" :class="getStatIconClass(stat.device_name)" />
                      </div>
                      <span class="font-semibold text-gray-800">{{ getDeviceName(stat.device_name) }}</span>
                    </div>
                    <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      {{ stat.total_actions }} lần
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-green-50 rounded-lg p-3 border border-green-100">
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-green-700 font-medium">Bật</span>
                        <span class="text-lg font-bold text-green-600">{{ stat.on_count }}</span>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-600 font-medium">Tắt</span>
                        <span class="text-lg font-bold text-gray-700">{{ stat.off_count }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-8">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p class="text-sm text-gray-500">Chưa có dữ liệu thống kê</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDashboard } from './dashboard/composables/useDashboard'

// ===== USE COMPOSABLE =====
const {
  // State
  results,
  isToggling,
  isLoadingDevices,
  sensorData,
  isSensorLoading,
  latestSensorData,
  deviceStats,
  isLoadingStats,

  // Methods
  toggleDevice,
  initializeDashboard,
  cleanup,
  getDeviceName,
  getDeviceStatus
} = useDashboard()

// ===== UTILITY FUNCTIONS =====
const getDeviceIcon = (deviceName) => {
  const icons = {
    'den': 'IconLed',
    'quat': 'IconFan',
    'dieuhoa': 'IconAir',
    'chuong': 'IconBell',
    'cua': 'IconDoor'
  }
  return icons[deviceName] || 'IconDevice'
}

const getGlowClass = (deviceName) => {
  const glows = {
    'den': 'bg-orange-400',
    'quat': 'bg-purple-400',
    'dieuhoa': 'bg-blue-400',
    'chuong': 'bg-yellow-400',
    'cua': 'bg-green-400'
  }
  return glows[deviceName] || 'bg-gray-400'
}

const getIconClass = (deviceName) => {
  const classes = {
    'den': 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 shadow-orange-500/25',
    'quat': 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 shadow-purple-500/25',
    'dieuhoa': 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 shadow-blue-500/25',
    'chuong': 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 shadow-yellow-500/25',
    'cua': 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 shadow-green-500/25'
  }
  return classes[deviceName] || 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
}

const getIconAnimation = (device) => {
  if (device.action !== 'ON') return ''
  
  const animations = {
    'den': 'animate-pulse',
    'quat': 'animate-spin',
    'chuong': 'animate-bounce'
  }
  return animations[device.device_name] || ''
}

const getStatIconBgClass = (deviceName) => {
  const classes = {
    'den': 'bg-orange-100',
    'quat': 'bg-purple-100',
    'dieuhoa': 'bg-blue-100',
    'chuong': 'bg-yellow-100',
    'cua': 'bg-green-100'
  }
  return classes[deviceName] || 'bg-gray-100'
}

const getStatIconClass = (deviceName) => {
  const classes = {
    'den': 'text-orange-600',
    'quat': 'text-purple-600',
    'dieuhoa': 'text-blue-600',
    'chuong': 'text-yellow-600',
    'cua': 'text-green-600'
  }
  return classes[deviceName] || 'text-gray-600'
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await initializeDashboard()
})

onUnmounted(() => {
  cleanup()
})

onBeforeRouteLeave(() => {
  cleanup()
})

definePageMeta({
  middleware: 'auth'
})
</script>