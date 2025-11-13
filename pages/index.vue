<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Sensor Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-15">
      <StatisticsStatsCard title="Nhiệt độ" :value="`${latestSensorData.temp || 0}°C`" icon="IconTemperature"
        color="pink" />
      <StatisticsStatsCard title="Độ ẩm" :value="`${latestSensorData.humidity || 0}%`" icon="IconHumidity"
        color="blue" />
      <StatisticsStatsCard title="Ánh sáng" :value="`${latestSensorData.lux || 0} LUX`" icon="IconLight"
        color="green" />
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

              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>

              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <!-- Glow effect khi ON -->
                    <div v-if="device.action === 'ON'" class="absolute inset-0 rounded-2xl blur-md opacity-30" :class="{
                      'bg-orange-400': device.device_name === 'den',
                      'bg-purple-400': device.device_name === 'quat',
                      'bg-blue-400': device.device_name === 'dieuhoa',
                      'bg-yellow-400': device.device_name === 'chuong',
                      'bg-green-400': device.device_name === 'cua'
                    }"></div>

                    <!-- Icon Container -->
                    <div
                      class="relative p-4 rounded-2xl transition-all duration-300 group-hover:transform group-hover:rotate-6"
                      :class="{
                        'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 shadow-orange-500/25': device.device_name === 'den',
                        'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 shadow-purple-500/25': device.device_name === 'quat',
                        'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 shadow-blue-500/25': device.device_name === 'dieuhoa',
                        'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 shadow-yellow-500/25': device.device_name === 'chuong',
                        'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 shadow-green-500/25': device.device_name === 'cua'
                      }">

                      <!-- Icons -->
                      <IconLed v-if="device.device_name === 'den'" class="w-8 h-8 text-white drop-shadow-lg"
                        :class="{ 'animate-pulse': device.action === 'ON' }" />
                      <IconFan v-else-if="device.device_name === 'quat'"
                        class="w-8 h-8 text-white drop-shadow-lg transition-transform duration-500"
                        :class="{ 'animate-spin': device.action === 'ON' }" />
                      <IconAir v-else-if="device.device_name === 'dieuhoa'" class="w-8 h-8 text-white drop-shadow-lg" />
                      <IconBell v-else-if="device.device_name === 'chuong'" class="w-8 h-8 text-white drop-shadow-lg"
                        :class="{ 'animate-bounce': device.action === 'ON' }" />
                      <IconDoor v-else-if="device.device_name === 'cua'" class="w-8 h-8 text-white drop-shadow-lg" />
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
                  <div class="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300" :class="device.action === 'ON'
                    ? 'bg-green-100 text-green-700 shadow-green-100'
                    : 'bg-gray-100 text-gray-600'">
                    {{ device.action === 'ON' ? 'ON' : 'OFF' }}
                  </div>

                  <!-- Toggle Switch -->
                  <label class="relative inline-flex items-center cursor-pointer group/toggle">
                    <input type="checkbox" :checked="device.action === 'ON'" class="sr-only peer"
                      @change="toggleDevice(device)" :disabled="isToggling" />

                    <div
                      class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer transition-all duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 shadow-lg hover:shadow-xl group-hover/toggle:scale-105">
                      <div v-if="device.action === 'ON'"
                        class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse">
                      </div>
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

          <!--  THÊM PHẦN THỐNG KÊ BẬT TẮT TRONG NGÀY -->
          <div class="mt-8">
            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
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

              <div v-if="isLoadingStats" class="text-center py-8">
                <div
                  class="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin">
                </div>
                <p class="text-sm text-gray-500 mt-2">Đang tải...</p>
              </div>

              <div v-else-if="deviceStats?.stats?.length > 0" class="space-y-3">
                <div v-for="stat in deviceStats.stats" :key="stat.device_name"
                  class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg" :class="{
                        'bg-orange-100': stat.device_name === 'den',
                        'bg-purple-100': stat.device_name === 'quat',
                        'bg-blue-100': stat.device_name === 'dieuhoa',
                        'bg-yellow-100': stat.device_name === 'chuong',
                        'bg-green-100': stat.device_name === 'cua'
                      }">
                        <IconLed v-if="stat.device_name === 'den'" class="w-4 h-4" :class="'text-orange-600'" />
                        <IconFan v-else-if="stat.device_name === 'quat'" class="w-4 h-4 text-purple-600" />
                        <IconAir v-else-if="stat.device_name === 'dieuhoa'" class="w-4 h-4 text-blue-600" />
                        <IconBell v-else-if="stat.device_name === 'chuong'" class="w-4 h-4 text-yellow-600" />
                        <IconDoor v-else-if="stat.device_name === 'cua'" class="w-4 h-4 text-green-600" />
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
const route = useRoute()
const { restAPI } = useAPI()

const results = ref({
  data: {
    devices: []
  }
})
const isToggling = ref(false)
const isLoadingDevices = ref(false)
const sensorData = ref([])
const isSensorLoading = ref(false)
const latestSensorData = ref({
  temp: 0,
  humidity: 0,
  lux: 0
})

//  THÊM STATE CHO THỐNG KÊ
const deviceStats = ref(null)
const isLoadingStats = ref(false)

