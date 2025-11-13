export const useDeviceStats = () => {
  const { restAPI } = useAPI()

  // Reactive state
  const searchDate = ref('')
  const statsData = ref(null)
  const statsLoading = ref(false)

  // ===== DATE UTILITY =====
  const normalizeDate = (dateString) => {
    if (!dateString) return null
    
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

  // ===== API METHODS =====
  const fetchStatsByDate = async (date) => {
    try {
      statsLoading.value = true
      
      const normalizedDate = normalizeDate(date)
      
      if (!normalizedDate) {
        console.error('❌ Invalid date format')
        statsData.value = null
        return
      }
      
      const response = await restAPI.stores.getDeviceStatsByDateRange({
        params: {
          date: normalizedDate
        }
      })
      
      console.log('📊 Stats response:', response)
      
      if (response && response.status && response.code === 200) {
        statsData.value = response.data
      } else {
        statsData.value = null
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      statsData.value = null
    } finally {
      statsLoading.value = false
    }
  }

  // ===== SEARCH METHODS =====
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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // ===== INITIALIZATION =====
  const initializeStats = () => {
    const today = new Date().toISOString().split('T')[0]
    searchDate.value = today
    fetchStatsByDate(today)
  }

  return {
    // State
    searchDate,
    statsData,
    statsLoading,

    // Methods
    fetchStatsByDate,
    searchStatsByDate,
    resetStatsSearch,
    getDeviceName,
    formatDate,
    initializeStats
  }
}