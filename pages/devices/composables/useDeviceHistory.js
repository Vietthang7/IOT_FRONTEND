export const useDeviceHistory = () => {
  const { restAPI } = useAPI()

  // Reactive state
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

  // ===== API METHODS =====
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

  // ===== FILTER METHODS =====
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

  // ===== PAGINATION METHODS =====
  const onPageChanged = (page) => {
    currentPage.value = page
    fetchData()
  }

  const onLimitChanged = (newLimit) => {
    itemsPerPage.value = newLimit
    currentPage.value = 1
    fetchData()
  }

  // ===== COPY TO CLIPBOARD =====
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

      console.log('✅ Copied to clipboard:', text)
    } catch (error) {
      console.error('❌ Failed to copy:', error)

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
        console.error('Fallback copy also failed:', fallbackError)
      }
    }
  }

  // ===== UTILITY FUNCTIONS =====
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

  // ===== CLEANUP =====
  const cleanup = () => {
    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value)
    }
  }

  return {
    // State
    devices,
    loading,
    totalRecords,
    selectedDeviceType,
    searchDateTime,
    selectedStatus,
    currentPage,
    itemsPerPage,
    copiedId,

    // Methods
    fetchData,
    applyFilters,
    resetFilters,
    onPageChanged,
    onLimitChanged,
    copyToClipboard,
    getDeviceName,
    formatDateTime,
    cleanup
  }
}