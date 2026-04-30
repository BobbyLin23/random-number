# Random Things Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the app into a minimal number-first random things generator with secondary custom, food, and movie modes.

**Architecture:** Move generator types, presets, and pure generation logic out of `app/app.vue`. Keep the Nuxt page as the composition layer for mode state, validation messages, theme handling, and the single-screen UI. The app should have no recent history, no marketing sections, and no extra below-the-tool content.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup lang="ts">`, TypeScript, UnoCSS attributify utilities, Iconify via UnoCSS preset icons.

---

## File Structure

- Create `app/types/generator.ts`: mode names, config interfaces, and result types.
- Create `app/data/generatorPresets.ts`: built-in food and movie option lists.
- Create `app/composables/useRandomGenerator.ts`: pure parsing, validation, and random selection helpers.
- Modify `app/app.vue`: replace the current landing-style page with the approved single-screen generator UI.
- Keep `uno.config.ts` unchanged unless lint or UI implementation exposes a missing shortcut.

## Task 1: Add Generator Types

**Files:**

- Create: `app/types/generator.ts`

- [ ] **Step 1: Create typed generator contracts**

Create `app/types/generator.ts` with:

```ts
export type GeneratorMode = 'number' | 'custom' | 'food' | 'movie'

export interface ModeOption {
  value: GeneratorMode
  label: string
  description: string
  icon: string
}

export interface NumberConfig {
  min: number
  max: number
  count: number
  unique: boolean
  integer: boolean
  sort: boolean
}

export interface ListConfig {
  rawItems: string
  count: number
  unique: boolean
}

export interface GeneratorResult {
  mode: GeneratorMode
  values: Array<number | string>
  meta: string
}

export interface ValidationResult {
  valid: boolean
  message: string
}
```

- [ ] **Step 2: Verify TypeScript import path**

Run: `corepack pnpm exec vue-tsc --noEmit`

Expected: The command may fail if `vue-tsc` is not installed. If it is unavailable, skip to `pnpm lint` in the final verification task because this repo does not define a typecheck script.

## Task 2: Add Preset Data

**Files:**

- Create: `app/data/generatorPresets.ts`

- [ ] **Step 1: Add preset option lists**

Create `app/data/generatorPresets.ts` with:

```ts
export const foodPresets = [
  '火锅',
  '寿司',
  '拉面',
  '饺子',
  '披萨',
  '沙拉',
  '牛肉饭',
  '麻辣烫',
  '汉堡',
  '咖喱饭',
] as const

export const moviePresets = [
  '科幻片',
  '喜剧片',
  '悬疑片',
  '纪录片',
  '动画电影',
  '经典老片',
  '院线新片',
  '动作片',
  '爱情片',
  '治愈系电影',
] as const
```

- [ ] **Step 2: Keep data framework-independent**

Confirm the file exports plain constants only. Do not import Vue, Nuxt, or browser APIs here.

## Task 3: Add Generator Logic

**Files:**

- Create: `app/composables/useRandomGenerator.ts`
- Uses: `app/types/generator.ts`

- [ ] **Step 1: Implement parsing and helpers**

Create `app/composables/useRandomGenerator.ts` with:

```ts
import type {
  GeneratorMode,
  GeneratorResult,
  ListConfig,
  NumberConfig,
  ValidationResult,
} from '~/types/generator'

export function parseListItems(rawItems: string): string[] {
  return rawItems
    .split(/[\n,，]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function pickIndexes(total: number, count: number, unique: boolean): number[] {
  if (!unique) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * total))
  }

  const indexes = Array.from({ length: total }, (_, index) => index)

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]]
  }

  return indexes.slice(0, count)
}

export function validateNumberConfig(config: NumberConfig): ValidationResult {
  if (!Number.isFinite(config.min) || !Number.isFinite(config.max)) {
    return { valid: false, message: '请输入有效的数字范围。' }
  }

  if (config.min > config.max) {
    return { valid: false, message: '最小值不能大于最大值。' }
  }

  if (!Number.isFinite(config.count) || config.count < 1) {
    return { valid: false, message: '生成数量至少为 1。' }
  }

  const rangeSize = Math.floor(config.max) - Math.ceil(config.min) + 1

  if (config.integer && config.unique && config.count > rangeSize) {
    return { valid: false, message: '唯一模式下，数量不能超过可选范围。' }
  }

  return { valid: true, message: '' }
}

