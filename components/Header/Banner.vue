<template>
  <div class="relative mt-6 rounded-xl overflow-hidden h-[298px] max-w-7xl mx-auto">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img 
        src="/img/thoitiet.jpg" 
        alt="Weather Background"
        class="w-full max-h-[298px] object-cover"
      />
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>

    <!-- Content -->
    <div class="relative h-full flex items-center justify-between p-20 text-white">
      <!-- Left Content -->
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-2">{{ greeting }}</h2>
        <p class="text-gray-200 opacity-90">{{ message }}</p>
      </div>

      <!-- Right Content - Weather Info -->
      <div class="flex items-center space-x-8">
        <div class="text-right">
          <div class="text-sm text-gray-300">{{ currentDate }}</div>
          <div class="text-lg font-medium">{{ currentTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const greeting = ref('Hi, obito ! Good Evening...')
const message = ref('Welcome Home, it\'s snowing outside stay safe')
const currentDate = ref('')
const currentTime = ref('')

const updateDateTime = () => {
  const now = new Date()
  
  currentDate.value = now.toLocaleDateString('en-GB', { 
    day: '2-digit',
    month: 'short', 
    year: 'numeric' 
  })
  
  currentTime.value = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  })
}
onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)
})
</script>