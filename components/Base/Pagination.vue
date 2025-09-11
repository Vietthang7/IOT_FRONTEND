<template>
  <div>
    <div class="flex items-center justify-between">
      <div v-if="show" class="text-right text-base-text sm:txt-base txt-xs">
        Hiển thị
        <span>{{ from }}</span>
        -
        <span>{{ to }}</span>
        trong
        <span>{{ pageCount }}</span>
        kết quả
      </div>
      <nav class="hidden md:block" v-if="totalPage > 1">
        <ul class="p-0 m-0 flex flex-wrap justify-center items-center">
          <li v-if="current > 1" class="mx-1">
            <button
              class="flex items-center cursor-pointer justify-center transition-all-200 ease-in-out bg-transparent rounded-full h-8 w-8 text-gray-600 text-lg"
              @click="changePage(current - 1)">
              <IconMuiTenTrai />
            </button>
          </li>
          <ClientOnly>
            <li v-for="n in pagesToShow" :key="n" class="mx-1">
              <button
                class="flex items-center cursor-pointer justify-center rounded-full h-8 w-8 text-lg font-medium transition-all"
                :class="current === n ? 'bg-blue-800 text-white' : 'bg-transparent text-gray-700 hover:bg-blue-100 hover:text-blue-600'"
                @click="changePage(n)">{{ n }}</button>
            </li>
          </ClientOnly>
          <li v-if="current < totalPage" class="mx-1">
            <button
              class="flex items-center cursor-pointer justify-center transition-all-200 ease-in-out bg-transparent rounded-full h-8 w-8 text-gray-600 text-lg"
              @click="changePage(current + 1)">
              <IconMuiTenPhai />
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <ClientOnly>
      <nav class="md:hidden mt-6" v-if="totalPage > 1">
        <ul class="p-0 m-0 flex flex-wrap justify-center items-center">
          <li v-if="current > 1" class="mx-1">
            <button
              class="flex items-center cursor-pointer justify-center transition-all-200 ease-in-out bg-transparent rounded-full h-8 w-8 text-gray-600 text-lg"
              @click="changePage(current - 1)">
              <IconMuiTenTrai />
            </button>
          </li>
          <li v-for="n in pagesToShow" :key="n" class="mx-1">
            <button
              class="flex items-center cursor-pointer justify-center rounded-full h-8 w-8 text-lg font-medium transition-all"
              :class="current === n ? 'bg-blue-800 text-white' : 'bg-transparent text-base-text hover:bg-blue-100'"
              @click="changePage(n)">{{ n }}</button>
          </li>
          <li v-if="current < totalPage" class="mx-1">
            <button
              class="flex items-center cursor-pointer justify-center transition-all-200 ease-in-out bg-transparent rounded-full h-8 w-8 text-gray-600 text-lg"
              @click="changePage(current + 1)">
              <IconMuiTenPhai />
            </button>
          </li>
        </ul>
      </nav>
    </ClientOnly>
  </div>
</template>

<script setup>
const current = defineModel("current")
const props = defineProps({
  pageCount: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 10,
  },
  show: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(["pageChanged", "update:limit"])

const totalPage = computed(() => Math.max(1, Math.ceil(props.pageCount / props.limit)))

const windowWidth = ref(window?.innerWidth)
function handleResize() {
  windowWidth.value = window?.innerWidth
}
onMounted(() => {
  window.addEventListener("resize", handleResize)
})
onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
})

const pagesToShow = computed(() => {
  const pages = []
  if (windowWidth.value > 850) {
    if (totalPage.value <= 5) {
      for (let i = 1; i <= totalPage.value; i++) pages.push(i)
    } else {
      if (current.value <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPage.value)
      } else if (current.value >= totalPage.value - 2) {
        pages.push(1, "...", totalPage.value - 3, totalPage.value - 2, totalPage.value - 1, totalPage.value)
      } else {
        pages.push(1, "...", current.value - 1, current.value, current.value + 1, "...", totalPage.value)
      }
    }
  } else {
    if (totalPage.value <= 3) {
      for (let i = 1; i <= totalPage.value; i++) pages.push(i)
    } else {
      pages.push(1, 2, 3, "...", totalPage.value)
    }
  }
  return pages.filter((v, i, arr) => arr.indexOf(v) === i)
})

const from = computed(() => (props.pageCount === 0 ? 0 : (current.value - 1) * props.limit + 1))
const to = computed(() => Math.min(current.value * props.limit, props.pageCount))

const limitOptions = [10, 20, 50, 100]

function changePage(page) {
  if (typeof page === "number" && page !== current.value && page >= 1 && page <= totalPage.value) {
    current.value = page
    emit("pageChanged", page)
  }
}

function onLimitChange(e) {
  const newLimit = Number(e.target.value)
  emit("update:limit", newLimit)
  current.value = 1
  emit("pageChanged", 1)
}
</script>
