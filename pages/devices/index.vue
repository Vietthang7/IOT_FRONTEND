<template>
  <div class="container mx-auto p-0">
    <!-- THÊM: Tabs để chuyển giữa 2 view -->
    <div class="mb-4 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button @click="activeTab = 'history'" :class="[
          'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          activeTab === 'history'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]">
          Lịch sử thiết bị
        </button>
        <button @click="activeTab = 'statistics'" :class="[
          'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          activeTab === 'statistics'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]">
          Thống kê theo ngày
        </button>
      </nav>
    </div>

    <!-- ============ TAB 1: LỊCH SỬ THIẾT BỊ (Code cũ) ============ -->
    <div v-show="activeTab === 'history'">
      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 lg:py-3 py-1 lg:mb-4 mb-2">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex-1 min-w-48">
            <select v-model="selectedDeviceType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả thiết bị</option>
              <option value="den">Đèn</option>
              <option value="quat">Quạt</option>
              <option value="dieuhoa">Điều hòa</option>
              <option value="chuong">Chuông</option>
              <option value="cua">Cửa</option>
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
        <!-- Table Header -->
        <div class="bg-gray-100 border-b border-gray-200">
          <div class="grid grid-cols-4 gap-4 p-1 lg:p-2">
            <div class="text-left text-base font-semibold text-primary tracking-wider">STT</div>
            <div class="text-left text-base font-semibold text-primary tracking-wider">Thiết bị</div>
            <div class="text-left text-base font-semibold text-primary tracking-wider">Hành động</div>
            <div class="text-left text-base font-semibold text-primary tracking-wider">Thời gian</div>
          </div>
        </div>

        <div v-if="loading" class="px-6 py-8 text-center">
          <div class="inline-flex items-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <span class="text-gray-600">Đang tải dữ liệu...</span>
          </div>
        </div>

        <div v-else-if="devices.length === 0" class="px-6 py-8 text-center">
          <IconDevice class="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p class="text-gray-500">Không có dữ liệu thiết bị</p>
        </div>

        <div v-else>
          <div v-for="(device, index) in devices" :key="device.id"
            class="grid grid-cols-4 gap-4 py-1.5 px-6 lg:py-2.1 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-900">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </span>
            </div>

            <!-- Device Column -->
            <div class="flex items-center">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-900">
                  {{ getDeviceName(device.device_name) }}
                </span>
              </div>
            </div>

            <!-- Action Column -->
            <div class="flex items-center">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="device.action === 'ON' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ device.action }}
              </span>
            </div>

            <!-- Time Column -->
            <div class="flex items-center">
              <span class="text-sm text-gray-600">{{ formatDateTime(device.time) }}</span>
              <button @click="copyToClipboard(formatDateTime(device.time), device.id)" :class="[
                'ml-2 p-1 rounded hover:bg-gray-100 transition-colors',
                copiedId === device.id ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
              ]" :title="copiedId === device.id ? 'Đã copy!' : 'Copy thời gian'">
                <IconCheck v-if="copiedId === device.id" class="w-4 h-4" />
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

    <!-- ============ TAB 2: THỐNG KÊ THEO NGÀY (Mới) ============ -->
    <div v-show="activeTab === 'statistics'">
      <!-- Search by Date -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 lg:py-3 py-1 lg:mb-4 mb-2">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex-1 min-w-60">
            <label class="block text-sm font-medium text-gray-700 mb-1">
            </label>
            <input 
              v-model="searchDate" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="flex items-end gap-2">
            <button @click="searchStatsByDate"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Tìm kiếm
            </button>
            <button @click="resetStatsSearch"
              class="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors">
              Hôm nay
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="statsLoading" class="px-6 py-8 text-center">
          <div class="inline-flex items-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <span class="text-gray-600">Đang tải thống kê...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!statsData || statsData.stats_by_date && Object.keys(statsData.stats_by_date).length === 0" 
          class="px-6 py-8 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p class="text-gray-500">Không có dữ liệu thống kê cho ngày này</p>
        </div>

        <!-- Stats Data -->
        <div v-else>
          <!-- Header with Date Info -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Thống kê ngày {{ formatDate(statsData.start_date) }}</h3>
                <p class="text-sm text-gray-600 mt-1">Tổng số thiết bị: {{ Object.keys(statsData.stats_by_date[statsData.start_date] || {}).length }} thiết bị</p>
              </div>
            </div>
          </div>

          <!-- Stats by Date -->
          <div v-for="(devices, date) in statsData.stats_by_date" :key="date" class="p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="device in devices" :key="device.device_name"
                class="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <!-- Device Header -->
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 rounded-lg" :class="{
                    'bg-orange-100': device.device_name === 'den',
                    'bg-purple-100': device.device_name === 'quat',
                    'bg-blue-100': device.device_name === 'dieuhoa',
                    'bg-yellow-100': device.device_name === 'chuong',
                    'bg-green-100': device.device_name === 'cua'
                  }">
                    <IconLed v-if="device.device_name === 'den'" class="w-5 h-5 text-orange-600" />
                    <IconFan v-else-if="device.device_name === 'quat'" class="w-5 h-5 text-purple-600" />
                    <IconAir v-else-if="device.device_name === 'dieuhoa'" class="w-5 h-5 text-blue-600" />
                    <IconBell v-else-if="device.device_name === 'chuong'" class="w-5 h-5 text-yellow-600" />
                    <IconDoor v-else-if="device.device_name === 'cua'" class="w-5 h-5 text-green-600" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-800">{{ getDeviceName(device.device_name) }}</h4>
                    <span class="text-xs text-gray-500">{{ device.total_actions }} hành động</span>
                  </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-3">
                  <!-- ON Count -->
                  <div class="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div class="text-xs text-green-700 font-medium mb-1">Bật</div>
                    <div class="text-2xl font-bold text-green-600">{{ device.on_count }}</div>
                  </div>

                  <!-- OFF Count -->
                  <div class="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div class="text-xs text-red-700 font-medium mb-1">Tắt</div>
                    <div class="text-2xl font-bold text-red-600">{{ device.off_count }}</div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mt-4">
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                      :style="{ width: `${(parseInt(device.on_count) / device.total_actions * 100)}%` }">
                    </div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{{ Math.round(parseInt(device.on_count) / device.total_actions * 100) }}% Bật</span>
                    <span>{{ Math.round(parseInt(device.off_count) / device.total_actions * 100) }}% Tắt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Composables
