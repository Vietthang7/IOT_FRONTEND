<!-- filepath: c:\IOT\Frontend\components\Statistics\StatsCard.vue -->
<template>
  <div class="group relative overflow-hidden rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-xl transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
    :class="dynamicColorClass">
    
    <!-- Animated background pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-white/10 transform translate-x-10 -translate-y-10 lg:translate-x-16 lg:-translate-y-16"></div>
      <div class="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-white/5 transform -translate-x-8 translate-y-8 lg:-translate-x-12 lg:translate-y-12"></div>
    </div>

    <!-- Shine effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
    
    <div class="relative z-10 flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-between items-start sm:items-center lg:items-start xl:items-center gap-3 sm:gap-0 lg:gap-3 xl:gap-0">
      <!-- Left side - Icon and Value -->
      <div class="flex-1 order-2 sm:order-1 lg:order-2 xl:order-1">
        <!-- Icon with pulse animation -->
        <div class="mb-3 lg:mb-4 relative">
          <div class="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
          <div class="relative p-2 lg:p-3 rounded-full bg-white/10 backdrop-blur-sm">
            <component :is="icon" class="w-6 h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
          </div>
        </div>
        
        <!-- Value -->
        <div class="space-y-1">
          <p class="text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight drop-shadow-lg transition-all duration-300 group-hover:scale-110">
            {{ value }}
          </p>
          <div class="w-8 lg:w-12 h-1 bg-white/30 rounded-full transition-all duration-300 group-hover:w-12 lg:group-hover:w-16 group-hover:bg-white/50"></div>
        </div>
      </div>

      <!-- Right side - Title -->
      <div class="text-left sm:text-right lg:text-left xl:text-right order-1 sm:order-2 lg:order-1 xl:order-2">
        <h3 class="text-base lg:text-lg xl:text-xl font-bold text-white/95 leading-tight tracking-wide drop-shadow-lg">
          {{ title }}
        </h3>
        <!-- Decorative dots -->
        <div class="flex justify-start sm:justify-end lg:justify-start xl:justify-end mt-2 space-x-1">
          <div class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white/40 transition-all duration-300 group-hover:bg-white/70"></div>
          <div class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white/30 transition-all duration-300 group-hover:bg-white/60 delay-75"></div>
          <div class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/50 delay-150"></div>
        </div>
      </div>
    </div>

    <!-- Bottom accent line -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
  </div>
</template>

<script setup>
const props = defineProps({
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
  purple: 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 shadow-purple-500/25',
  yellow: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-yellow-500/25',
  // ✅ THÊM MÀU TỐI CHO ÁNH SÁNG YẾU
  dark: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-gray-700/25',
  // ✅ MÀU XANH LÁ BT CHO ÁNH SÁNG VỪA
  lightGreen: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-emerald-500/25'
}

// ✅ Computed để xác định màu động dựa trên giá trị ánh sáng
const dynamicColorClass = computed(() => {
  // Kiểm tra nếu đây là card ánh sáng
  if (props.title === 'Ánh sáng' || props.title.toLowerCase().includes('ánh sáng')) {
    // Extract numeric value từ string (loại bỏ "LUX", khoảng trắng...)
    const numericValue = parseInt(props.value.replace(/[^\d]/g, '')) || 0
    
    // ✅ Logic màu theo giá trị:
    if (numericValue <= 100) {
      return colorClasses.dark // Tối
    } else if (numericValue > 100 && numericValue <= 500) {
      return colorClasses.lightGreen // Xanh bình thường
    } else {
      return colorClasses.yellow // Vàng (sáng)
    }
  }
  
  // Trả về màu mặc định cho các card khác
  return colorClasses[props.color] || colorClasses.blue
})
</script>