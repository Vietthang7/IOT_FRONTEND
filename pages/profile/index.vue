<template>
  <div class="max-h-200 flex justify-center items-center p-0">
    <div class="bg-[#3949ab] rounded-20px p-3 lg:p-8 max-w-800px w-full text-white shadow-xl lg:shadow-2xl">
      <h1 class="text-center txt-3xl lg:text-4xl mb-4 lg:mb-4 font-light">My profile</h1>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start">
        <!-- Avatar Section -->
        <div class="flex-shrink-0">
          <img src="/img/obito1.jpg" alt="Profile Avatar"
            class="w-150px h-150px lg:w-200px lg:h-200px rounded-15px object-cover border-3 border-white/20" />
        </div>

        <!-- Info Section -->
        <div class="flex-1 flex flex-col gap-4 lg:gap-5 text-center lg:text-left w-full">
          <!-- Họ tên -->
          <div class="flex flex-col gap-1">
            <span class="txt-lg font-medium opacity-90">Họ tên:</span>
            <span class="txt-xl font-light">Nguyễn Viết Thắng</span>
          </div>

          <!-- Mã sinh viên -->
          <div class="flex flex-col gap-1">
            <span class="txt-lg font-medium opacity-90">Mã sinh viên:</span>
            <span class="txt-xl font-light">B22DCCN815</span>
          </div>

          <!-- IOT Class -->
          <div class="flex flex-col gap-1">
            <span class="txt-lg font-medium opacity-90">IOT Class:</span>
            <span class="txt-xl font-light">IOT-15</span>
          </div>

          <!-- GitHub Links -->
          <div class="flex flex-col gap-1">
            <span class="txt-lg font-medium opacity-90">GITHUB LINK:</span>
            <div class="flex flex-col gap-2">
              <a href="https://github.com/Vietthang7/IOT_BACKEND" target="_blank"
                class="text-[#81c784] no-underline txt-lg transition-colors duration-300 hover:text-[#a5d6a7] hover:underline">
                BE(Golang)
              </a>
              <a href="https://github.com/Vietthang7/IOT_FRONTEND" target="_blank"
                class="text-[#81c784] no-underline txt-lg transition-colors duration-300 hover:text-[#a5d6a7] hover:underline">
                FE(Vue3:Nuxt4)
              </a>
              <a href="https://github.com/Vietthang7/IOT_PTIT" target="_blank"
                class="text-[#81c784] no-underline txt-lg transition-colors duration-300 hover:text-[#a5d6a7] hover:underline">
                IOT(C++,ESP32)
              </a>
            </div>
          </div>

          <!-- PDF Link Section -->
          <div class="flex flex-col gap-1">
            <a href="https://drive.google.com/file/d/1jvylQmuu73_sjzB8huBaPPoyBFhBEiOD/view?usp=drive_link" target="_blank"
              class="text-[#81c784] no-underline txt-lg transition-colors duration-300 hover:text-[#a5d6a7] hover:underline">
              Báo cáo (PDF)
            </a>
          </div>

          <!-- Postman Document -->
          <div class="flex flex-col gap-1">
            <a href="https://documenter.getpostman.com/view/35594163/2sB3QGtB5T" target="_blank"
              class="text-[#81c784] no-underline txt-lg transition-colors duration-300 hover:text-[#a5d6a7] hover:underline">
              Postman Document (API)
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>