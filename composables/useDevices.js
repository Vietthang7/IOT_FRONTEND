export const useDevices = (options = {}) => {
  const devices = ref([])
  const loading = ref(true)
  const isToggling = ref(false)
  
  const loadDevices = async () => {
    try {
      loading.value = true
      const response = await fetch('http://localhost:3002/api/list_devices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📱 List devices response:', result)
      
      if (result.status && result.data && result.data.devices) {
        // API trả về array các device objects với đầy đủ thông tin
        devices.value = result.data.devices
      }
    } catch (error) {
      console.error('❌ Error loading devices:', error)
    } finally {
      loading.value = false
    }
  }
  
  const toggleDevice = async (device) => {
    if (isToggling.value) return
    
    isToggling.value = true
    const currentStatus = getDeviceStatus(device)
    const newAction = currentStatus === 'ON' ? 'OFF' : 'ON'
    
    try {
      console.log(`🔄 Toggling ${device.device_name} (${device.display_name}): ${currentStatus} → ${newAction}`)
      
      const response = await fetch('http://localhost:3002/api/control_device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          device_name: device.device_name,
          action: newAction
        }),
      })
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ Control device response:', result)
      
      // Update local state ngay lập tức để UI responsive
      const deviceIndex = devices.value.findIndex(d => d.device_name === device.device_name)
      if (deviceIndex !== -1) {
        devices.value[deviceIndex].status = newAction
        devices.value[deviceIndex].last_updated = new Date().toISOString()
      }
      
    } catch (error) {
      console.error('❌ Error controlling device:', error)
    } finally {
      setTimeout(() => {
        isToggling.value = false
      }, 1000)
    }
  }

  // Get device status - ưu tiên real-time data, fallback về API data
  const getDeviceStatus = (device) => {
    // Kiểm tra real-time status từ Socket.IO trước
    if (options.deviceStatuses && options.deviceStatuses.value) {
      const realtimeStatus = options.deviceStatuses.value[device.device_name]
      if (realtimeStatus) {
        return realtimeStatus
      }
    }
    
    // Fallback về status từ API
    return device.status || 'OFF'
  }

  // Format last updated time
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Chưa cập nhật'
    
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / (1000 * 60))
      
      if (diffMins < 1) return 'Vừa xong'
      if (diffMins < 60) return `${diffMins} phút trước`
      
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Không xác định'
    }
  }

  // Watch for real-time device status updates
  if (options.deviceStatuses) {
    watch(options.deviceStatuses, (newStatuses) => {
      Object.keys(newStatuses).forEach(deviceName => {
        const deviceIndex = devices.value.findIndex(d => d.device_name === deviceName)
        if (deviceIndex !== -1) {
          devices.value[deviceIndex].status = newStatuses[deviceName]
          devices.value[deviceIndex].last_updated = new Date().toISOString()
        }
      })
    }, { deep: true })
  }
  
  // Load devices khi composable được tạo
  loadDevices()
  
  return {
    devices: readonly(devices),
    loading: readonly(loading),
    isToggling: readonly(isToggling),
    loadDevices,
    toggleDevice,
    getDeviceStatus,
    formatLastUpdated
  }
}