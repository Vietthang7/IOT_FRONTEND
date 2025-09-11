<template>
  <div class="rounded-xl p-6 text-white shadow-lg transition-all duration-300 hover:transform hover:scale-105"
    :class="colorClasses[color]">
    <div class="flex justify-between px-7 py items-center">
      <div class="flex-1">
        <div class="mb-2">
          <component :is="icon" class="w-10 h-10 text-white" />
        </div>
        <p class="text-2xl font-bold">{{ value }}</p>
      </div>
      <p class="text-white/90 text-2xl font-bold mb-2">{{ title }}</p>
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