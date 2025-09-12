import { io } from 'socket.io-client'

let socket = null

export const useSocket = () => {
  const isConnected = ref(false)
  const connectionError = ref(null)
  const latestSensorData = ref({
    temp: 0,
    humidity: 0,
    lux: 0
  })
  const deviceStatuses = ref({})

  const connect = () => {
    if (!socket) {
      console.log('🔌 Connecting to Socket.IO server...')
      
      socket = io('http://localhost:3002', {
        transports: ['polling'],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000
      })

      socket.on('connect', () => {
        isConnected.value = true
        connectionError.value = null
        console.log('✅ Connected to Socket.IO server')
      })

      socket.on('disconnect', () => {
        isConnected.value = false
        console.log('❌ Disconnected from Socket.IO server')
      })

      socket.on('connect_error', (error) => {
        connectionError.value = `Connection failed: ${error.message}`
        console.error('🚫 Socket.IO connection error:', error)
      })

      // Listen for sensor data từ MQTT
      socket.on('sensor_data', (data) => {
        console.log('📊 Received sensor data:', data)
        processSensorData(data)
      })

      // Listen for device status confirmed từ MQTT
      socket.on('device_status_confirmed', (data) => {
        console.log('✅ Device status confirmed:', data)
        if (data.device && data.action) {
          deviceStatuses.value[data.device] = data.action
        }
      })
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
      isConnected.value = false
    }
  }

  const processSensorData = (payload) => {
    try {
      if (typeof payload === 'string') {
        // Format: "Temperature: 32.8 *C, Humidity: 66 %, Light: 2151"
        const tempMatch = payload.match(/Temperature:\s*([\d.]+)/)
        const humidityMatch = payload.match(/Humidity:\s*([\d.]+)/)
        const lightMatch = payload.match(/Light:\s*(\d+)/)

        if (tempMatch && humidityMatch && lightMatch) {
          latestSensorData.value = {
            temp: parseFloat(tempMatch[1]),
            humidity: parseFloat(humidityMatch[1]),
            lux: parseInt(lightMatch[1])
          }
          console.log('📈 Updated sensor data:', latestSensorData.value)
        }
      } else if (typeof payload === 'object') {
        latestSensorData.value = {
          temp: parseFloat(payload.temp || payload.temperature || 0),
          humidity: parseFloat(payload.humidity || 0),
          lux: parseInt(payload.lux || payload.light || 0)
        }
        console.log('📈 Updated sensor data:', latestSensorData.value)
      }
    } catch (error) {
      console.error('Error processing sensor data:', error)
    }
  }

  return {
    isConnected: readonly(isConnected),
    connectionError: readonly(connectionError),
    latestSensorData: readonly(latestSensorData),
    deviceStatuses: readonly(deviceStatuses),
    connect,
    disconnect
  }
}