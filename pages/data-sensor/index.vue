<template>
  <div class="container mx-auto p-0">
    <!-- Filter Section - Giữ nguyên -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 lg:py-3 py-1 lg:mb-4 mb-2">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex-1 lg:max-w-90">
          <select v-model="selectedSensorType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tất cả</option>
            <option value="temp">Nhiệt độ</option>
            <option value="humidity">Độ ẩm</option>
            <option value="lux">Ánh sáng</option>
            <option value="time">Thời gian</option>
          </select>
        </div>
        <div class="flex-1 lg:min-w-48 relative">
          <input v-model="searchDateTime" type="text" placeholder="Nhập để tìm kiếm..."
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
      <!-- Table Header - FIXED 5 COLUMNS -->
      <div class="bg-gray-100 border-b border-gray-200">
        <div class="grid grid-cols-5 gap-4 p-1 lg:p-2">
          <div class="text-left text-base font-semibold text-primary tracking-wider">STT</div>
          <div class="text-left text-base font-semibold text-primary tracking-wider">
            <button @click="handleSort('temp')" class="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <span>Nhiệt độ</span>
              <div class="w-4 h-4">
                <IconArrowUp v-if="sortType === 'temp' && sortOrder === 'asc'" class="w-4 h-4 text-blue-600" />
                <IconArrowDown v-else-if="sortType === 'temp' && sortOrder === 'desc'" class="w-4 h-4 text-blue-600" />
                <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </button>
          </div>

          <!-- Humidity - Sortable -->
          <div class="text-left text-base font-semibold text-primary tracking-wider">
            <button @click="handleSort('humidity')"
              class="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <span>Độ ẩm</span>
              <div class="w-4 h-4">
                <IconArrowUp v-if="sortType === 'humidity' && sortOrder === 'asc'" class="w-4 h-4 text-blue-600" />
                <IconArrowDown v-else-if="sortType === 'humidity' && sortOrder === 'desc'"
                  class="w-4 h-4 text-blue-600" />
                <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </button>
          </div>

          <!-- Light - Sortable -->
          <div class="text-left text-base font-semibold text-primary tracking-wider">
            <button @click="handleSort('lux')" class="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <span>Ánh sáng</span>
              <div class="w-4 h-4">
                <IconArrowUp v-if="sortType === 'lux' && sortOrder === 'asc'" class="w-4 h-4 text-blue-600" />
                <IconArrowDown v-else-if="sortType === 'lux' && sortOrder === 'desc'" class="w-4 h-4 text-blue-600" />
                <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </button>
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

      <!-- Table Body - FIXED 5 COLUMNS -->
      <div v-else>
        <div v-for="(record, index) in sensorData" :key="record.id"
          class="grid grid-cols-5 gap-4 px-6 py-1.5 lg:py-2.1 border-b border-gray-100 hover:bg-gray-50 transition-colors">

          <!-- STT Column -->
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
    <div class="mt-6 pb-0" v-if="totalRecords > 0">
      <BasePagination v-model:current="currentPage" :pageCount="totalRecords" :limit="itemsPerPage"
        @pageChanged="onPageChanged" @update:limit="onLimitChanged" />
    </div>
  </div>
</template>

<script setup>
const { restAPI } = useAPI()
import IconArrowUp from '~/components/global/IconArrowUp.vue'
import IconArrowDown from '~/components/global/IconArrowDown.vue'

// Reactive state
const sensorData = ref([])
const loading = ref(false)
const totalRecords = ref(0)

// Filter state
const selectedSensorType = ref('all')
const searchDateTime = ref('')
const searchData = ref('')

const sortType = ref('')  // 'temp', 'humidity', 'lux'
const sortOrder = ref('desc')  // Mặc định là 'desc' như logic ban đầu

// Copy state
const copiedId = ref(null)
const copyTimeout = ref(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// ✅ SORT METHODS
const handleSort = (field) => {
  if (sortType.value === field) {
    // Toggle order nếu cùng field
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Field mới, bắt đầu với desc (logic hiện tại)
    sortType.value = field
    sortOrder.value = 'desc'
  }

  currentPage.value = 1
  fetchData()
}

// Methods
const fetchData = async () => {
  try {
    loading.value = true

    const params = {
      page: currentPage.value,
      length: itemsPerPage.value,
    }

    if (selectedSensorType.value) {
      params.sensor_type = selectedSensorType.value
    }

    if (searchData.value) {
      params.search_data = searchData.value
    }

    // THÊM SORT PARAMS
    if (sortType.value && sortOrder.value) {
      params.sort_type = sortType.value
      params.sort_order = sortOrder.value
    } else {
      params.sort = "true"
    }

    const response = await restAPI.stores.getDataSensorv1({
      params
    })
    if (response && response.data.data) {
      sensorData.value = response.data.data || []
      totalRecords.value = response.data.pagination?.total || 0
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
  searchData.value = searchDateTime.value.trim()
  currentPage.value = 1
  fetchData()
}

const resetFilters = () => {
  selectedSensorType.value = 'all'
  searchDateTime.value = ''
  searchData.value = ''

  // RESET SORT về mặc định
  sortType.value = ''
  sortOrder.value = 'desc'

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

// Lifecycle
onMounted(() => {
  fetchData()
})
await fetchData()

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (copyTimeout.value) {
    clearTimeout(copyTimeout.value)
  }
})
definePageMeta({
  middleware: 'auth'
})
</script>