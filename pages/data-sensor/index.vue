<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Data Sensor</h1>

    <BaseTable :data="sensorData" :columns="sensorColumns" frame-label="Tên thiết bị" frame-id="1000015789"
      :show-frame-dropdown="true" :frame-options="sensorOptions" :selected-frame="selectedDevice"
      :filters="sensorFilters" :selected-date="selectedDate" :current-page="currentPage" :items-per-page="itemsPerPage"
      :total-items="totalSensorItems" @frame-change="handleDeviceChange" @filter-change="handleFilterChange"
      @date-range-change="handleDateRangeChange" @refresh="refreshSensorData" @export="exportSensorData"
      @page-changed="handlePageChange" @limit-changed="handleLimitChange" />
  </div>
</template>

<script setup>
// Data
const sensorData = ref([
  {
    id: "e45d313d-8a69-498f-ab05-99a43e72bff5",
    created_at: "2025-09-08T22:54:04.935+07:00",
    temp: 32.7,
    humidity: 67,
    lux: 816,
    time: "2025-09-08T22:54:04.935+07:00"
  },
  {
    id: "647a6045-19fd-4c6f-a494-c3c164e56253",
    created_at: "2025-09-08T22:53:54.935+07:00",
    temp: 32.7,
    humidity: 67,
    lux: 699,
    time: "2025-09-08T22:53:54.935+07:00"
  },
  {
    id: "29315646-be99-48fc-891e-2b925a653c77",
    created_at: "2025-09-08T22:53:44.936+07:00",
    temp: 32.7,
    humidity: 67,
    lux: 1001,
    time: "2025-09-08T22:53:44.935+07:00"
  },
  {
    id: "6176e821-b1a6-4c2d-96c5-78f391aa8e98",
    created_at: "2025-09-08T22:53:34.935+07:00",
    temp: 32.7,
    humidity: 67,
    lux: 3611,
    time: "2025-09-08T22:53:34.934+07:00"
  },
  {
    id: "646201fd-3d37-4ce1-a947-8e976db77603",
    created_at: "2025-09-08T22:53:24.935+07:00",
    temp: 32.7,
    humidity: 67,
    lux: 1329,
    time: "2025-09-08T22:53:24.935+07:00"
  },
  {
    id: "2c428425-a04d-4793-aec7-9bbc8faeb3c4",
    created_at: "2025-09-08T22:53:14.934+07:00",
    temp: 32.7,
    humidity: 67,
    lux: 386,
    time: "2025-09-08T22:53:14.933+07:00"
  },
  {
    id: "270ffc75-a49b-49b1-af62-6fea3e4c7ce0",
    created_at: "2025-09-08T22:53:04.936+07:00",
    temp: 32.7,
    humidity: 66,
    lux: 643,
    time: "2025-09-08T22:53:04.936+07:00"
  },
])


const sensorColumns = ref([
  { key: 'id', label: 'STT', type: 'center' },
  { key: 'temp', label: 'Nhiệt độ' },
  { key: 'humidity', label: 'Độ ẩm' },
  { key: 'lux', label: 'Ánh sáng', },
  { key: 'time', label: 'Thời gian', type: 'datetime' }
])

const sensorOptions = ref([
  { value: 'desc', label: 'Giảm dần' },
  { value: 'asc', label: 'Tăng dần' },
])

const sensorFilters = ref([
  {
    key: 'action',
    value: 'OFF',
    options: [
      { value: 'ALL', label: 'Tất cả' },
      { value: 'ON', label: 'ON' },
      { value: 'OFF', label: 'OFF' }
    ]
  }
])

// State
const selectedDevice = ref('den')
const dateRange = ref({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  endDate: new Date().toISOString().split('T')[0] // today
})
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalSensorItems = ref(50)

// Event handlers
const handleDeviceChange = (device) => {
  selectedDevice.value = device
  console.log('Device changed:', device)
}

const handleFilterChange = (key, value) => {
  const filter = sensorFilters.value.find(f => f.key === key)
  if (filter) {
    filter.value = value
  }
}

const handleDateChange = (date) => {
  selectedDate.value = date
  console.log('Date changed:', date)
}

const refreshSensorData = () => {
  console.log('Refreshing sensor data...')
  // API call to refresh data
}

const exportSensorData = () => {
  console.log('Exporting sensor data...')
  // Export functionality
}

const handlePageChange = (page) => {
  currentPage.value = page
  console.log('Page changed:', page)
}

const handleLimitChange = (limit) => {
  itemsPerPage.value = limit
  currentPage.value = 1 // Reset to first page when limit changes
  console.log('Limit changed:', limit)
}
const handleDateRangeChange = (newDateRange) => {
  dateRange.value = newDateRange
  console.log('Sensor date range changed:', newDateRange)
  currentPage.value = 1
}
</script>