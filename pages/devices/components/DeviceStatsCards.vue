<!-- filepath: c:\IOT\Frontend\pages\devices\components\DeviceStatsCards.vue -->
<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Loading State -->
    <div v-if="statsLoading" class="px-6 py-8 text-center">
      <div class="inline-flex items-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
        <span class="text-gray-600">Đang tải thống kê...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!statsData || statsData.stats_by_date && Object.keys(statsData.stats_by_date).length === 0" 
      class="px-6 py-8 text-center">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-gray-500">Không có dữ liệu thống kê cho ngày này</p>
    </div>

    <!-- Stats Data -->
    <div v-else>
      <!-- Header with Date Info -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Thống kê ngày {{ formatDate(statsData.start_date) }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              Tổng số thiết bị: {{ Object.keys(statsData.stats_by_date[statsData.start_date] || {}).length }} thiết bị
            </p>
          </div>
        </div>
      </div>

      <!-- Stats by Date -->
      <div v-for="(devices, date) in statsData.stats_by_date" :key="date" class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="device in devices" 
            :key="device.device_name"
            class="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <!-- Device Header -->
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg" :class="getDeviceIconBg(device.device_name)">
                <component :is="getDeviceIcon(device.device_name)" 
                  class="w-5 h-5" 
                  :class="getDeviceIconColor(device.device_name)" 
                />
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-800">{{ getDeviceName(device.device_name) }}</h4>
                <span class="text-xs text-gray-500">{{ device.total_actions }} hành động</span>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3">
              <!-- ON Count -->
              <div class="bg-green-50 rounded-lg p-3 border border-green-100">
                <div class="text-xs text-green-700 font-medium mb-1">Bật</div>
                <div class="text-2xl font-bold text-green-600">{{ device.on_count }}</div>
              </div>

              <!-- OFF Count -->
              <div class="bg-red-50 rounded-lg p-3 border border-red-100">
                <div class="text-xs text-red-700 font-medium mb-1">Tắt</div>
                <div class="text-2xl font-bold text-red-600">{{ device.off_count }}</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                  :style="{ width: `${(parseInt(device.on_count) / device.total_actions * 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>{{ Math.round(parseInt(device.on_count) / device.total_actions * 100) }}% Bật</span>
                <span>{{ Math.round(parseInt(device.off_count) / device.total_actions * 100) }}% Tắt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconLed from '~/components/global/IconLed.vue'
import IconFan from '~/components/global/IconFan.vue' 
import IconAir from '~/components/global/IconAir.vue'
import IconBell from '~/components/global/IconBell.vue'
import IconDoor from '~/components/global/IconDoor.vue'

defineProps({
  statsData: {
    type: Object,
    default: null
  },
  statsLoading: {
    type: Boolean,
    required: true
  },
  getDeviceName: {
    type: Function,
    required: true
  },
  formatDate: {
    type: Function,
    required: true
  }
})

// Device icon utilities
const getDeviceIcon = (deviceName) => {
  const icons = {
    'den': 'IconLed',
    'quat': 'IconFan',
    'dieuhoa': 'IconAir',
    'chuong': 'IconBell',
    'cua': 'IconDoor'
  }
  return icons[deviceName] || 'IconLed'
}

const getDeviceIconBg = (deviceName) => {
  const backgrounds = {
    'den': 'bg-orange-100',
    'quat': 'bg-purple-100',
    'dieuhoa': 'bg-blue-100',
    'chuong': 'bg-yellow-100',
    'cua': 'bg-green-100'
  }
  return backgrounds[deviceName] || 'bg-gray-100'
}

const getDeviceIconColor = (deviceName) => {
  const colors = {
    'den': 'text-orange-600',
    'quat': 'text-purple-600',
    'dieuhoa': 'text-blue-600',
    'chuong': 'text-yellow-600',
    'cua': 'text-green-600'
  }
  return colors[deviceName] || 'text-gray-600'
}
</script>