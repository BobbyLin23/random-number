<script setup lang="ts">
import { agentPresets, foodPresets, moviePresets } from '~/data/generatorPresets'
import type {
  GeneratorMode,
  GeneratorResult,
  ListConfig,
  ModeOption,
  NumberConfig,
} from '~/types/generator'

const { theme, toggleTheme } = useTheme()

const modes: ModeOption[] = [
  {
    value: 'number',
    label: '随机数字',
    description: '设定范围，抽一个数字，或一次抽几个。',
    question: '抽哪个数？',
  },
  {
    value: 'custom',
    label: '自定义清单',
    description: '把你的选项放进来，剩下的交给概率。',
    question: '抽哪一个？',
  },
  {
    value: 'food',
    label: '吃什么',
    description: '从常吃的里抽一个，也可以加上今天想吃的。',
    question: '今天吃什么？',
  },
  {
    value: 'movie',
    label: '看什么',
    description: '不知道看什么，让片单替你挑一部。',
    question: '今晚看什么？',
  },
  {
    value: 'agent',
    label: '选 Agent',
    description: '几个都想试？抽一个决定今晚用谁。',
    question: '今晚用哪个？',
  },
]

const activeMode = ref<GeneratorMode>('number')
const errorMessage = ref('')
const result = ref<GeneratorResult | null>(null)
const rollingValues = ref<Array<number | string> | null>(null)
const drawCount = ref(0)
const prefersReducedMotion = ref(false)

const numberConfig = reactive<NumberConfig>({
  min: 1,
  max: 100,
  count: 1,
  unique: false,
  integer: true,
  sort: false,
})

const customListConfig = reactive<ListConfig>({
  rawItems: '',
  count: 1,
  unique: true,
})

const presetListConfig = reactive<ListConfig>({
  rawItems: '',
  count: 1,
  unique: true,
})

const activeModeOption = computed(
  () => modes.find(mode => mode.value === activeMode.value) ?? modes[0]!,
)

const activeListConfig = computed(() =>
  activeMode.value === 'custom' ? customListConfig : presetListConfig,
)

const presetItems = computed(() => {
  if (activeMode.value === 'food') {
    return foodPresets
  }

  if (activeMode.value === 'movie') {
    return moviePresets
  }

  if (activeMode.value === 'agent') {
    return agentPresets
  }

  return []
})

const presetCount = computed(() => presetItems.value.length)

const drawLabel = computed(() => {
  const count = activeMode.value === 'number' ? numberConfig.count : activeListConfig.value.count
  const quantity = Number.isFinite(count) && count > 0 ? Math.floor(count) : 1

  return activeMode.value === 'number' ? `抽 ${quantity} 个数字` : `抽 ${quantity} 个结果`
})

function buildResult(): GeneratorResult {
  if (activeMode.value === 'number') {
    return generateNumbers(numberConfig)
  }

  return generateListResult(activeMode.value, activeListConfig.value, presetItems.value)
}

let rollTimer: ReturnType<typeof setTimeout> | null = null

function stopRolling() {
  if (rollTimer) {
    clearTimeout(rollTimer)
    rollTimer = null
  }

  rollingValues.value = null
}

function draw() {
  errorMessage.value = ''

  let next: GeneratorResult

  try {
    next = buildResult()
  } catch (error) {
    stopRolling()
    result.value = null
    errorMessage.value = error instanceof Error ? error.message : '抽取失败，请检查输入。'
    return
  }

  stopRolling()
  result.value = next

  if (prefersReducedMotion.value) {
    drawCount.value += 1
    return
  }

  rollingValues.value = next.values
  const startedAt = performance.now()

  const tick = () => {
    if (performance.now() - startedAt >= 480) {
      rollingValues.value = null
      drawCount.value += 1
      rollTimer = null
      return
    }

    try {
      rollingValues.value = buildResult().values
    } catch {
      rollingValues.value = next.values
    }

    rollTimer = setTimeout(tick, 60)
  }

  rollTimer = setTimeout(tick, 60)
}

function onModeChange(mode: GeneratorMode) {
  if (mode === activeMode.value) {
    return
  }

  activeMode.value = mode
  errorMessage.value = ''
  result.value = null
  stopRolling()
}

watch(
  [numberConfig, customListConfig, presetListConfig],
  () => {
    errorMessage.value = ''
  },
  { deep: true },
)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onUnmounted(stopRolling)
</script>

<template>
  <main class="min-h-screen bg-page text-ink">
    <div class="container">
      <AppHeader :theme="theme" @toggle-theme="toggleTheme" />

      <ModeTabs :modes="modes" :active-mode="activeMode" @select="onModeChange" />

      <div
        class="mt-7 grid gap-8 lg:mt-9 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-12"
      >
        <div class="order-2 flex flex-col gap-7 lg:order-none">
          <p class="m-0 text-[13px] leading-6 text-muted">{{ activeModeOption.description }}</p>

          <NumberConfigPanel v-if="activeMode === 'number'" v-model="numberConfig" />
          <ListConfigPanel
            v-else
            v-model="activeListConfig"
            :mode="activeMode"
            :preset-count="presetCount"
          />
        </div>

        <ResultPanel
          class="order-1 lg:order-none"
          :result="result"
          :rolling-values="rollingValues"
          :serial="drawCount"
          :cta-label="drawLabel"
          :mode-label="activeModeOption.label"
          :question="activeModeOption.question"
          :error="errorMessage"
          @draw="draw"
        />
      </div>

      <footer class="mt-12 border-t border-line pt-4">
        <p class="m-0 text-[12px] leading-5 text-faint">
          所有抽取都在浏览器里完成，不会上传任何内容。刷新后重新开始。
        </p>
      </footer>
    </div>
  </main>
</template>
