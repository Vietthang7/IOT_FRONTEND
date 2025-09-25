<template>
  <div class="container mx-auto p-4">
    <!-- Filter Section - Giữ nguyên -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-8 mb-6">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex-1 min-w-48">
          <select v-model="selectedSensorType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả</option>
            <option value="temp">Nhiệt độ</option>
            <option value="humidity">Độ ẩm</option>
            <option value="lux">Ánh sáng</option>
          </select>
        </div>
        <div class="flex-1 min-w-48 relative">
          <input v-model="searchDateTime" type="text" placeholder="Nhập thời gian để tìm kiếm..."
            class="w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300">
        </div>
        <div class="flex items-end">
          <button @click="applyFilters"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Tìm kiếm
          </button>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters"
            class="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors">
            Bỏ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Table Header - DYNAMIC COLUMNS -->
      <div class="bg-gray-100 border-b border-gray-200">
        <div class="grid gap-4 p-4 py-4" :style="{ gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)` }">
          <div class="text-left text-base font-semibold text-primary tracking-wider">STT</div>

          <!-- Hiện cột Nhiệt độ nếu type_sensor = '' hoặc 'temp' -->
          <div v-if="showTempColumn" class="text-left text-base font-semibold text-primary tracking-wider">
            Nhiệt độ
          </div>

          <!-- Hiện cột Độ ẩm nếu type_sensor = '' hoặc 'humidity' -->
          <div v-if="showHumidityColumn" class="text-left text-base font-semibold text-primary tracking-wider">
            Độ ẩm
          </div>

          <!-- Hiện cột Ánh sáng nếu type_sensor = '' hoặc 'lux' -->
          <div v-if="showLuxColumn" class="text-left text-base font-semibold text-primary tracking-wider">
            Ánh sáng
          </div>

          <div class="text-left text-base font-semibold text-primary tracking-wider">Thời gian</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="px-6 py-8 text-center">
        <div class="inline-flex items-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
          <span class="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="sensorData.length === 0" class="px-6 py-8 text-center">
        <IconTemperature class="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p class="text-gray-500">Không có dữ liệu cảm biến</p>
      </div>

      <!-- Table Body - DYNAMIC COLUMNS -->
      <div v-else>
        <div v-for="(record, index) in sensorData" :key="record.id"
          class="grid gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          :style="{ gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)` }">

          <!-- STT Column -->
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-900">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </span>
          </div>

          <!-- Temperature Column - CONDITIONAL -->
          <div v-if="showTempColumn" class="flex items-center">
            <div class="flex items-center gap-2">
              <IconTemperature class="w-4 h-4 text-red-500" />
              <span class="text-sm font-medium" :class="getTempClass(record.temp)">
                {{ record.temp }}°C
              </span>
            </div>
          </div>

          <!-- Humidity Column - CONDITIONAL -->
          <div v-if="showHumidityColumn" class="flex items-center">
            <div class="flex items-center gap-2">
              <IconHumidity class="w-4 h-4 text-blue-500" />
              <span class="text-sm font-medium" :class="getHumidityClass(record.humidity)">
                {{ record.humidity }}%
              </span>
            </div>
          </div>

          <!-- Light Column - CONDITIONAL -->
          <div v-if="showLuxColumn" class="flex items-center">
            <div class="flex items-center gap-2">
              <IconLight class="w-4 h-4 text-yellow-500" />
              <span class="text-sm font-medium" :class="getLightClass(record.lux)">
                {{ record.lux }} LUX
              </span>
            </div>
          </div>

          <!-- Time Column -->
          <div class="flex items-center">
            <span class="text-sm text-gray-600">{{ formatDateTime(record.time) }}</span>
            <button @click="copyToClipboard(formatDateTime(record.time), record.id)" :class="[
              'ml-2 p-1 rounded hover:bg-gray-100 transition-colors',
              copiedId === record.id ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
            ]" :title="copiedId === record.id ? 'Đã copy!' : 'Copy thời gian'">
              <IconCheck v-if="copiedId === record.id" class="w-4 h-4" />
              <IconCopy v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6" v-if="totalRecords > 0">
      <BasePagination v-model:current="currentPage" :pageCount="totalRecords" :limit="itemsPerPage"
        @pageChanged="onPageChanged" @update:limit="onLimitChanged" />
    </div>
  </div>
</template>

<script setup>

const { restAPI } = useAPI()

// Reactive state
const sensorData = ref([])
const loading = ref(false)
const totalRecords = ref(0)
// Filter state
const selectedSensorType = ref('')
const searchDateTime = ref('')
const parsedDateTime = ref('')
const type_sensor = ref('')
// Copy state
const copiedId = ref(null)
const copyTimeout = ref(null)
// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// COMPUTED PROPERTIES - Xác định hiển thị cột nào
const showTempColumn = computed(() => {
  return type_sensor.value === '' || type_sensor.value === 'temp'
})

const showHumidityColumn = computed(() => {
  return type_sensor.value === '' || type_sensor.value === 'humidity'
})

const showLuxColumn = computed(() => {
  return type_sensor.value === '' || type_sensor.value === 'lux'
})

const getColumnCount = () => {
  let columnCount = 2 // STT + Thời gian luôn có

  if (showTempColumn.value) columnCount++
  if (showHumidityColumn.value) columnCount++
  if (showLuxColumn.value) columnCount++

  return columnCount
}
// Methods
const fetchData = async () => {
  try {
    loading.value = true

    // Tạo params cho API call
    const params = {
      page: currentPage.value,
      length: itemsPerPage.value,
    }

    if (selectedSensorType.value) {
      params.sensor_type = selectedSensorType.value
    }

    if (parsedDateTime.value) {
      params.search_time = parsedDateTime.value
    }
    params.sort = "true"
    const response = await restAPI.stores.getDataSensor({
      params
    })

    if (response && response.data) {
      sensorData.value = response.data.value.data.data || []
      totalRecords.value = response.data.value.data.pagination?.total || 0
      type_sensor.value = response.data.value.data.sensor_type
    } else {
      sensorData.value = []
      totalRecords.value = 0
      type_sensor.value = ''
    }
  } catch (error) {
    sensorData.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  parsedDateTime.value = searchDateTime.value.trim()
  currentPage.value = 1
  fetchData()
}


const resetFilters = () => {
  selectedSensorType.value = ''
  searchDateTime.value = ''
  parsedDateTime.value = ''
  currentPage.value = 1
  fetchData()
}

const onPageChanged = (page) => {
  currentPage.value = page
  fetchData()
}

const onLimitChanged = (newLimit) => {
  itemsPerPage.value = newLimit
  currentPage.value = 1
  fetchData()
}

// Utility functions for styling sensor values
const getTempClass = (temp) => {
  if (temp < 20) return 'text-blue-600'
  if (temp > 35) return 'text-red-600'
  return 'text-green-600'
}

const getHumidityClass = (humidity) => {
  if (humidity < 30) return 'text-red-600'
  if (humidity > 80) return 'text-blue-600'
  return 'text-green-600'
}

const getLightClass = (lux) => {
  if (lux < 200) return 'text-gray-600'
  if (lux > 1000) return 'text-yellow-600'
  return 'text-green-600'
}

const formatDateTime = (timestamp) => {
  if (!timestamp) return ''

  return new Date(timestamp).toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', '')
}
// Lifecycle
onMounted(() => {
  fetchData()
})

const copyToClipboard = async (text, recordId) => {
  try {
    await navigator.clipboard.writeText(text)

    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value)
    }

    copiedId.value = recordId

    // Reset after 2 seconds
    copyTimeout.value = setTimeout(() => {
      copiedId.value = null
    }, 2000)

    console.log('✅ Copied to clipboard:', text)
  } catch (error) {
    console.error('❌ Failed to copy:', error)

    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      copiedId.value = recordId
      copyTimeout.value = setTimeout(() => {
        copiedId.value = null
      }, 2000)

      console.log('✅ Copied using fallback method:', text)
    } catch (fallbackError) {
      console.error('❌ Fallback copy also failed:', fallbackError)
    }
  }
}

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (copyTimeout.value) {
    clearTimeout(copyTimeout.value)
  }
})
</script>