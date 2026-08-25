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
    description: '定义范围、数量与唯一性，生成随机数字',
    icon: 'i-mdi-numeric',
  },
  {
    value: 'custom',
    label: '自定义',
    description: '任意输入一些选项，随机抽取结果',
    icon: 'i-mdi-format-list-bulleted',
  },
  {
    value: 'food',
    label: '吃什么',
    description: '内置餐食灵感，也可以追加你的选择',
    icon: 'i-mdi-food-outline',
  },
  {
    value: 'movie',
    label: '看什么',
    description: '内置电影类型，也可以追加你的选择',
    icon: 'i-mdi-movie-open-outline',
  },
  {
    value: 'agent',
    label: '选 Agent',
    description: '内置常用 AI 编程 Agent，也可以追加你的选择',
    icon: 'i-mdi-robot-outline',
  },
]

const activeMode = ref<GeneratorMode>('number')
const errorMessage = ref('')
const result = ref<GeneratorResult | null>(null)

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
  () => modes.find(mode => mode.value === activeMode.value) ?? modes[0],
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

function onModeChange(mode: GeneratorMode) {
  activeMode.value = mode
  errorMessage.value = ''
  result.value = null
}

function generate() {
  try {
    errorMessage.value = ''
    result.value =
      activeMode.value === 'number'
        ? generateNumbers(numberConfig)
        : generateListResult(activeMode.value, activeListConfig.value, presetItems.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '生成失败，请检查输入。'
    result.value = null
  }
}
</script>

<template>
  <main class="min-h-screen bg-page py-8 text-ink md:py-12">
    <div class="container">
      <AppHeader :theme="theme" @toggle-theme="toggleTheme" />

      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <section class="panel flex flex-col gap-6 p-5 sm:p-8">
          <div>
            <p class="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">生成模式</p>
            <h2
              class="m-0 mt-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
            >
              {{ activeModeOption?.label }}
            </h2>
            <p class="m-0 mt-2 text-sm leading-relaxed text-muted">
              {{ activeModeOption?.description }}
            </p>
          </div>

          <ModeTabs :modes="modes" :active-mode="activeMode" @select="onModeChange" />

          <NumberConfigPanel v-if="activeMode === 'number'" v-model="numberConfig" />
          <ListConfigPanel
            v-else
            v-model="activeListConfig"
            :mode="activeMode"
            :preset-count="presetCount"
          />

          <p v-if="errorMessage" role="alert" class="m-0 text-sm font-medium text-danger">
            {{ errorMessage }}
          </p>

          <button
            type="button"
            class="btn-primary cursor-pointer w-full sm:w-auto"
            @click="generate"
          >
            <span class="i-mdi-dice-multiple-outline" aria-hidden="true" />
            生成
          </button>
        </section>

        <ResultPanel :result="result" @generate="generate" />
      </div>

      <footer class="mt-8 border-t border-line pt-4">
        <p class="m-0 text-xs text-faint">每次点击都会产生新的随机结果</p>
      </footer>
    </div>
  </main>
</template>
