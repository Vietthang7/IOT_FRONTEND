<!-- filepath: c:\IOT\Frontend\components\Header\index.vue -->
<template>
  <header class="px-9 pb-0 pt-9">
    <div class="flex items-center justify-end">
      <div class="flex items-center">
        <div class="flex items-center space-x-7">
          <HeaderAvatar />
          <div class="hidden md:block">
            <div class="text-sm font-medium text-base-text-2">Nguyễn Viết<br />Thắng</div>
          </div>
          
          <!-- Menu Dropdown -->
          <div class="relative" ref="dropdownRef">
            <button 
              @click="toggleDropdown"
              class="bg-transparent border-none outline-none focus:outline-none hover:bg-gray-100 p-2 rounded-lg transition-colors"
              :class="{ 'bg-blue-900': isDropdownOpen }"
            >
              <IconMenu />
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="isDropdownOpen"
              class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animateZoomIn"
            >
              <!-- Contact Admin Option -->
              <button
                @click="handleContactAdmin"
                class="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-3"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>Liên hệ Admin</span>
              </button>

              <!-- Divider -->
              <div class="border-t border-gray-100 my-1"></div>

              <!-- Logout Option -->
              <button
                @click="handleLogout"
                :disabled="isLoggingOut"
                class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div v-if="isLoggingOut" class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>{{ isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import IconMenu from '~/components/global/IconMenu.vue'

const router = useRouter()

// Dropdown state
const isDropdownOpen = ref(false)
const isLoggingOut = ref(false)
const dropdownRef = ref(null)

// Toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Handle contact admin (placeholder for future implementation)
const handleContactAdmin = () => {
  isDropdownOpen.value = false
}

// Handle logout
const handleLogout = async () => {
  if (isLoggingOut.value) return
  
  try {
    isLoggingOut.value = true
    isDropdownOpen.value = false
    
    // Clear authentication data
    const authToken = useCookie('auth-token')
    const userInfo = useCookie('user-info')
    
    // Remove cookies
    authToken.value = null
    userInfo.value = null
    console.log('✅ Logged out successfully')
    
    // Redirect to login page
    await router.push('/login')
    
  } catch (error) {
    console.error('❌ Logout error:', error)
    
    // Even if there's an error, try to clear local data and redirect
    try {
      const authToken = useCookie('auth-token')
      const userInfo = useCookie('user-info')
      authToken.value = null
      userInfo.value = null
      await router.push('/login')
    } catch (fallbackError) {
      console.error('❌ Fallback logout also failed:', fallbackError)
      // Force page reload as last resort
      window.location.href = '/login'
    }
  } finally {
    isLoggingOut.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Close dropdown when route changes
watch(() => router.currentRoute.value.path, () => {
  isDropdownOpen.value = false
})
</script>

<style scoped>
/* Ensure dropdown appears above other elements */
.z-50 {
  z-index: 50;
}

/* Enhanced dropdown animation */
.animateZoomIn {
  animation: dropdownZoomIn 0.2s ease-out;
}

@keyframes dropdownZoomIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Smooth hover transitions */
.transition-colors {
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
}
</style>