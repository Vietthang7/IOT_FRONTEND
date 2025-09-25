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
              class="flex items-center justify-between">
              <div class="flex items-center gap-5">
                <div class="rounded-lg flex items-center justify-center">
                  <IconLed v-if="device.device_name === 'den'"
                    class="text-white bg-#FF7A50 p-2 rounded-lg h-[60px] w-[60px]" />
                  <IconFan v-else-if="device.device_name === 'quat'"
                    class="text-white bg-#9350FF p-2 rounded-lg h-[60px] w-[60px] my-2" />
                  <IconAir v-else-if="device.device_name === 'dieuhoa'"
                    class="text-white bg-#AAAAAA p-2 rounded-lg h-15 w-15 mt-2" />
                </div>
                <span class="font-medium capitalize">{{ getDeviceName(device.device_name) }}</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" :checked="device.status === 'ON'" class="sr-only peer"
                  @change="toggleDevice(device)" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
              </label>
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
  const currentStatus = device.status
  const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON'

  try {
    const response = await restAPI.stores.conTrolDevice({
      body: {
        device_name: device.device_name,
        action: newStatus
      }
    })

    if (response && (response.status === true || response.code === 200)) {
      device.status = newStatus
    }
  } catch (error) {
    console.error("Error controlling device:", error)
  } finally {
    isToggling.value = false
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
</script>