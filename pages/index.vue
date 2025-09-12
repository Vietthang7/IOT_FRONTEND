<template>
  <HeaderBanner />
  <div class="space-y-6 px-14 mt-[73px]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-50">
      <StatisticsStatsCard title="Temperature" :value="`${sensorData.temp}°C`" icon="IconTemperature" color="green" />
      <StatisticsStatsCard title="Humidity" :value="`${sensorData.humidity}%`" icon="IconHumidity" color="pink" />
      <StatisticsStatsCard title="Light" :value="`${sensorData.lux} LUX`" icon="IconLight" color="blue" />
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
          <div v-for="device in devices" :key="device.device_name" class="flex items-center justify-between">
            <div class="flex items-center gap-5">
              <div class="rounded-lg flex items-center justify-center">
                <IconLed v-if="device.device_name === 'den'" class="text-white bg-#FF7A50 p-2 rounded-lg h-[60px] w-[60px]" />
                <IconFan v-else-if="device.device_name === 'quat'" class="text-white bg-#9350FF p-2 rounded-lg h-[60px] w-[60px] " />
                <IconAir v-else class="text-white bg-#AAAAAA p-2 rounded-lg h-15 w-15" />
              </div>
              <span class="font-medium capitalize">{{ device.device_name }}</span>
            </div>
            
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="device.status === 'ON'" class="sr-only peer" @change="toggleDevice(device)" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSocket } from '~/composables/useSocket';
import { useSensorData } from '~/composables/useSensorData';
import { useDevices } from '~/composables/useDevices';

// Kết nối socket
const { isConnected, deviceStatuses, connectionError } = useSocket();

// Lấy dữ liệu cảm biến
const { sensorData } = useSensorData({ latestSensorData: deviceStatuses });

// Lấy và điều khiển thiết bị
const { devices, toggleDevice } = useDevices({ deviceStatuses, controlDevice: (device, action) => {
  fetch('http://localhost:3002/api/control_device', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      device_name: device,
      action: action
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Control device response:', data);
  })
  .catch(error => {
    console.error('Error controlling device:', error);
  });
}});
</script>