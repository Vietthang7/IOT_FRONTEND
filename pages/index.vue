<template>
  <HeaderBanner/>
  <div class="space-y-6 px-14 mt-[73px]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-50">
      <StatisticsStatsCard title="Temperature" :value="`${statsCards[0].temp}°C`" icon="IconTemperature" color="green" />
      <StatisticsStatsCard title="Humidity" :value="`${statsCards[0].humidity}%`" icon="IconHumidity" color="pink" />
      <StatisticsStatsCard title="Light" :value="`${statsCards[0].lux} LUX`" icon="IconLight" color="blue" />
    </div>
  </div>
</template>
<script setup>
const statsCards = ref([
  {
    temp: '32.8',
    humidity: '66',
    lux: '2151'
  },
])
const devices = ref([
  {
    device_name: "den",
    status: "ON"
  },
  {
    device_name: "quat",
    status: "ON"
  },
  {
    device_name: "dieuhoa",
    status: "ON"
  }
])
</script>