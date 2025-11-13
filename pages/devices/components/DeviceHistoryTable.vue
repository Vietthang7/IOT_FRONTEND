<!-- filepath: c:\IOT\Frontend\pages\devices\components\DeviceHistoryTable.vue -->
<template>
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

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-8 text-center">
      <div class="inline-flex items-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
        <span class="text-gray-600">Đang tải dữ liệu...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="devices.length === 0" class="px-6 py-8 text-center">
      <IconDevice class="w-12 h-12 text-gray-300 mx-auto mb-2" />
      <p class="text-gray-500">Không có dữ liệu thiết bị</p>
    </div>

    <!-- Table Body -->
    <div v-else>
      <div 
        v-for="(device, index) in devices" 
        :key="device.id"
        class="grid grid-cols-4 gap-4 py-1.5 px-6 lg:py-2.1 border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <!-- STT Column -->
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
          <span 
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="device.action === 'ON' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ device.action }}
          </span>
        </div>

        <!-- Time Column -->
        <div class="flex items-center">
          <span class="text-sm text-gray-600">{{ formatDateTime(device.time) }}</span>
          <button 
            @click="$emit('copy-to-clipboard', formatDateTime(device.time), device.id)" 
            :class="[
              'ml-2 p-1 rounded hover:bg-gray-100 transition-colors',
              copiedId === device.id ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
            ]" 
            :title="copiedId === device.id ? 'Đã copy!' : 'Copy thời gian'"
          >
            <IconCheck v-if="copiedId === device.id" class="w-4 h-4" />
            <IconCopy v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconDevice from '~/components/global/IconDevice.vue'
import IconCheck from '~/components/global/IconCheck.vue'
import IconCopy from '~/components/global/IconCopy.vue'

defineProps({
  devices: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  copiedId: {
    type: [String, Number, null],
    default: null
  },
  getDeviceName: {
    type: Function,
    required: true
  },
  formatDateTime: {
    type: Function,
    required: true
  }
})

defineEmits(['copy-to-clipboard'])
</script>