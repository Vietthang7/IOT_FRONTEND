<template>
  <div class="container mx-auto p-4">
    <!-- Filter Section -->
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
        <div class="grid grid-cols-4 gap-4 p-4 py-4">
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
          class="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
// Composables
const { restAPI } = useAPI()

// Reactive state
const devices = ref([])
const loading = ref(false)
const totalRecords = ref(0)

// Filter state
const selectedDeviceType = ref('')
const selectedStatus = ref('')
const startDate = ref('')
const endDate = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Methods
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

    if (startDate.value) {
      params.start_time = startDate.value
    }

    if (endDate.value) {
      params.end_time = endDate.value
    }

    const response = await restAPI.stores.getDeviceHistory({
      params
    })
    // Sửa logic xử lý response data
    if (response && response.data) {
      devices.value = response.data.value.data.data || []
      totalRecords.value = response.data.value.data.pagination?.total || 0
      console.log('Devices loaded:', devices.value.length)
      console.log('Total records:', totalRecords.value)
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
  currentPage.value = 1
  fetchData()
}

const resetFilters = () => {
  selectedDeviceType.value = ''
  selectedStatus.value = ''
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

const getDeviceName = (deviceType) => {
  const names = {
    'dieuhoa': 'Điều hòa',
    'quat': 'Quạt',
    'den': 'Đèn'
  }
  return names[deviceType] || deviceType
}

const formatDateTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' - ' + new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'  
  })
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>