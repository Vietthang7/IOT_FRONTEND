<template>
  <div class="w-40 bg-primary  text-white flex flex-col min-h-screen">
    <div class="flex flex-col items-center py-6">
      <IconHome class="w-10 h-10 mb-2" />
      <div class="txt-lg text-center font-bold">
        SMART HOME
      </div>
    </div>
    <nav class="flex-1 py-6">
      <div class="space-y-2">
        <SibarSidebarItem v-for="item in menuItems" :key="item.id" :item="item" :active="isActive(item.route)"
          @click="navigateTo(item.route)" />
      </div>
    </nav>
  </div>
</template>
<script setup>
const route = useRoute()
const router = useRouter()
import IconHome from "@/components/global/IconHome.vue"
import IconDashboard from "@/components/global/IconDashboard.vue"
import IconSensor from "@/components/global/IconSensor.vue"
import IconDevice from "@/components/global/IconDevice.vue"
import IconProfile from "@/components/global/IconProfile.vue"
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
const navigateTo = (routePath) => {
  router.push(routePath)
}
</script>