<template>
  <HeaderBanner />
  <div class="space-y-6 px-14 mt-[73px]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-50">
      <StatisticsStatsCard title="Nhiệt độ" :value="`20°C`" icon="IconTemperature" color="green" />
      <StatisticsStatsCard title="Độ ẩm" :value="`60%`" icon="IconHumidity" color="pink" />
      <StatisticsStatsCard title="Ánh sáng" :value="`120 LUX`" icon="IconLight" color="blue" />
    </div>

    <div class="flex items-center gap-4 mt-10" style="margin-top: 50px">
      <div class="flex-1 rounded-lg p-1 shadow-md">
        <StatisticsSensorChart class="w-250" :sensor-data="sensorData" :is-loading="isSensorLoading"
          @refresh="handleSensorRefresh" />
      </div>
      <div class="flex-1 rounded-lg p-10 shadow-md">
        <div class="flex items-center gap-3">
          <IconShortCut />
          <span class="text-lg font-semibold">
            Short Cut
          </span>
        </div>

        <div class="space-y-4 mt-7">
          <div v-for="device in results.data.devices" :key="device.device_name"
            class="flex items-center justify-between">
            <div class="flex items-center gap-5">
              <div class="rounded-lg flex items-center justify-center">
                <IconLed v-if="device.device_name === 'den'"
                  class="text-white bg-#FF7A50 p-2 rounded-lg h-[60px] w-[60px]" />
                <IconFan v-else-if="device.device_name === 'quat'"
                  class="text-white bg-#9350FF p-2 rounded-lg h-[60px] w-[60px] " />
                <IconAir v-else-if="device.device_name === 'dieuhoa'"
                  class="text-white bg-#AAAAAA p-2 rounded-lg h-15 w-15" />
              </div>
              <span class="font-medium capitalize">{{ device.device_name }}</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="device.status === 'ON'" class="sr-only peer"
                @change="toggleDevice(device)" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { restAPI } = useAPI();
const results = ref([]);
const isToggling = ref(false);
const sensorData = ref([]);
const isSensorLoading = ref(false);
const fetchDataDevices = async () => {
  try {
    const { data } = await restAPI.stores.getListDevice({
      params: {
        page: 1,
        limit: 999,
      }
    });
    results.value = data.value;
  } catch (error) {
    console.log('Error fetching devices:', error);
    results.value = [];
  }
}
const fetchSensorData = async () => {
  console.log(isSensorLoading.value)
  isSensorLoading.value = true;
  try {
    const { data } = await restAPI.stores.getDataSensor({
      params: {
        page: 1,
        limit: 12,
        sort: "true"
      }
    });

    sensorData.value = data.value.data.data || [];

  } catch (error) {
    sensorData.value = [];
  } finally {
    isSensorLoading.value = false;
  }
}
const handleSensorRefresh = async () => {
  await fetchSensorData();
}
await Promise.all([
  fetchDataDevices(),
  fetchSensorData()
]);
const toggleDevice = async (device) => {
  if (isToggling.value) return;
  isToggling.value = true;
  const currentStatus = device.status;
  const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
  try {
    const response = await restAPI.stores.conTrolDevice({
      body: {
        device_name: device.device_name,
        action: newStatus
      }
    });
    device.status = newStatus;
    console.log(response.status)
  } catch (error) {
  } finally {
    setTimeout(() => {
      isToggling.value = false;
    }, 1000);
  }
}
</script>