const { restAPI } = useAPI()

//  THÊM: Tab state
const activeTab = ref('history')

// Reactive state cho History Tab
const devices = ref([])
const loading = ref(false)
const totalRecords = ref(0)

// Filter state
const selectedDeviceType = ref('')
const searchDateTime = ref('')
const selectedStatus = ref('')
const parsedDateTime = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Copy state
const copiedId = ref(null)
const copyTimeout = ref(null)

//  THÊM: Reactive state cho Statistics Tab
const searchDate = ref('')
const statsData = ref(null)
const statsLoading = ref(false)

// ============ HISTORY TAB METHODS (Code cũ) ============
const fetchData = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      length: itemsPerPage.value,
    }

    if (selectedDeviceType.value) {
      params.device_name = selectedDeviceType.value
    }

    if (selectedStatus.value) {
      params.action = selectedStatus.value
    }
    if (parsedDateTime.value) {
      params.search_time = parsedDateTime.value
    }
    const response = await restAPI.stores.getDeviceHistory({
      params
    })
    if (response && response.data) {
      devices.value = response.data.value.data.data || []
      totalRecords.value = response.data.value.data.pagination?.total || 0
    } else {
      devices.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    console.error('Error fetching device logs:', error)
    devices.value = []
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
  selectedDeviceType.value = ''
  searchDateTime.value = ''
  parsedDateTime.value = ''
  selectedStatus.value = ''
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

// ============ STATISTICS TAB METHODS (Mới) ============
//  Hàm normalize date format (hỗ trợ cả DD/MM/YYYY và YYYY-MM-DD)
const normalizeDate = (dateString) => {
  if (!dateString) return null
  
  // Remove spaces
  dateString = dateString.trim()
  
  // Check if format is DD/MM/YYYY
  if (dateString.includes('/')) {
    const parts = dateString.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
  
  // Check if format is YYYY-MM-DD (already correct)
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString
  }
  
  return null
}

const fetchStatsByDate = async (date) => {
  try {
    statsLoading.value = true
    
    // Normalize date format
    const normalizedDate = normalizeDate(date)
    
    if (!normalizedDate) {
      console.error(' Invalid date format')
      statsData.value = null
      return
    }
    
    const response = await restAPI.stores.getDeviceStatsByDateRange({
      params: {
        date: normalizedDate
      }
    })
    
    console.log(' Stats response:', response)
    
    if (response && response.status && response.code === 200) {
      statsData.value = response.data
    } else {
      statsData.value = null
    }
  } catch (error) {
    console.error(' Error fetching stats:', error)
    statsData.value = null
  } finally {
    statsLoading.value = false
  }
}

const searchStatsByDate = () => {
  if (searchDate.value) {
    fetchStatsByDate(searchDate.value)
  }
}

const resetStatsSearch = () => {
  const today = new Date().toISOString().split('T')[0]
  searchDate.value = today
  fetchStatsByDate(today)
}

// ============ UTILITY METHODS ============
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const copyToClipboard = async (text, recordId) => {
  try {
    await navigator.clipboard.writeText(text)

    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value)
    }

    copiedId.value = recordId

    copyTimeout.value = setTimeout(() => {
      copiedId.value = null
    }, 1000)

    console.log(' Copied to clipboard:', text)
  } catch (error) {
    console.error(' Failed to copy:', error)

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

    } catch (fallbackError) {
      console.error(' Fallback copy also failed:', fallbackError)
    }
  }
}

// ============ LIFECYCLE ============
onMounted(() => {
  fetchData()
  
  // Set ngày hôm nay cho statistics tab
  const today = new Date().toISOString().split('T')[0]
  searchDate.value = today
  fetchStatsByDate(today)
})

await fetchData()

onBeforeUnmount(() => {
  if (copyTimeout.value) {
    clearTimeout(copyTimeout.value)
  }
})

definePageMeta({
  middleware: 'auth'
})
</script>