<template>
  <div class="flex min-h-screen">
    <!-- Mobile overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
      @click="closeMobileMenu"
    ></div>
    
    <!-- Sidebar - với cách 1 (fixed) -->
    <div class="transition-transform duration-300 ease-in-out z-50" :class="{
      'fixed inset-y-0 left-0 transform lg:translate-x-0 lg:static lg:inset-0': true,
      '-translate-x-full': !isMobileMenuOpen,
      'translate-x-0': isMobileMenuOpen,
    }">
      <Sibar @close-mobile="closeMobileMenu" />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- <Header @toggle-mobile-menu="toggleMoblieMenu" /> -->
      <main class="flex-1 overflow-auto p-4  xl:p-10">
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
</script>