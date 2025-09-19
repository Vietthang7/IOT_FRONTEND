<template>
  <div class="container mx-auto p-4">
    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex-1 min-w-48">
          <div class="flex gap-2">
            <input v-model="startDate" type="date" placeholder="Từ ngày"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span class="flex items-center text-gray-500">-</span>
            <input v-model="endDate" type="date" placeholder="Đến ngày"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
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
      <!-- Table Header -->
      <div class="bg-gray-100 border-b border-gray-200">
        <div class="grid grid-cols-5 gap-4 p-4 py-4">
          <div class="text-left text-base font-semibold text-primary tracking-wider">STT</div>
          <div class="text-left text-base font-semibold text-primary tracking-wider">Nhiệt độ</div>
          <div class="text-left text-base font-semibold text-primary tracking-wider">Độ ẩm</div>
          <div class="text-left text-base font-semibold text-primary tracking-wider">Ánh sáng</div>
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

      <!-- Table Body -->
      <div v-else>
        <div v-for="(record, index) in sensorData" :key="record.id"
          class="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <!-- ID Column -->
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-900">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </span>
          </div>

          <!-- Temperature Column -->
          <div class="flex items-center">
            <div class="flex items-center gap-2">
              <IconTemperature class="w-4 h-4 text-red-500" />
              <span class="text-sm font-medium" :class="getTempClass(record.temp)">
                {{ record.temp }}°C
              </span>
            </div>
          </div>

          <!-- Humidity Column -->
          <div class="flex items-center">
            <div class="flex items-center gap-2">
              <IconHumidity class="w-4 h-4 text-blue-500" />
              <span class="text-sm font-medium" :class="getHumidityClass(record.humidity)">
                {{ record.humidity }}%
              </span>
            </div>
          </div>

          <!-- Light Column -->
          <div class="flex items-center">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6" v-if="totalRecords > 0">
      <BasePagination
        v-model:current="currentPage"
        :pageCount="totalRecords"
        :limit="itemsPerPage"
        @pageChanged="onPageChanged"
        @update:limit="onLimitChanged"
      />
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
const selectedRange = ref('')
const startDate = ref('')
const endDate = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Methods
const fetchData = async () => {
  try {
    loading.value = true
    
    // Tạo params cho API call
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
    }

    if (selectedSensorType.value) {
      params.sensor_type = selectedSensorType.value
    }
    
    if (selectedRange.value) {
      params.range = selectedRange.value
    }
    
    if (startDate.value) {
      params.start_time = startDate.value
    }
    
    if (endDate.value) {
      params.end_time = endDate.value
    }
    params.sort = "true"    
    const response = await restAPI.stores.getDataSensor({
      params
    })
    
    if (response && response.data) {
      sensorData.value = response.data.value.data.data || []
      totalRecords.value = response.data.value.data.pagination?.total || 0
    } else {
      sensorData.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    sensorData.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchData()
}

const resetFilters = () => {
  selectedSensorType.value = ''
  selectedRange.value = ''
  startDate.value = ''
  endDate.value = ''
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
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' - ' + new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
// Lifecycle
onMounted(() => {
  fetchData()
})
</script>