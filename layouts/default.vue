<template>
  <div class="flex h-screen">
    <Sibar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main class="flex-1 overflow-auto p-10 py-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
</script>