let statsPollingInterval = null
let chartPollingInterval = null
let deviceStatsPollingInterval = null // THÊM POLLING CHO STATS

// API 1: Fetch devices
const fetchDataDevices = async () => {
  isLoadingDevices.value = true
  try {
    const { data } = await restAPI.stores.getListDevice({
      params: {
        page: 1,
        length: 999,
      }
    })

    if (data.value) {
      results.value = data.value
    }
  } catch (error) {
    console.error('Error fetching devices:', error)
    results.value = {
      data: {
        devices: []
      }
    }
  } finally {
    isLoadingDevices.value = false
  }
}

// API 2: Fetch chart data
const fetchSensorData = async () => {
  if (sensorData.value.length === 0) {
    isSensorLoading.value = true
  }
  try {
    const response = await restAPI.stores.getDataSensorv1({
      params: {
        page: 1,
        length: 12,
        sort: "true"
      }
    })

    const sensorDataArray = response.data?.data || []
    sensorData.value = sensorDataArray

  } catch (error) {
    console.error('Error fetching sensor data:', error)
    sensorData.value = []
  } finally {
    isSensorLoading.value = false
  }
}

// API 3: Fetch latest sensor data
const fetchLatestSensorData = async () => {
  try {
    const { data } = await restAPI.stores.getDataSensorv1({
      params: {
        page: 1,
        length: 1,
        sort: "true"
      }
    })
    const latestData = data?.data?.[0]
    if (latestData) {
      latestSensorData.value = {
        temp: latestData.temp,
        humidity: latestData.humidity,
        lux: latestData.lux
      }
    }
  } catch (error) {
    console.error('Error fetching latest sensor data:', error)
  }
}

const fetchDeviceStats = async () => {
  if (!deviceStats.value) {
    isLoadingStats.value = true
  }
  try {
    const response = await restAPI.stores.getDeviceStatsToday()

    if (response && response.status === true && response.code === 200) {
      deviceStats.value = {
        date: response.data.date,
        count: response.data.count,
        stats: response.data.stats
      }
      console.log(' Device stats loaded:', deviceStats.value)
    } else {
      console.warn(' Invalid response format:', response)
      deviceStats.value = null
    }
  } catch (error) {
    console.error('Error fetching device stats:', error)
    deviceStats.value = null
  } finally {
    isLoadingStats.value = false
  }
}

const startStatsPolling = () => {
  fetchLatestSensorData()
  statsPollingInterval = setInterval(() => {
    fetchLatestSensorData()
  }, 6000)
}

const startChartPolling = () => {
  fetchSensorData()
  chartPollingInterval = setInterval(() => {
    fetchSensorData()
  }, 6500)
}

const startDeviceStatsPolling = () => {
  fetchDeviceStats()
  deviceStatsPollingInterval = setInterval(() => {
    fetchDeviceStats()
  }, 3000) // Refresh mỗi 10 giây
}

const stopPolling = () => {
  if (statsPollingInterval) {
    clearInterval(statsPollingInterval)
    statsPollingInterval = null
  }
  if (chartPollingInterval) {
    clearInterval(chartPollingInterval)
    chartPollingInterval = null
  }
  if (deviceStatsPollingInterval) {
    clearInterval(deviceStatsPollingInterval)
    deviceStatsPollingInterval = null
  }
}

const toggleDevice = async (device) => {
  if (isToggling.value) return

  isToggling.value = true

  const originalStatus = device.action
  const newStatus = originalStatus === 'ON' ? 'OFF' : 'ON'
  device.action = newStatus

  try {
    const response = await restAPI.stores.conTrolDevice({
      body: {
        device_name: device.device_name,
        action: newStatus
      }
    })

    const isSuccess = (
      response && (
        response.code === 200 ||
        response.status === true ||
        (response.data && response.data.code === 200) ||
        (response.data && response.data.status === true)
      )
    )

    if (!isSuccess) {
      device.action = originalStatus
      console.error(` API failed for ${device.device_name}:`, response)
    } else {
      await fetchDeviceStats()
    }

  } catch (error) {
    device.action = originalStatus
    console.error('Toggle device error:', error)
  } finally {
    setTimeout(() => {
      isToggling.value = false
    }, 1000)
  }
}

const getDeviceName = (deviceType) => {
  const names = {
    'dieuhoa': 'Điều hòa',
    'quat': 'Quạt',
    'den': 'Đèn',
    'chuong': 'Chuông',
    'cua': 'Cửa'
  }
  return names[deviceType] || deviceType
}

const getDeviceStatus = (device) => {
  if (device.device_name === 'cua') {
    return device.action === 'ON' ? 'Đang mở' : 'Đóng'
  }
  if (device.device_name === 'chuong') {
    return device.action === 'ON' ? 'Đang kêu' : 'Tắt'
  }
  return device.action === 'ON' ? 'Đang hoạt động' : 'Tắt'
}

await fetchDataDevices()

onMounted(async () => {
  await fetchDataDevices()
  startStatsPolling()
  startChartPolling()
  startDeviceStatsPolling()
})

onUnmounted(() => {
  stopPolling()
})

onBeforeRouteLeave(() => {
  stopPolling()
})

definePageMeta({
  middleware: 'auth'
})
</script>