export function validateListConfig(config: ListConfig, items: string[]): ValidationResult {
  if (items.length === 0) {
    return { valid: false, message: '请至少输入一个可选项。' }
  }

  if (!Number.isFinite(config.count) || config.count < 1) {
    return { valid: false, message: '生成数量至少为 1。' }
  }

  if (config.unique && config.count > items.length) {
    return { valid: false, message: '唯一模式下，数量不能超过可选项数量。' }
  }

  return { valid: true, message: '' }
}

export function generateNumbers(config: NumberConfig): GeneratorResult {
  const validation = validateNumberConfig(config)

  if (!validation.valid) {
    throw new Error(validation.message)
  }

  const min = config.integer ? Math.ceil(config.min) : config.min
  const max = config.integer ? Math.floor(config.max) : config.max
  let values: number[]

  if (config.integer) {
    if (config.unique) {
      values = pickIndexes(max - min + 1, config.count, true).map(index => min + index)
    }
    else {
      values = Array.from({ length: config.count }, () => {
        return Math.floor(Math.random() * (max - min + 1)) + min
      })
    }
  }
  else {
    values = Array.from({ length: config.count }, () => {
      return Number((Math.random() * (max - min) + min).toFixed(2))
    })
  }

  if (config.sort) {
    values = [...values].sort((left, right) => left - right)
  }

  return {
    mode: 'number',
    values,
    meta: `${config.min} - ${config.max}`,
  }
}

export function generateListResult(
  mode: Exclude<GeneratorMode, 'number'>,
  config: ListConfig,
  presetItems: readonly string[] = [],
): GeneratorResult {
  const items = [...presetItems, ...parseListItems(config.rawItems)]
  const validation = validateListConfig(config, items)

  if (!validation.valid) {
    throw new Error(validation.message)
  }

  return {
    mode,
    values: pickIndexes(items.length, config.count, config.unique).map(index => items[index]),
    meta: `${items.length} 个可选项`,
  }
}
```

- [ ] **Step 2: Fix lint issues if needed**

Run: `pnpm lint`

Expected: If Antfu flags the array swap semicolon pattern, replace the swap with temporary variable assignments:

```ts
const currentIndex = indexes[index]
indexes[index] = indexes[swapIndex]
indexes[swapIndex] = currentIndex
```

## Task 4: Replace App UI and State

**Files:**

- Modify: `app/app.vue`
- Uses: `app/composables/useRandomGenerator.ts`
- Uses: `app/data/generatorPresets.ts`
- Uses: `app/types/generator.ts`

- [ ] **Step 1: Replace script with number-first state**

Replace the current `<script setup lang="ts">` content with:

```ts
import '@unocss/reset/tailwind.css'

import type { GeneratorMode, GeneratorResult, ListConfig, ModeOption, NumberConfig } from '~/types/generator'
import { foodPresets, moviePresets } from '~/data/generatorPresets'

