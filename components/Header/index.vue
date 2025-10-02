<template>
  <header class="px-4 lg:px-9 pb-0 pt-4 lg:pt-9 bg-white  border-gray-200 sticky top-0 z-30">
    <div class="flex items-center justify-between">
      <!-- Mobile Menu Button -->
      <button @click="$emit('toggle-mobile-menu')"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <!-- Logo for mobile (hidden on desktop where sidebar shows it) -->
      <div class="lg:hidden flex items-center">
        <IconHome class="w-8 h-8 text-primary mr-2" />
        <span class="text-lg font-bold text-primary">SMART HOME</span>
      </div>
      
      <!-- User Info -->
      <div class="flex items-center ml-auto">
        <div class="flex items-center space-x-3 lg:space-x-7">
          <HeaderAvatar />
          <div class="hidden sm:block">
            <div class="text-sm font-medium text-base-text-2">
              <span class="hidden lg:inline">Nguyễn Viết<br />Thắng</span>
              <span class="lg:hidden">N.V.Thắng</span>
            </div>
          </div>
          
          <!-- Menu Dropdown -->
          <div class="relative" ref="dropdownRef">
            <button 
              @click="toggleDropdown"
              class="bg-transparent border-none outline-none focus:outline-none hover:bg-gray-100 p-2 rounded-lg transition-colors"
              :class="{ 'bg-blue-50': isDropdownOpen }"
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">Contact Admin</span>
              </button>
              
              <!-- Logout Option -->
              <button
                @click="handleLogout"
                :disabled="isLoggingOut"
                class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 disabled:opacity-50"
              >
                <svg v-if="!isLoggingOut" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <div v-else class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-sm">{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle-mobile-menu'])
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