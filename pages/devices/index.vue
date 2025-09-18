<template>
  <div class="container mx-auto p-4">

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex-1 min-w-48">
          <select v-model="selectedDeviceType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả thiết bị</option>
            <option value="den">Đèn</option>
            <option value="quat">Quạt</option>
            <option value="dieuhoa">Điều hòa</option>
          </select>
        </div>
        <div class="flex-1 min-w-48">
          <select v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="ON">Bật</option>
            <option value="OFF">Tắt</option>
          </select>
        </div>
        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
          <input v-model="selectedDate" type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex items-end">
          <button @click="resetFilters"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            Đặt lại
          </button>
        </div>
      </div>
    </div>
    <!-- Pagination -->
    <BasePagination
      v-if="filteredDevices.length > 0"
      v-model:current="currentPage"
      :pageCount="filteredDevices.length"
      :limit="pageSize"
      @pageChanged="onPageChange"
      @update:limit="onPageSizeChange"
      class="mt-6"
    />
  </div>
</template>

<script setup>
// Composables
const { restAPI } = useAPI()

// Reactive data
const devices = ref([])
const isLoading = ref(true)
const isControlling = ref(false)

// Filters
const selectedDeviceType = ref('')
const selectedStatus = ref('')
const selectedDate = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(12)

// Computed
const filteredDevices = computed(() => {
  let filtered = devices.value

  if (selectedDeviceType.value) {
    filtered = filtered.filter(device => device.device_name === selectedDeviceType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(device => device.action === selectedStatus.value)
  }

  if (selectedDate.value) {
    filtered = filtered.filter(device => {
      const deviceDate = new Date(device.time).toISOString().split('T')[0]
      return deviceDate === selectedDate.value
    })
  }

  return filtered
})

const paginatedDevices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredDevices.value.slice(start, end)
})

// Methods
const fetchDevices = async () => {
  try {
    isLoading.value = true
    const response = await restAPI.get('/device_history')
    
    if (response.success) {
      devices.value = response.data || []
    } else {
      console.error('Failed to fetch devices:', response.message)
      devices.value = []
    }
  } catch (error) {
    console.error('Error fetching devices:', error)
    devices.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleDevice = async (device) => {
  try {
    isControlling.value = true
    const newAction = device.action === 'ON' ? 'OFF' : 'ON'
    
    const response = await restAPI.post('/control_device', {
      device: device.device_name,
      action: newAction
    })

    if (response.success) {
      // Update local state
      const index = devices.value.findIndex(d => d.id === device.id)
      if (index !== -1) {
        devices.value[index] = {
          ...devices.value[index],
          action: newAction,
          time: new Date().toISOString()
        }
      }
      
      // Refresh data từ server
      await fetchDevices()
    } else {
      console.error('Failed to control device:', response.message)
    }
  } catch (error) {
    console.error('Error controlling device:', error)
  } finally {
    isControlling.value = false
  }
}

const resetFilters = () => {
  selectedDeviceType.value = ''
  selectedStatus.value = ''
  selectedDate.value = ''
  currentPage.value = 1
}

const onPageChange = (page) => {
  currentPage.value = page
}

const onPageSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const getDeviceName = (deviceName) => {
  const names = {
    'den': 'Đèn LED',
    'quat': 'Quạt điện',
    'dieuhoa': 'Điều hòa'
  }
  return names[deviceName] || deviceName
}

const getDeviceIconBg = (deviceName) => {
  const colors = {
    'den': 'bg-yellow-500',
    'quat': 'bg-blue-500', 
    'dieuhoa': 'bg-green-500'
  }
  return colors[deviceName] || 'bg-gray-500'
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  
  const date = new Date(dateTime)
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watchers
watch([selectedDeviceType, selectedStatus, selectedDate], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  fetchDevices()
})
</script>