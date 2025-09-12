<template>
  <HeaderBanner />
  <div class="space-y-6 px-14 mt-[73px]">
    <!-- Real-time sensor cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatisticsStatsCard 
        title="Temperature" 
        :value="`${sensorData.temp}°C`" 
        icon="IconTemperature" 
        color="green" 
      />
      <StatisticsStatsCard 
        title="Humidity" 
        :value="`${sensorData.humidity}%`" 
        icon="IconHumidity" 
        color="pink" 
      />
      <StatisticsStatsCard 
        title="Light" 
        :value="`${sensorData.lux} LUX`" 
        icon="IconLight" 
        color="blue" 
      />
    </div>
    
    <div class="flex items-center gap-4 mt-10" style="margin-top: 50px">
      <!-- Chart with real-time data -->
      <div class="flex-1 rounded-lg p-1 shadow-md">
        <StatisticsSensorChart :realtime-data="sensorData" />
      </div>
      
      <!-- Device controls -->
      <div class="flex-1 rounded-lg p-10 shadow-md">
        <div class="flex items-center gap-3">
          <IconShortCut />
          <span class="text-lg font-semibold">Short Cut</span>
        </div>
        
        <div v-if="loading" class="mt-7 text-center text-gray-500">
          Đang tải thiết bị...
        </div>
        
        <div v-else class="space-y-4 mt-7">
          <div v-for="device in devices" :key="device.device_name" class="flex items-center justify-between">
            <div class="flex items-center gap-5">
              <div class="rounded-lg flex items-center justify-center">
                <IconLed v-if="device.device_name === 'den'" class="text-white bg-purple-500 p-2 rounded-lg h-15 w-15" />
                <IconFan v-else-if="device.device_name === 'quat'" class="text-white bg-orange-500 p-2 rounded-lg h-15 w-15" />
                <IconAir v-else-if="device.device_name === 'dieuhoa'" class="text-white bg-gray-500 p-2 rounded-lg h-15 w-15" />
              </div>
              <div class="flex flex-col">
                <!-- Hiển thị display_name từ API -->
                <span class="font-medium">{{ device.display_name }}</span>
                <!-- Hiển thị thời gian cập nhật cuối -->
                <span class="text-xs text-gray-400">
                  {{ formatLastUpdated(device.last_updated) }}
                </span>
              </div>
            </div>
            
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                :checked="getDeviceStatus(device) === 'ON'" 
                class="sr-only peer" 
                @change="toggleDevice(device)"
                :disabled="isToggling"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSocket } from '~/composables/useSocket'
import { useSensorData } from '~/composables/useSensorData'
import { useDevices } from '~/composables/useDevices'

// Kết nối socket
const { isConnected, deviceStatuses, connectionError, latestSensorData, connect, disconnect } = useSocket()

// Lấy dữ liệu cảm biến
const { sensorData } = useSensorData({ latestSensorData })

// Lấy và điều khiển thiết bị - pass deviceStatuses để sync real-time
const { devices, loading, isToggling, toggleDevice, getDeviceStatus, formatLastUpdated } = useDevices({ 
  deviceStatuses 
})

// Lifecycle
onMounted(() => {
  console.log('🚀 Page mounted, connecting socket...')
  connect()
})

onBeforeUnmount(() => {
  disconnect()
})
</script>