import { ref } from 'vue'

export const useSensorData = () => {
  const sensorData = ref({
    temp: '0',
    humidity: '0',
    lux: '0',
    time: new Date().toISOString()
  })
  const historicalData = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Lấy dữ liệu cảm biến mới nhất
  const fetchLatestSensorData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('http://localhost:3002/api/data_sensor?limit=1')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch sensor data')
      }
      
      if (result.data && result.data.length > 0) {
        sensorData.value = result.data[0]
      }
      
      return sensorData.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching sensor data:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Lấy dữ liệu lịch sử cảm biến
  const fetchHistoricalData = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      // Xây dựng query string từ params
      const queryParams = new URLSearchParams()
      
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.start_time) queryParams.append('start_time', params.start_time)
      if (params.end_time) queryParams.append('end_time', params.end_time)
      
      const url = `http://localhost:3002/api/data_sensor?${queryParams.toString()}`
      const response = await fetch(url)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch historical data')
      }
      
      historicalData.value = result.data || []
      return historicalData.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching historical data:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // Cập nhật dữ liệu cảm biến từ dữ liệu nhận được
  const updateSensorData = (data) => {
    sensorData.value = {
      ...sensorData.value,
      ...data
    }
  }

  return {
    sensorData,
    historicalData,
    isLoading,
    error,
    fetchLatestSensorData,
    fetchHistoricalData,
    updateSensorData
  }
}