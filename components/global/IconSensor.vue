<template>
  <svg :width="size" :height="size" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"
    :class="iconClass">
    <path
      d="M33.3334 4.16667H16.6667C9.77294 4.16667 4.16669 9.77292 4.16669 16.6667V43.75C4.16669 44.3025 4.38618 44.8324 4.77688 45.2231C5.16758 45.6138 5.69749 45.8333 6.25002 45.8333H33.3334C40.2271 45.8333 45.8334 40.2271 45.8334 33.3333V16.6667C45.8334 9.77292 40.2271 4.16667 33.3334 4.16667ZM41.6667 33.3333C41.6667 37.9292 37.9292 41.6667 33.3334 41.6667H8.33335V16.6667C8.33335 12.0708 12.0709 8.33333 16.6667 8.33333H33.3334C37.9292 8.33333 41.6667 12.0708 41.6667 16.6667V33.3333Z"
      :fill="color" />
    <path d="M14.5833 18.75H35.4166V22.9167H14.5833V18.75ZM14.5833 27.0833H29.1666V31.25H14.5833V27.0833Z"
      :fill="color" />
  </svg>

</template>

<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 32
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  iconClass: {
    type: String,
    default: ''
  }
})
</script>