<!-- filepath: c:\IOT\Frontend\pages\devices\index.vue -->
<template>
  <div class="container mx-auto p-0">
    <!-- Tabs -->
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

    <!-- ============ TAB 1: LỊCH SỬ THIẾT BỊ ============ -->
    <div v-show="activeTab === 'history'">
      <!-- Filter Section -->
      <DeviceHistoryFilter v-model:selected-device-type="selectedDeviceType" v-model:selected-status="selectedStatus"
        v-model:search-date-time="searchDateTime" @apply-filters="applyFilters" @reset-filters="resetFilters" />

      <!-- Data Table -->
      <DeviceHistoryTable :devices="devices" :loading="loading" :current-page="currentPage"
        :items-per-page="itemsPerPage" :copied-id="copiedId" :get-device-name="getDeviceName"
        :format-date-time="formatDateTime" @copy-to-clipboard="copyToClipboard" />

      <!-- Pagination -->
      <div class="mt-6" v-if="totalRecords > 0">
        <BasePagination v-model:current="currentPage" :pageCount="totalRecords" :limit="itemsPerPage"
          @pageChanged="onPageChanged" @update:limit="onLimitChanged" />
      </div>
    </div>

    <!-- ============ TAB 2: THỐNG KÊ THEO NGÀY ============ -->
    <div v-show="activeTab === 'statistics'">
      <!-- Filter Section -->
      <DeviceStatsFilter v-model:search-date="searchDate" @search-stats="searchStatsByDate"
        @reset-search="resetStatsSearch" />

      <!-- Stats Cards -->
      <DeviceStatsCards :stats-data="statsData" :stats-loading="statsLoading" :get-device-name="getDeviceName"
        :format-date="formatDate" />
    </div>
  </div>
</template>

<script setup>
import { useDeviceHistory } from './composables/useDeviceHistory'
import { useDeviceStats } from './composables/useDeviceStats'
import DeviceHistoryFilter from './components/DeviceHistoryFilter.vue'
import DeviceHistoryTable from './components/DeviceHistoryTable.vue'
import DeviceStatsFilter from './components/DeviceStatsFilter.vue'
import DeviceStatsCards from './components/DeviceStatsCards.vue'

// ===== TAB STATE =====
const activeTab = ref('history')

// ===== USE COMPOSABLES =====
const {
  // History State
  devices,
  loading,
  totalRecords,
  selectedDeviceType,
  searchDateTime,
  selectedStatus,
  currentPage,
  itemsPerPage,
  copiedId,

  // History Methods
  fetchData,
  applyFilters,
  resetFilters,
  onPageChanged,
  onLimitChanged,
  copyToClipboard,
  getDeviceName,
  formatDateTime,
  cleanup: cleanupHistory
} = useDeviceHistory()

const {
  // Stats State
  searchDate,
  statsData,
  statsLoading,

  // Stats Methods
  searchStatsByDate,
  resetStatsSearch,
  getDeviceName: getStatsDeviceName,
  formatDate,
  initializeStats
} = useDeviceStats()

// ===== LIFECYCLE =====
onMounted(async () => {
  await fetchData()
  initializeStats()
})

onBeforeUnmount(() => {
  cleanupHistory()
})

definePageMeta({
  middleware: 'auth'
})
</script>