<template>
  <div class="group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
    :class="colorClasses[color]">
    
    <!-- Animated background pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 transform translate-x-16 -translate-y-16"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 transform -translate-x-12 translate-y-12"></div>
    </div>

    <!-- Shine effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
    
    <div class="relative z-10 flex justify-between items-center">
      <!-- Left side - Icon and Value -->
      <div class="flex-1">
        <!-- Icon with pulse animation -->
        <div class="mb-4 relative">
          <div class="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
          <div class="relative p-3 rounded-full bg-white/10 backdrop-blur-sm">
            <component :is="icon" class="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
        
        <!-- Value - DIRECT UPDATE -->
        <div class="space-y-1">
          <p class="text-3xl font-bold tracking-tight drop-shadow-lg transition-all duration-300 group-hover:scale-110">
            {{ value }}
          </p>
          <div class="w-12 h-1 bg-white/30 rounded-full transition-all duration-300 group-hover:w-16 group-hover:bg-white/50"></div>
        </div>
      </div>

      <!-- Right side - Title with enhanced typography -->
      <div class="text-right">
        <h3 class="text-xl font-bold text-white/95 leading-tight tracking-wide drop-shadow-lg">
          {{ title }}
        </h3>
        <!-- Decorative dots -->
        <div class="flex justify-end mt-2 space-x-1">
          <div class="w-2 h-2 rounded-full bg-white/40 transition-all duration-300 group-hover:bg-white/70"></div>
          <div class="w-2 h-2 rounded-full bg-white/30 transition-all duration-300 group-hover:bg-white/60 delay-75"></div>
          <div class="w-2 h-2 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/50 delay-150"></div>
        </div>
      </div>
    </div>

    <!-- Bottom accent line -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  }
})

// Enhanced gradient colors
const colorClasses = {
  green: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-emerald-500/25',
  pink: 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-500 shadow-pink-500/25',
  blue: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-blue-500/25',
  orange: 'bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 shadow-orange-500/25',
  purple: 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 shadow-purple-500/25'
}
</script>