const modes: ModeOption[] = [
  { value: 'number', label: '随机数字', description: '范围、数量、唯一值', icon: 'i-mdi-numeric' },
  { value: 'custom', label: '自定义', description: '从你的清单抽取', icon: 'i-mdi-format-list-bulleted' },
  { value: 'food', label: '吃什么', description: '内置餐食灵感', icon: 'i-mdi-food-outline' },
  { value: 'movie', label: '看什么', description: '内置电影类型', icon: 'i-mdi-movie-open-outline' },
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

const listConfig = reactive<ListConfig>({
  rawItems: '散步\n整理桌面\n读 20 分钟书\n做一杯咖啡',
  count: 1,
  unique: true,
})

const activeModeOption = computed(() => modes.find(mode => mode.value === activeMode.value) ?? modes[0])
const resultTitle = computed(() => result.value?.values.join('、') ?? '点击生成')
const resultMeta = computed(() => result.value?.meta ?? '随机数字优先，其它模式随时切换')
const themeLabel = computed(() => theme.value === 'dark' ? '切换浅色' : '切换深色')

const modePresetItems = computed(() => {
  if (activeMode.value === 'food') {
    return foodPresets
  }

  if (activeMode.value === 'movie') {
    return moviePresets
  }

  return []
})

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
    result.value = activeMode.value === 'number'
      ? generateNumbers(numberConfig)
      : generateListResult(activeMode.value, listConfig, modePresetItems.value)
  }
  catch (error) {
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
```

- [ ] **Step 2: Replace template with a minimal single-screen workspace**

Replace the current `<template>` content with:

```vue
<template>
  <main page-shell min-h-screen overflow-x-hidden :style="{ fontFamily: 'var(--font-body)' }">
    <section section-frame min-h-screen flex="~ col" py-6 md:py-8>
      <header flex="~ items-center justify-between gap-4" pb-6>
        <div flex="~ items-center gap-3">
          <div
            h-11 w-11 rounded-full
            border="1 [rgba(28,28,28,0.08)] dark:[rgba(243,239,230,0.12)]"
            bg="[rgba(255,255,255,0.45)] dark:[rgba(255,255,255,0.04)]"
            flex="~ items-center justify-center"
            text-lg
          >
            <div i-mdi-shuffle-variant />
          </div>
          <div>
            <p eyebrow m-0>Random Generator</p>
            <h1 m-0 text="xl [rgba(28,28,28,0.92)] dark:[rgba(243,239,230,0.94)]">
              随机生成器
            </h1>
          </div>
        </div>

        <button ghost-button type="button" @click="toggleTheme">
          <div :class="theme === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-moon-waning-crescent'" />
          <span hidden sm:inline>{{ themeLabel }}</span>
        </button>
      </header>

      <div grid="~ cols-1 lg:cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] gap-5 lg:gap-7" flex-1 items-stretch>
        <section soft-panel bg="[rgba(255,255,255,0.34)] dark:[rgba(255,255,255,0.03)]" p="5 sm:6" flex="~ col gap-5">
          <div flex="~ col gap-2">
            <p eyebrow m-0>Mode</p>
            <h2
              m-0
              text="[clamp(2.2rem,6vw,4.4rem)] [rgba(28,28,28,0.96)] dark:[rgba(243,239,230,0.96)]"
              leading="[0.95]" tracking="[-0.05em]"
              :style="{ fontFamily: 'var(--font-display)' }"
            >
              {{ activeModeOption.label }}
            </h2>
            <p m-0 text="[rgba(28,28,28,0.62)] dark:[rgba(243,239,230,0.68)]">
              {{ activeModeOption.description }}
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
              :bg="activeMode === mode.value ? '[#1c1c1c] dark:[#f3efe6]' : '[rgba(255,255,255,0.42)] dark:[rgba(255,255,255,0.03)]'"
              :text="activeMode === mode.value ? '[#fcfbf8] dark:[#161514]' : '[#1c1c1c] dark:[#f3efe6]'"
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
              <input v-model.number="numberConfig.min" class="input-shell" type="number" inputmode="numeric">
            </label>
            <label flex="~ col gap-2">
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">最大值</span>
              <input v-model.number="numberConfig.max" class="input-shell" type="number" inputmode="numeric">
            </label>
            <label flex="~ col gap-2">
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">数量</span>
              <input v-model.number="numberConfig.count" class="input-shell" type="number" min="1" inputmode="numeric">
            </label>
          </div>

          <div v-else flex="~ col gap-4">
            <label flex="~ col gap-2">
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">
                {{ activeMode === 'custom' ? '可选项' : '追加可选项' }}
              </span>
              <textarea
                v-model="listConfig.rawItems"
                class="input-shell"
                rows="6"
                placeholder="一行一个，或用逗号分隔"
              />
            </label>
            <label flex="~ col gap-2" max-w-48>
              <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">数量</span>
              <input v-model.number="listConfig.count" class="input-shell" type="number" min="1" inputmode="numeric">
            </label>
          </div>

          <div flex="~ wrap gap-3">
            <label v-if="activeMode === 'number'" ghost-button cursor-pointer>
              <input v-model="numberConfig.unique" type="checkbox" sr-only>
              <div :class="numberConfig.unique ? 'i-mdi-checkbox-marked-circle' : 'i-mdi-checkbox-blank-circle-outline'" />
              唯一数字
            </label>
            <label v-if="activeMode === 'number'" ghost-button cursor-pointer>
              <input v-model="numberConfig.integer" type="checkbox" sr-only>
              <div :class="numberConfig.integer ? 'i-mdi-checkbox-marked-circle' : 'i-mdi-checkbox-blank-circle-outline'" />
              整数
            </label>
            <label v-if="activeMode === 'number'" ghost-button cursor-pointer>
              <input v-model="numberConfig.sort" type="checkbox" sr-only>
              <div :class="numberConfig.sort ? 'i-mdi-checkbox-marked-circle' : 'i-mdi-checkbox-blank-circle-outline'" />
              排序
            </label>
            <label v-if="activeMode !== 'number'" ghost-button cursor-pointer>
              <input v-model="listConfig.unique" type="checkbox" sr-only>
              <div :class="listConfig.unique ? 'i-mdi-checkbox-marked-circle' : 'i-mdi-checkbox-blank-circle-outline'" />
              唯一结果
            </label>
          </div>

          <p v-if="errorMessage" m-0 text="sm [#b2503b] dark:[#e4a18d]">
            {{ errorMessage }}
          </p>

          <button primary-button mt-auto type="button" @click="generate">
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
          <p m-0 text-sm tracking="[0.18em]" uppercase text="[rgba(252,251,248,0.68)] dark:[rgba(28,28,28,0.55)]">
            Result
          </p>
          <p
            m-0
            text="[clamp(3.4rem,10vw,6.8rem)] [#fcfbf8] dark:[#161514]"
            leading-none tracking="[-0.08em]"
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
```

- [ ] **Step 3: Remove obsolete style block**

Delete the current `hero-rise` animation `<style>` block from `app/app.vue`. The approved design does not need homepage reveal animation.

## Task 5: Verify and Polish

**Files:**

- Modify if needed: `app/app.vue`
- Modify if needed: `app/composables/useRandomGenerator.ts`

- [ ] **Step 1: Run lint**

Run: `pnpm lint`

Expected: PASS.

- [ ] **Step 2: Fix lint errors directly**

If lint fails, adjust the reported files without changing feature scope. Common expected fixes:

```ts
// Prefer this if lint dislikes inline array swap syntax.
const currentIndex = indexes[index]
indexes[index] = indexes[swapIndex]
indexes[swapIndex] = currentIndex
```

```vue
<!-- Keep long Vue attributes on separate lines when Antfu reports max-len or formatting issues. -->
<input
  v-model.number="numberConfig.count"
  class="input-shell"
  type="number"
  min="1"
  inputmode="numeric"
>
```

- [ ] **Step 3: Run production build**

Run: `pnpm build`

Expected: Nuxt production build completes without TypeScript or Vue template errors.

- [ ] **Step 4: Start dev server**

Run: `corepack pnpm dev`

Expected: Nuxt prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 5: Manual browser checks**

Open the local URL and verify:

- Random Number is selected by default.
- Number mode can generate one or multiple values.
- Unique mode rejects counts larger than the integer range.
- Custom mode accepts newline and comma-separated items.
- Food and Movie modes generate from built-in presets.
- There is no recent history section.
- There are no highlights, scenarios, or marketing sections below the tool.
- On mobile width, tabs wrap cleanly and result text stays readable.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git add app/app.vue app/composables/useRandomGenerator.ts app/data/generatorPresets.ts app/types/generator.ts
git commit -m "feat: refactor random things generator"
```
