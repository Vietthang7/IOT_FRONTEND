<template>
  <div 
    class="rounded-xl p-6 text-white shadow-lg transition-all duration-300 hover:transform hover:scale-105"
    :class="colorClasses[color]"
  >
    <div class="flex items-start px-7 py-7">
      
    </div>
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

const colorClasses = {
  green: 'bg-green-400',
  pink: 'bg-pink-400', 
  blue: 'bg-blue-500',
  orange: 'bg-orange-400',
  purple: 'bg-purple-500'
}
</script>