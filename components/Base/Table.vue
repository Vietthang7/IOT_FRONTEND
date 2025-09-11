<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <select v-if="showFrameDropdown" :value="selectedFrame" @change="$emit('frame-change', $event.target.value)"
              class="border border-gray-300 rounded px-2 py-1 text-sm">
              <option v-for="frame in frameOptions" :key="frame.value" :value="frame.value">
                {{ frame.label }}
              </option>
            </select>
          </div>

          <div v-if="filters.length > 0" class="flex items-center space-x-4">
            <div v-for="filter in filters" :key="filter.key" class="flex items-center space-x-2">
              <span class="text-gray-600">{{ filter.label }}</span>
              <select :value="filter.value" @change="$emit('filter-change', filter.key, $event.target.value)"
                class="border border-gray-300 rounded px-2 py-1 text-sm">
                <option v-for="option in filter.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-gray-600 text-sm">Từ ngày:</span>
            <input 
              type="date" 
              :value="dateRange.startDate" 
              @change="updateDateRange('startDate', $event.target.value)"
              class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
            <span class="text-gray-600 text-sm">đến:</span>
            <input 
              type="date" 
              :value="dateRange.endDate" 
              @change="updateDateRange('endDate', $event.target.value)"
              class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
          </div>
        </div>

        <!-- Right side: Action buttons -->
        <div class="flex items-center space-x-2">
          <button @click="$emit('refresh')"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Tìm kiếm
          </button>
          <button @click="$emit('export')"
            class="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500 transition-colors">
            Bỏ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50">
            <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap text-sm"
              :class="getCellClass(column, item[column.key])">
              <span v-if="column.type === 'status'" :class="getStatusClass(item[column.key])">
                {{ item[column.key] }}
              </span>
              <span v-else-if="column.type === 'link'" class="text-blue-600 hover:text-blue-800 cursor-pointer">
                {{ item[column.key] }}
              </span>
              <span v-else class="text-gray-900">
                {{ item[column.key] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-4 border-t border-gray-200">
      <BasePagination :current="currentPage" :page-count="totalItems" :limit="itemsPerPage"
        @page-changed="handlePageChange" @update:limit="handleLimitChange" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Data
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },

  frameLabel: {
    type: String,
    default: 'Tên thiết bị'
  },
  showFrameDropdown: {
    type: Boolean,
    default: true
  },
  frameOptions: {
    type: Array,
    default: () => []
  },
  selectedFrame: {
    type: String,
    default: ''
  },

  filters: {
    type: Array,
    default: () => []
  },

  // Date Range
  dateRange: {
    type: Object,
    default: () => ({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
      endDate: new Date().toISOString().split('T')[0] // today
    })
  },

  // Pagination
  currentPage: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  totalItems: {
    type: Number,
    required: true
  }
})

const emit = defineEmits([
  'frame-change',
  'filter-change',
  'date-range-change',
  'refresh',
  'export',
  'page-changed',
  'limit-changed'
])

// Internal event handlers
const handlePageChange = (page) => {
  emit('page-changed', page)
}

const handleLimitChange = (limit) => {
  emit('limit-changed', limit)
}

const updateDateRange = (type, value) => {
  const newDateRange = { ...props.dateRange }
  newDateRange[type] = value
  
  // Validate date range
  if (newDateRange.startDate && newDateRange.endDate) {
    if (new Date(newDateRange.startDate) > new Date(newDateRange.endDate)) {
      // Swap dates if start date is after end date
      if (type === 'startDate') {
        newDateRange.endDate = value
      } else {
        newDateRange.startDate = value
      }
    }
  }
  
  emit('date-range-change', newDateRange)
}

// Helper functions
const getCellClass = (column, value) => {
  if (column.type === 'center') {
    return 'text-center'
  }
  return ''
}

const getStatusClass = (status) => {
  const statusClasses = {
    'ON': 'text-green-600 font-medium',
    'OFF': 'text-red-600 font-medium',
    'Bật đèn': 'text-blue-600 font-medium'
  }
  return statusClasses[status] || 'text-gray-600'
}
</script>