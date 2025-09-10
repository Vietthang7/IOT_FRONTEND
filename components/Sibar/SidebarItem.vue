<template>
  <div 
    class="mx-2 px-3 py-4 cursor-pointer transition-all duration-200 rounded-lg group"
    :class="[
      active 
        ? 'bg-secondary shadow-lg transform scale-95' 
        : 'hover:bg-blue-500/50 hover:transform hover:scale-95'
    ]"
    @click="$emit('click')"
  >
    <div class="flex flex-col items-center text-center space-y-2">
      <component 
        :is="item.icon" 
        class="w-8 h-8 transition-transform duration-200"
        :class="[
          active ? 'scale-110' : 'group-hover:scale-110'
        ]"
      />
      <span 
        class="text-xs font-medium leading-tight transition-all duration-200"
        :class="[
          active ? 'text-white font-semibold' : 'text-white/90 group-hover:text-white'
        ]"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>