<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Devices</h1>

    <BaseTable :data="deviceData" :columns="deviceColumns" frame-label="Loại thiết bị" frame-id="1000015789"
      :show-frame-dropdown="true" :frame-options="deviceTypeOptions" :selected-frame="selectedDeviceType"
      :filters="deviceFilters" :date-range="dateRange" :current-page="currentPage" :items-per-page="itemsPerPage"
      :total-items="totalDeviceItems" @frame-change="handleDeviceTypeChange" @filter-change="handleFilterChange"
      @date-range-change="handleDateRangeChange" @refresh="refreshDeviceData" @export="exportDeviceData"
      @page-changed="handlePageChange" @limit-changed="handleLimitChange" />
  </div>
</template>

<script setup>
// Data - giữ nguyên
const deviceData = ref([
  {
    id: "faff2de0-d417-432a-92e2-698cf215921a",
    device_name: "den",
    action: "ON",
    time: "2025-09-08T22:33:40.842+07:00"
  },
])

// Column definitions - giữ nguyên
const deviceColumns = ref([
  { key: 'id', label: 'STT', type: 'center' },
  { key: 'device_name', label: 'Thiết bị' },
  { key: 'action', label: 'Hành động', type: 'status' },
  { key: 'time', label: 'Thời gian', type: 'text' }
])

// Filter options - giữ nguyên
const deviceTypeOptions = ref([
  { value: 'dieuhoa', label: 'Điều hòa' },
  { value: 'quat', label: 'Quạt' },
  { value: 'den', label: 'Đèn' }
])

const deviceFilters = ref([
  {
    key: 'status',
    value: 'OFF',
    options: [
      { value: 'ALL', label: 'Tất cả' },
      { value: 'ON', label: 'ON' },
      { value: 'OFF', label: 'OFF' }
    ]
  }
])

// State - cập nhật date range
const selectedDeviceType = ref('dieuhoa')
const dateRange = ref({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
  endDate: new Date().toISOString().split('T')[0] // today
})
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalDeviceItems = ref(50)

// Event handlers
const handleDeviceTypeChange = (deviceType) => {
  selectedDeviceType.value = deviceType
  console.log('Device type changed:', deviceType)
}

const handleFilterChange = (key, value) => {
  const filter = deviceFilters.value.find(f => f.key === key)
  if (filter) {
    filter.value = value
  }
  console.log('Filter changed:', key, value)
}

const handleDateRangeChange = (newDateRange) => {
  dateRange.value = newDateRange
  console.log('Date range changed:', newDateRange)
  // Reset to first page when date range changes
  currentPage.value = 1
}

const refreshDeviceData = () => {
  console.log('Refreshing device data with date range:', dateRange.value)
  // API call với date range
}

const exportDeviceData = () => {
  console.log('Exporting device data for date range:', dateRange.value)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleLimitChange = (limit) => {
  itemsPerPage.value = limit
  currentPage.value = 1
}
</script>