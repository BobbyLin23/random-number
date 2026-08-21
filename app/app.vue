<script setup lang="ts">
import { foodPresets, moviePresets } from '~/data/generatorPresets'
import type {
  GeneratorMode,
  GeneratorResult,
  ListConfig,
  ModeOption,
  NumberConfig,
} from '~/types/generator'

import '@unocss/reset/tailwind.css'

const modes: ModeOption[] = [
  { value: 'number', label: '随机数字', description: '范围、数量、唯一值', icon: 'i-mdi-numeric' },
  {
    value: 'custom',
    label: '自定义',
    description: '从你的清单抽取',
    icon: 'i-mdi-format-list-bulleted',
  },
  { value: 'food', label: '吃什么', description: '内置餐食灵感', icon: 'i-mdi-food-outline' },
  {
    value: 'movie',
    label: '看什么',
    description: '内置电影类型',
    icon: 'i-mdi-movie-open-outline',
  },
]

const activeMode = ref<GeneratorMode>('number')
const theme = ref<'light' | 'dark'>('light')
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
  rawItems: '散步\n整理桌面\n读 20 分钟书\n做一杯咖啡',
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
const resultTitle = computed(() => result.value?.values.join('、') ?? '点击生成')
const resultMeta = computed(() => result.value?.meta ?? '随机数字优先，其它模式随时切换')
const themeLabel = computed(() => (theme.value === 'dark' ? '切换浅色' : '切换深色'))
const activeListConfig = computed(() =>
  activeMode.value === 'custom' ? customListConfig : presetListConfig,
)

const modePresetItems = computed(() => {
  if (activeMode.value === 'food') {
    return foodPresets
  }

  if (activeMode.value === 'movie') {
    return moviePresets
  }

  return []
})

function getModeButtonStyle(mode: GeneratorMode) {
  const active = activeMode.value === mode

  return {
    backgroundColor: active ? '#1c1c1c' : 'rgba(255, 255, 255, 0.42)',
    color: active ? '#fcfbf8' : '#1c1c1c',
  }
}

function syncTheme(nextTheme: 'light' | 'dark') {
  if (!import.meta.client) {
    return
  }

  document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  document.documentElement.style.colorScheme = nextTheme
  localStorage.setItem('random-generator-theme', nextTheme)
}

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
        : generateListResult(activeMode.value, activeListConfig.value, modePresetItems.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '生成失败，请检查输入。'
  }
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

watch(theme, value => syncTheme(value))

onMounted(() => {
  const savedTheme = localStorage.getItem('random-generator-theme')
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

  theme.value = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredTheme
  syncTheme(theme.value)
})

