<template>
  <HeaderBanner />
  <div class="space-y-6 px-14 mt-[73px]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-50">
      <StatisticsStatsCard title="Temperature" :value="`${statsCards[0].temp}°C`" icon="IconTemperature"
        color="green" />
      <StatisticsStatsCard title="Humidity" :value="`${statsCards[0].humidity}%`" icon="IconHumidity" color="pink" />
      <StatisticsStatsCard title="Light" :value="`${statsCards[0].lux} LUX`" icon="IconLight" color="blue" />
    </div>
    <div class="flex items-center gap-4 mt-10" style="margin-top: 50px">
      <div class="flex-1 rounded-lg p-1 shadow-md">
        <StatisticsSensorChart class="w-250" />
      </div>
      <div class="flex-1 rounded-lg p-10 shadow-md">
        <div class="flex items-center gap-3">
          <IconShortCut />
          <span class="text-lg font-semibold">
            Short Cut
          </span>
        </div>
        <div class="space-y-4 mt-7">
          <div v-for="device in devices" :key="device.device_name" class="flex items-center justify-between ">
            <div class="flex items-center gap-5">
              <div class="rounded-lg flex items-center justify-center">
                <IconLed v-if="device.device_name === 'Đèn'" class="text-white bg-#FF7A50 p-2 rounded-lg h-[60px] w-[60px]" />
                <IconFan v-else-if="device.device_name === 'Quạt'" class="text-white bg-#9350FF p-2 rounded-lg h-[60px] w-[60px] my-6" />
                <IconAir v-else class="text-white bg-#AAAAAA p-2 rounded-lg h-15 w-15" />
              </div>
              <span class="font-medium capitalize">{{ device.device_name }}</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="device.status === 'ON'" class="sr-only peer"
                @change="toggleDevice(device)" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const statsCards = ref([
  {
    temp: '32.8',
    humidity: '66',
    lux: '2151',
    time: '2024-06-10 14:30:00'
  },
])
const devices = ref([
  {
    device_name: "Đèn",
    status: "ON"
  },
  {
    device_name: "Quạt",
    status: "ON"
  },
  {
    device_name: "Điều hòa",
    status: "ON"
  }
])
</script>