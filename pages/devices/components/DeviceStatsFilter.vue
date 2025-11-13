<!-- filepath: c:\IOT\Frontend\pages\devices\components\DeviceStatsFilter.vue -->
<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 lg:py-3 py-1 lg:mb-4 mb-2">
    <div class="flex items-center gap-4 flex-wrap">
      <!-- Date Input -->
      <div class="flex-1 min-w-60">
        <input 
          :value="searchDate"
          @input="$emit('update:searchDate', $event.target.value)"
          type="text" 
          placeholder="VD: 25/12/2023 hoặc 2023-12-25"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Action Buttons -->
      <div class="flex items-end gap-2">
        <button 
          @click="$emit('search-stats')"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Tìm kiếm
        </button>
        <button 
          @click="$emit('reset-search')"
          class="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors"
        >
          Hôm nay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchDate: {
    type: String,
    required: true
  }
})

defineEmits([
  'update:searchDate',
  'search-stats',
  'reset-search'
])
</script>