useHead({
  title: '随机生成器',
  htmlAttrs: {
    lang: 'zh-CN',
  },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>

<template>
  <main page-shell min-h-screen overflow-x-hidden :style="{ fontFamily: 'var(--font-body)' }">
    <section section-frame min-h-screen flex="~ col" py-6 md:py-8>
      <header flex="~ items-center justify-between gap-4" pb-6>
        <div flex="~ items-center gap-3">
          <div
            h-11
            w-11
            rounded-full
            border="1 [rgba(28,28,28,0.08)] dark:[rgba(243,239,230,0.12)]"
            bg="[rgba(255,255,255,0.45)] dark:[rgba(255,255,255,0.04)]"
            flex="~ items-center justify-center"
            text-lg
          >
            <div i-mdi-shuffle-variant />
          </div>
          <div>
            <p eyebrow m-0>随机工具</p>
            <h1 m-0 text="xl [rgba(28,28,28,0.92)] dark:[rgba(243,239,230,0.94)]">随机生成器</h1>
          </div>
        </div>

        <button ghost-button type="button" @click="toggleTheme">
          <div
            :class="theme === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-moon-waning-crescent'"
          />
          <span hidden sm:inline>{{ themeLabel }}</span>
        </button>
      </header>

      <div
        grid="~ cols-1 lg:cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] gap-5 lg:gap-7"
        flex-1
        items-stretch
      >
        <section
          soft-panel
          bg="[rgba(255,255,255,0.34)] dark:[rgba(255,255,255,0.03)]"
          p="5 sm:6"
          flex="~ col gap-5"
        >
          <div flex="~ col gap-2">
            <p eyebrow m-0>生成模式</p>
            <h2
              m-0
              text="[clamp(2.2rem,6vw,4.4rem)] [rgba(28,28,28,0.96)] dark:[rgba(243,239,230,0.96)]"
              leading="[0.95]"
              tracking="[-0.05em]"
              :style="{ fontFamily: 'var(--font-display)' }"
            >
              {{ activeModeOption?.label }}
            </h2>
            <p m-0 text="[rgba(28,28,28,0.62)] dark:[rgba(243,239,230,0.68)]">
              {{ activeModeOption?.description }}
            </p>
          </div>

          <div grid="~ cols-2 md:cols-4 gap-2">
            <button
              v-for="mode in modes"
              :key="mode.value"
              type="button"
              rounded="[18px]"
              border="1 [rgba(28,28,28,0.12)] dark:[rgba(243,239,230,0.14)]"
              p="3"
              text-left
              transition-all
              :style="getModeButtonStyle(mode.value)"
              @click="onModeChange(mode.value)"
            >
              <div flex="~ items-center gap-2">
                <div :class="mode.icon" />
                <span text-sm>{{ mode.label }}</span>
              </div>
            </button>
          </div>

          <div v-if="activeMode === 'number'" grid="~ cols-1 sm:cols-3 gap-4">
            <label flex="~ col gap-2">
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">最小值</span>
              <input
                v-model.number="numberConfig.min"
                class="input-shell"
                type="number"
                inputmode="numeric"
              />
            </label>
            <label flex="~ col gap-2">
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">最大值</span>
              <input
                v-model.number="numberConfig.max"
                class="input-shell"
                type="number"
                inputmode="numeric"
              />
            </label>
            <label flex="~ col gap-2">
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">数量</span>
              <input
                v-model.number="numberConfig.count"
                class="input-shell"
                type="number"
                min="1"
                inputmode="numeric"
              />
            </label>
          </div>

          <div v-else flex="~ col gap-4">
            <label flex="~ col gap-2">
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">
                {{ activeMode === 'custom' ? '可选项' : '追加可选项' }}
              </span>
              <textarea
                v-model="activeListConfig.rawItems"
                class="input-shell"
                rows="6"
                placeholder="一行一个，或用逗号分隔"
              />
            </label>
            <label flex="~ col gap-2" max-w-48>
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">数量</span>
              <input
                v-model.number="activeListConfig.count"
                class="input-shell"
                type="number"
                min="1"
                inputmode="numeric"
              />
            </label>
          </div>

          <div flex="~ wrap gap-3">
            <label v-if="activeMode === 'number'" ghost-button cursor-pointer>
              <input v-model="numberConfig.unique" type="checkbox" sr-only />
              <div
                :class="
                  numberConfig.unique
                    ? 'i-mdi-checkbox-marked-circle'
                    : 'i-mdi-checkbox-blank-circle-outline'
                "
              />
              唯一数字
            </label>
            <label v-if="activeMode === 'number'" ghost-button cursor-pointer>
              <input v-model="numberConfig.integer" type="checkbox" sr-only />
              <div
                :class="
                  numberConfig.integer
                    ? 'i-mdi-checkbox-marked-circle'
                    : 'i-mdi-checkbox-blank-circle-outline'
                "
              />
              整数
            </label>
            <label v-if="activeMode === 'number'" ghost-button cursor-pointer>
              <input v-model="numberConfig.sort" type="checkbox" sr-only />
              <div
                :class="
                  numberConfig.sort
                    ? 'i-mdi-checkbox-marked-circle'
                    : 'i-mdi-checkbox-blank-circle-outline'
                "
              />
              排序
            </label>
            <label v-if="activeMode !== 'number'" ghost-button cursor-pointer>
              <input v-model="activeListConfig.unique" type="checkbox" sr-only />
              <div
                :class="
                  activeListConfig.unique
                    ? 'i-mdi-checkbox-marked-circle'
                    : 'i-mdi-checkbox-blank-circle-outline'
                "
              />
              唯一结果
            </label>
          </div>

          <p v-if="errorMessage" m-0 text="sm [#b2503b] dark:[#e4a18d]">
            {{ errorMessage }}
          </p>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition-opacity duration-200 hover:opacity-90"
            style="background: #1c1c1c; color: #fcfbf8"
            @click="generate"
          >
            <div i-mdi-dice-multiple-outline />
            生成
          </button>
        </section>

        <section
          soft-panel
          bg="[linear-gradient(135deg,rgba(28,28,28,0.98),rgba(68,61,54,0.92))] dark:[linear-gradient(135deg,rgba(243,239,230,0.98),rgba(196,187,173,0.9))]"
          p="6 sm:8"
          flex="~ col justify-center gap-5"
          min-h="[320px]"
        >
          <p
            m-0
            text-sm
            tracking="[0.18em]"
            uppercase
            text="[rgba(252,251,248,0.68)] dark:[rgba(28,28,28,0.55)]"
          >
            生成结果
          </p>
          <p
            m-0
            text="[clamp(3.4rem,10vw,6.8rem)] [#fcfbf8] dark:[#161514]"
            leading-none
            tracking="[-0.08em]"
            break-words
            :style="{ fontFamily: 'var(--font-display)' }"
          >
            {{ resultTitle }}
          </p>
          <p m-0 text="[rgba(252,251,248,0.7)] dark:[rgba(28,28,28,0.58)]">
            {{ resultMeta }}
          </p>
        </section>
      </div>
    </section>
  </main>
</template>
