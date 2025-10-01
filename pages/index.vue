<template>
  <div class="space-y-6 px-14 mt-[73px]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-50">
      <StatisticsStatsCard title="Nhiệt độ" :value="`${latestSensorData.temp || 0}°C`" icon="IconTemperature"
        color="pink" />
      <StatisticsStatsCard title="Độ ẩm" :value="`${latestSensorData.humidity || 0}%`" icon="IconHumidity"
        color="blue" />
      <StatisticsStatsCard title="Ánh sáng" :value="`${latestSensorData.lux || 0} LUX`" icon="IconLight"
        color="green" />
    </div>

    <div class="flex items-center gap-4 mt-10" style="margin-top: 50px">
      <div class="flex-1 rounded-lg p-1 shadow-md">
        <StatisticsSensorChart class="w-250" :sensor-data="sensorData" :is-loading="isSensorLoading"
          @refresh="handleSensorRefresh" />
      </div>
      <div class="flex-1 rounded-lg p-10 shadow-md">
        <div class="flex items-center gap-3">
          <IconShortCut />
          <span class="text-lg font-semibold">
            Short Cut
          </span>
        </div>
        <div class="space-y-4 mt-7">
          <div v-if="results?.data?.devices?.length > 0">
            <div v-for="device in results.data.devices" :key="device.device_name"
              class="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-102 mb-5">

              <div
                class=" absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>

              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div v-if="device.action === 'ON'" class="absolute inset-0 rounded-2xl blur-md opacity-30" :class="{
                      'bg-orange-400': device.device_name === 'den',
                      'bg-purple-400': device.device_name === 'quat',
                      'bg-blue-400': device.device_name === 'dieuhoa'
                    }"></div>

                    <!-- Icon Container -->
                    <div
                      class="relative p-4 rounded-2xl transition-all duration-300 group-hover:transform group-hover:rotate-6 gap-2"
                      :class="{
                        'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 shadow-orange-500/25': device.device_name === 'den',
                        'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 shadow-purple-500/25': device.device_name === 'quat',
                        'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 shadow-blue-500/25': device.device_name === 'dieuhoa'
                      }">

                      <IconLed v-if="device.device_name === 'den'" class="w-8 h-8 text-white drop-shadow-lg"
                        :class="{ 'animate-pulse': device.action === 'ON' }" />
                      <IconFan v-else-if="device.device_name === 'quat'"
                        class="w-8 h-8 text-white drop-shadow-lg transition-transform duration-500 "
                        :class="{ 'animate-spin': device.action === 'ON' }" />
                      <IconAir v-else-if="device.device_name === 'dieuhoa'" class="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div>
                    <h4 class="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {{ getDeviceName(device.device_name) }}
                    </h4>
                    <p class="text-sm transition-colors"
                      :class="device.action === 'ON' ? 'text-green-600 font-medium' : 'text-gray-500'">
                      {{ device.action === 'ON' ? 'Đang hoạt động' : 'Tắt' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300" :class="device.action === 'ON'
                    ? 'bg-green-100 text-green-700 shadow-green-100'
                    : 'bg-gray-100 text-gray-600'">
                    {{ device.action === 'ON' ? 'ON' : 'OFF' }}
                  </div>

                  <!-- Premium Toggle Switch -->
                  <label class="relative inline-flex items-center cursor-pointer group/toggle">
                    <input type="checkbox" :checked="device.action === 'ON'" class="sr-only peer"
                      @change="toggleDevice(device)" :disabled="isToggling" />

                    <!-- Switch Background -->
                    <div
                      class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer transition-all duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 shadow-lg hover:shadow-xl group-hover/toggle:scale-105">

                      <!-- Inner glow when ON -->
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
let statsPollingInterval = null
let chartPollingInterval = null

// API 1: Fetch devices (chỉ gọi 1 lần)
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

// API 2: Fetch chart data (chỉ gọi khi refresh hoặc lần đầu)
const fetchSensorData = async () => {
  isSensorLoading.value = true
  try {
    const { data } = await restAPI.stores.getDataSensor({
      params: {
        page: 1,
        length: 12,
        sort: "true"
      }
    })

    const sensorDataArray = data.value?.data?.data || []
    sensorData.value = sensorDataArray

  } catch (error) {
    console.error('Error fetching sensor data:', error)
    sensorData.value = []
  } finally {
    isSensorLoading.value = false
  }
}

// API 3: Fetch latest sensor data cho stats cards (polling 2s)
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

const startStatsPolling = () => {
  fetchLatestSensorData()

  statsPollingInterval = setInterval(() => {
    fetchLatestSensorData()
  }, 6000)
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
}

const handleSensorRefresh = async () => {
  await fetchSensorData()
}

const toggleDevice = async (device) => {
  if (isToggling.value) return

  isToggling.value = true

  // LƯU TRẠNG THÁI BAN ĐẦU
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

    if (isSuccess) {
    } else {
      device.action = originalStatus
      console.error(`❌ API failed for ${device.device_name}:`, response)
    }

  } catch (error) {
    device.action = originalStatus
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
    'den': 'Đèn'
  }
  return names[deviceType] || deviceType
}
await Promise.all([
  fetchDataDevices(),
  fetchSensorData()
])
onMounted(async () => {
  await Promise.all([
    fetchDataDevices(),
    fetchSensorData()
  ])

  startStatsPolling()
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