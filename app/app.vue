<script setup lang="ts">
import '@unocss/reset/tailwind.css'

const min = ref(0)
const max = ref(100)
const result = ref(0)
const errorMessage = ref('')

useHead({
  title: '随机数字生成器',
})

const rangeSize = computed(() => max.value - min.value + 1)
const hasInvalidRange = computed(() => {
  return !Number.isFinite(min.value) || !Number.isFinite(max.value) || min.value > max.value
})

function generate() {
  if (hasInvalidRange.value) {
    errorMessage.value = '请输入有效区间，且最小值不能大于最大值。'
    return
  }

  errorMessage.value = ''
  result.value = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value
}

function reset() {
  min.value = 0
  max.value = 100
  result.value = 0
  errorMessage.value = ''
}
</script>

<template>
  <main
    min-h-screen
    bg="gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
    flex="~ items-center justify-center"
    p="6 md:10"
  >
    <section
      w="full max-w-120"
      rounded="3xl"
      border="1 slate-200/80 dark:slate-800"
      bg="white/88 dark:slate-900/92"
      p="6 md:8"
      shadow="xl slate-300/20 dark:slate-950/40"
      backdrop-blur
      flex="~ col gap-6"
    >
      <header flex="~ col gap-2">
        <p text="sm slate-500 dark:slate-400" tracking="0.2em" uppercase>
          Random Generator
        </p>
        <h1 text="3xl md:4xl slate-900 dark:white" font="bold">
          随机数字生成器
        </h1>
        <p text="sm md:base slate-600 dark:slate-300">
          输入一个整数区间，快速生成随机结果。
        </p>
      </header>

      <div grid="~ cols-1 md:cols-2 gap-4">
        <label flex="~ col gap-2">
          <span text="sm slate-600 dark:slate-300" font-medium>
            最小值
          </span>
          <input
            v-model.number="min"
            type="number"
            rounded="xl"
            border="1 slate-200 dark:slate-700"
            bg="slate-50 dark:slate-950"
            p="3"
            text="base slate-900 dark:slate-100"
            outline="none focus:2 focus:blue-500/40"
          >
        </label>

        <label flex="~ col gap-2">
          <span text="sm slate-600 dark:slate-300" font-medium>
            最大值
          </span>
          <input
            v-model.number="max"
            type="number"
            rounded="xl"
            border="1 slate-200 dark:slate-700"
            bg="slate-50 dark:slate-950"
            p="3"
            text="base slate-900 dark:slate-100"
            outline="none focus:2 focus:blue-500/40"
          >
        </label>
      </div>

      <div
        rounded="2xl"
        p="4"
        flex="~ col gap-2"
        bg="slate-50 dark:slate-950"
        border="1 slate-200/80 dark:slate-800"
      >
        <div flex="~ items-center justify-between gap-3" text="sm slate-500 dark:slate-400">
          <span>当前区间</span>
          <span font-medium>{{ min }} ~ {{ max }}</span>
        </div>
        <div flex="~ items-center justify-between gap-3" text="sm slate-500 dark:slate-400">
          <span>可选数量</span>
          <span font-medium>{{ hasInvalidRange ? '--' : rangeSize }}</span>
        </div>
        <p v-if="errorMessage" text="sm red-500" m="0">
          {{ errorMessage }}
        </p>
      </div>

      <div flex="~ col md:row gap-3">
        <button
          flex-1
          rounded="xl"
          border-0
          bg="blue-600 hover:blue-500 disabled:slate-300 dark:disabled:slate-700"
          p="3"
          text="white"
          font-semibold
          transition-colors
          :disabled="hasInvalidRange"
          @click="generate"
        >
          生成结果
        </button>
        <button
          flex-1
          rounded="xl"
          border="1 slate-200 dark:slate-700"
          bg="white dark:slate-900"
          p="3"
          text="slate-700 dark:slate-200"
          font-semibold
          transition-colors
          hover="bg-slate-50 dark:bg-slate-800"
          @click="reset"
        >
          重置
        </button>
      </div>

      <div
        rounded="2xl"
        bg="gradient-to-r from-orange-400 via-rose-400 to-pink-500"
        p="6"
        text-center
        text-white
        shadow="lg rose-500/30"
      >
        <p text="sm white/80" m="0">
          当前结果
        </p>
        <p text="5xl md:6xl" font="black" m="2 0 0">
          {{ result }}
        </p>
      </div>
    </section>
  </main>
</template>
