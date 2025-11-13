export const useDashboard = () => {
  const { restAPI } = useAPI()

  // ===== STATE =====
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
  const deviceStats = ref(null)
  const isLoadingStats = ref(false)

  // Polling intervals
  let statsPollingInterval = null
  let chartPollingInterval = null
  let deviceStatsPollingInterval = null

  // ===== API METHODS =====
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
      } else {
        deviceStats.value = null
      }
    } catch (error) {
      console.error('Error fetching device stats:', error)
      deviceStats.value = null
    } finally {
      isLoadingStats.value = false
    }
  }

  // ===== POLLING METHODS =====
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
    }, 30000) 
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

  // ===== DEVICE CONTROL =====
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
        console.error(`API failed for ${device.device_name}:`, response)
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

  // ===== UTILITY FUNCTIONS =====
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

  // ===== INITIALIZATION =====
  const initializeDashboard = async () => {
    await fetchDataDevices()
    startStatsPolling()
    startChartPolling()
    startDeviceStatsPolling()
  }

  const cleanup = () => {
    stopPolling()
  }

  return {
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
    fetchDataDevices,
    fetchSensorData,
    fetchLatestSensorData,
    fetchDeviceStats,
    toggleDevice,
    getDeviceName,
    getDeviceStatus,
    initializeDashboard,
    cleanup
  }
}