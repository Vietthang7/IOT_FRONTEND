<template>
  <div class="w-64 lg:w-40 bg-primary text-white flex flex-col min-h-full">
    <!-- Close button for mobile -->
    <div class="lg:hidden flex justify-end p-4">
      <button @click="$emit('close-mobile')" class="text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Logo section -->
    <div class="flex flex-col items-center py-6">
      <IconHome class="w-8 h-8 lg:w-10 lg:h-10 mb-2" />
      <div class="text-sm lg:text-lg text-center font-bold px-2">
        <span class="lg:hidden">SMART<br />HOME</span>
        <span class="hidden lg:block">SMART HOME</span>
      </div>
    </div>
    
    <!-- Navigation section -->
    <nav class="flex-1 py-6">
      <div class="space-y-2">
        <SibarSidebarItem 
          v-for="item in menuItems" 
          :key="item.id" 
          :item="item" 
          :active="isActive(item.route)"
          @click="handleItemClick(item)" 
        />
      </div>
    </nav>
  </div>
</template>
<script setup>
const route = useRoute()
const router = useRouter()

const emit = defineEmits(['close-mobile'])
import IconHome from "@/components/global/IconHome.vue"
import IconDashboard from "@/components/global/IconDashboard.vue"
import IconSensor from "@/components/global/IconSensor.vue"
import IconDevice from "@/components/global/IconDevice.vue"
import IconProfile from "@/components/global/IconProfile.vue"
import IconLogout from "@/components/global/IconLogout.vue"

// State for logout process
const isLoggingOut = ref(false)

const menuItems = ref([
  {
    id: 'dashboard',
    icon: IconDashboard,
    label: 'Dashboard',
    route: '/'
  },
  {
    id: 'data-sensor',
    icon: IconSensor,
    label: 'Data Sensor',
    route: '/data-sensor'
  },
  {
    id: 'devices',
    icon: IconDevice,
    label: 'Devices',
    route: '/devices'
  },
  {
    id: 'profile',
    icon: IconProfile,
    label: 'Profile',
    route: '/profile'
  },
  {
    id: 'logout',
    icon: IconLogout,
    label: 'Logout',
  }
])

const isActive = (routePath) => {
  // Exact match cho home route
  if (routePath === '/') {
    return route.path === '/'
  }

  // Partial match cho các route khác
  return route.path.startsWith(routePath)
}

// Logout handler
const handleLogout = async () => {
  if (isLoggingOut.value) return

  try {
    isLoggingOut.value = true
    emit('close-mobile') // Close mobile menu

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

const handleItemClick = (item) => {
  if (item.id === 'logout') {
    handleLogout()
    return
  }

  // Normal navigation for other items
  if (item.route) {
    router.push(item.route)
    emit('close-mobile')
  }
}
</script>