<!-- filepath: c:\IOT\Frontend\pages\devices\components\DeviceHistoryFilter.vue -->
<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 lg:py-3 py-1 lg:mb-4 mb-2">
    <div class="flex items-center gap-4 flex-wrap">
      <!-- Device Type Select -->
      <div class="flex-1 min-w-48">
        <select 
          :value="selectedDeviceType"
          @change="$emit('update:selectedDeviceType', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả thiết bị</option>
          <option value="den">Đèn</option>
          <option value="quat">Quạt</option>
          <option value="dieuhoa">Điều hòa</option>
          <option value="chuong">Chuông</option>
          <option value="cua">Cửa</option>
        </select>
      </div>

      <!-- Status Select -->
      <div class="flex-1 min-w-48">
        <select 
          :value="selectedStatus"
          @change="$emit('update:selectedStatus', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ON">Bật</option>
          <option value="OFF">Tắt</option>
        </select>
      </div>

      <!-- Search Input -->
      <div class="flex-1 min-w-48 relative">
        <input 
          :value="searchDateTime" 
          @input="$emit('update:searchDateTime', $event.target.value)"
          type="text" 
          placeholder="Nhập thời gian để tìm kiếm..."
          class="w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        >
      </div>

      <!-- Action Buttons -->
      <div class="flex items-end">
        <button 
          @click="$emit('apply-filters')"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Tìm kiếm
        </button>
      </div>
      <div class="flex items-end">
        <button 
          @click="$emit('reset-filters')"
          class="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors"
        >
          Bỏ lọc
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedDeviceType: {
    type: String,
    required: true
  },
  selectedStatus: {
    type: String,
    required: true
  },
  searchDateTime: {
    type: String,
    required: true
  }
})

defineEmits([
  'update:selectedDeviceType',
  'update:selectedStatus', 
  'update:searchDateTime',
  'apply-filters',
  'reset-filters'
])
</script>