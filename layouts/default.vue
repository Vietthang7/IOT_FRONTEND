<template>
  <div class="flex min-h-screen">
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" @click="closeMobileMenu">
    </div>
    <!-- Sidebar -->
    <div class="transition-transform duration-300 ease-in-out z-50" :class="{
      'fixed inset-y-0 left-0 transform': true,
      '-translate-x-full': !isMobileMenuOpen,
      'translate-x-0': isMobileMenuOpen,
      'lg:translate-x-0 lg:static lg:inset-0': true
    }">
      <Sibar @close-mobile="closeMobileMenu" />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- <Header @toggle-mobile-menu="toggleMoblieMenu" /> -->
      <main class="flex-1 overflow-auto p-4 lg:p6 xl:p-10">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
watch(() => useRoute().path, () => {
  closeMobileMenu()
})
// Close menu on window resize to desktop
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      closeMobileMenu()
    }
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>