<script setup lang="ts">
import '@unocss/reset/tailwind.css'

interface HistoryEntry {
  value: number
  range: string
  time: string
}

const features = [
  {
    title: '克制但不冷淡',
    description: '暖纸感背景、紧凑标题与柔和边界，让工具页更像一本随手翻阅的口袋手册。',
  },
  {
    title: '输入即结果导向',
    description: '核心操作始终停留在首屏，所有状态反馈围绕区间、数量与结果展开。',
  },
  {
    title: '适合继续扩展',
    description: '视觉语言已经为“吃什么”和“看什么”预留了模块位，后续加功能不会重来一遍。',
  },
] as const

const scenarios = [
  {
    title: '抽数字',
    description: '课堂点名、抽奖顺序、练习题编号，输入区间后马上给出答案。',
  },
  {
    title: '做选择',
    description: '同一套页面结构可以平滑扩展到午餐、饮品或周末安排的随机选择。',
  },
  {
    title: '找灵感',
    description: '结果历史会保留下来，方便快速回看，避免“刚刚那个数是多少”这种重复操作。',
  },
] as const

const min = ref(1)
const max = ref(100)
const result = ref(0)
const hasGenerated = ref(false)
const errorMessage = ref('')
const history = ref<HistoryEntry[]>([])
const theme = ref<'light' | 'dark'>('light')

useHead({
  title: '随机生成器',
  htmlAttrs: {
    lang: 'zh-CN',
  },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;600;700&display=swap',
    },
  ],
})

const rangeSize = computed(() => max.value - min.value + 1)
const hasInvalidRange = computed(() => {
  return !Number.isFinite(min.value) || !Number.isFinite(max.value) || min.value > max.value
})
const resultLabel = computed(() => {
  return hasGenerated.value ? String(result.value) : '未生成'
})
const themeLabel = computed(() => {
  return theme.value === 'dark' ? '切换浅色' : '切换深色'
})

function syncTheme(nextTheme: 'light' | 'dark') {
  if (!import.meta.client) {
    return
  }

  document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  document.documentElement.style.colorScheme = nextTheme
  localStorage.setItem('random-generator-theme', nextTheme)
}

function generate() {
  if (hasInvalidRange.value) {
    errorMessage.value = '请输入有效区间，且最小值不能大于最大值。'
    return
  }

  errorMessage.value = ''
  result.value = Math.floor(Math.random() * rangeSize.value) + min.value
  hasGenerated.value = true

  history.value = [
    {
      value: result.value,
      range: `${min.value} - ${max.value}`,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    ...history.value,
  ].slice(0, 6)
}

function reset() {
  min.value = 1
  max.value = 100
  result.value = 0
  hasGenerated.value = false
  errorMessage.value = ''
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
</script>

<template>
  <main page-shell overflow-x-hidden :style="{ fontFamily: 'var(--font-body)' }">
    <div
      pointer-events-none
      fixed inset-0
      opacity-90
      style="background:
        radial-gradient(circle at top left, rgba(228, 160, 110, 0.18), transparent 34%),
        radial-gradient(circle at 82% 14%, rgba(111, 144, 181, 0.14), transparent 28%),
        radial-gradient(circle at 50% 100%, rgba(201, 120, 104, 0.12), transparent 32%);"
    />

    <header
      sticky top-0 z-20
      border-b="1 [rgba(28,28,28,0.06)] dark:[rgba(243,239,230,0.08)]"
      bg="[rgba(247,244,237,0.82)] dark:[rgba(22,21,20,0.8)]"
      backdrop-blur-md
    >
      <div section-frame h-18 flex="~ items-center justify-between gap-4">
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
          <div flex="~ col">
            <span eyebrow>Random Generator</span>
            <span text="sm [rgba(28,28,28,0.82)] dark:[rgba(243,239,230,0.82)]">随机生成器</span>
          </div>
        </div>

        <nav hidden md:flex items-center gap-6 text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.7)]">
          <a href="#generator" transition-colors hover:text="[rgba(28,28,28,1)] dark:hover:text-[#f3efe6]">生成器</a>
          <a href="#highlights" transition-colors hover:text="[rgba(28,28,28,1)] dark:hover:text-[#f3efe6]">亮点</a>
          <a href="#scenarios" transition-colors hover:text="[rgba(28,28,28,1)] dark:hover:text-[#f3efe6]">场景</a>
        </nav>

        <div flex="~ items-center gap-2">
          <button ghost-button type="button" @click="toggleTheme">
            <div :class="theme === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-moon-waning-crescent'" />
            <span hidden sm:inline>{{ themeLabel }}</span>
          </button>
          <a href="#generator" primary-button>
            立即生成
          </a>
        </div>
      </div>
    </header>

    <section section-frame relative z-1 pt-10 pb-16 md:pt-16 md:pb-24>
      <div grid="~ cols-1 lg:cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] gap-8 lg:gap-12" items-start>
        <div flex="~ col" gap-8>
          <div flex="~ col" gap-5 class="hero-rise">
            <span eyebrow>Warm editorial redesign</span>
            <h1
              m-0 max-w="[11ch]"
              text="[clamp(3.2rem,8vw,6.2rem)] [rgba(28,28,28,0.98)] dark:[rgba(243,239,230,0.98)]"
              leading="[0.92]"
              tracking="[-0.06em]"
              :style="{ fontFamily: 'var(--font-display)' }"
            >
              把随机生成器做成
              真正耐看的日常工具。
            </h1>
            <p
              m-0 max-w-2xl
              text="lg md:xl [rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]"
              leading-relaxed
            >
              这次重构不再是“一个输入框加一个按钮”。
              页面被重新组织成有节奏的单页体验，核心操作始终在首屏，视觉语言则遵循你提供的暖感、克制、编辑化方向。
            </p>
          </div>

          <div flex="~ wrap items-center gap-3" class="hero-rise hero-delay-1">
            <span
              rounded-full border="1 [#eceae4] dark:[#3a3833]"
              bg="[rgba(255,255,255,0.42)] dark:[rgba(255,255,255,0.04)]"
              px-4 py-2 text-sm text="[rgba(28,28,28,0.74)] dark:[rgba(243,239,230,0.72)]"
            >
              暖纸感底色
            </span>
            <span
              rounded-full border="1 [#eceae4] dark:[#3a3833]"
              bg="[rgba(255,255,255,0.42)] dark:[rgba(255,255,255,0.04)]"
              px-4 py-2 text-sm text="[rgba(28,28,28,0.74)] dark:[rgba(243,239,230,0.72)]"
            >
              结果历史保留
            </span>
            <span
              rounded-full border="1 [#eceae4] dark:[#3a3833]"
              bg="[rgba(255,255,255,0.42)] dark:[rgba(255,255,255,0.04)]"
              px-4 py-2 text-sm text="[rgba(28,28,28,0.74)] dark:[rgba(243,239,230,0.72)]"
            >
              支持暗色模式
            </span>
          </div>

          <div grid="~ cols-1 sm:cols-3 gap-4" class="hero-rise hero-delay-2">
            <article metric-card>
              <p eyebrow mb-3>
                当前范围
              </p>
              <p m-0 text-2xl text="[rgba(28,28,28,0.92)] dark:[rgba(243,239,230,0.94)]">
                {{ min }} - {{ max }}
              </p>
              <p m="3 0 0" text-sm text="[rgba(28,28,28,0.58)] dark:[rgba(243,239,230,0.62)]">
                输入合法时可立即生成
              </p>
            </article>
            <article metric-card>
              <p eyebrow mb-3>
                可选数量
              </p>
              <p m-0 text-2xl text="[rgba(28,28,28,0.92)] dark:[rgba(243,239,230,0.94)]">
                {{ hasInvalidRange ? '--' : rangeSize }}
              </p>
              <p m="3 0 0" text-sm text="[rgba(28,28,28,0.58)] dark:[rgba(243,239,230,0.62)]">
                自动根据区间实时更新
              </p>
            </article>
            <article metric-card>
              <p eyebrow mb-3>
                最近结果
              </p>
              <p m-0 text-2xl text="[rgba(28,28,28,0.92)] dark:[rgba(243,239,230,0.94)]">
                {{ history[0]?.value ?? '--' }}
              </p>
              <p m="3 0 0" text-sm text="[rgba(28,28,28,0.58)] dark:[rgba(243,239,230,0.62)]">
                {{ history[0]?.time ?? '还没有记录' }}
              </p>
            </article>
          </div>
        </div>

        <section
          id="generator"
          soft-panel relative overflow-hidden
          bg="[rgba(255,255,255,0.34)] dark:[rgba(255,255,255,0.03)]"
          p="5 sm:6"
          class="hero-rise hero-delay-1"
        >
          <div
            absolute inset-x-5 top-0 h-24
            bg="[radial-gradient(circle_at_top,rgba(201,120,104,0.18),transparent_70%)]"
            dark:bg="[radial-gradient(circle_at_top,rgba(196,171,139,0.16),transparent_70%)]"
          />

          <div relative flex="~ col" gap-6>
            <div flex="~ items-start justify-between gap-4">
              <div>
                <p eyebrow mb-3>
                  Generator Panel
                </p>
                <h2
                  m-0 text="[clamp(2rem,4vw,3rem)] [rgba(28,28,28,0.95)] dark:[rgba(243,239,230,0.95)]"
                  leading="[0.96]" tracking="[-0.05em]"
                  :style="{ fontFamily: 'var(--font-display)' }"
                >
                  首屏就是操作台
                </h2>
              </div>
              <div
                rounded-full border="1 [rgba(28,28,28,0.08)] dark:[rgba(243,239,230,0.12)]"
                bg="[rgba(255,255,255,0.52)] dark:[rgba(255,255,255,0.04)]"
                px-3 py-1.5 text-xs text="[rgba(28,28,28,0.6)] dark:[rgba(243,239,230,0.64)]"
              >
                即时校验
              </div>
            </div>

            <div grid="~ cols-1 sm:cols-2 gap-4">
              <label flex="~ col gap-2">
                <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">最小值</span>
                <input
                  v-model.number="min"
                  class="input-shell"
                  type="number"
                  inputmode="numeric"
                >
              </label>
              <label flex="~ col gap-2">
                <span text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">最大值</span>
                <input
                  v-model.number="max"
                  class="input-shell"
                  type="number"
                  inputmode="numeric"
                >
              </label>
            </div>

            <div
              rounded="[24px]"
              border="1 [#eceae4] dark:[#3a3833]"
              bg="[rgba(28,28,28,0.03)] dark:[rgba(243,239,230,0.04)]"
              p-5
              flex="~ col gap-3"
            >
              <div flex="~ items-center justify-between gap-4" text-sm>
                <span text="[rgba(28,28,28,0.56)] dark:[rgba(243,239,230,0.62)]">当前区间</span>
                <strong text="[rgba(28,28,28,0.88)] dark:[rgba(243,239,230,0.92)]">{{ min }} - {{ max }}</strong>
              </div>
              <div flex="~ items-center justify-between gap-4" text-sm>
                <span text="[rgba(28,28,28,0.56)] dark:[rgba(243,239,230,0.62)]">区间容量</span>
                <strong text="[rgba(28,28,28,0.88)] dark:[rgba(243,239,230,0.92)]">{{ hasInvalidRange ? '--' : rangeSize }}</strong>
              </div>
              <p
                v-if="errorMessage"
                m="1 0 0"
                text="sm [#b2503b] dark:[#e4a18d]"
              >
                {{ errorMessage }}
              </p>
            </div>

            <div flex="~ col sm:row gap-3">
              <button primary-button flex-1 type="button" @click="generate">
                <div i-mdi-dice-multiple-outline />
                生成结果
              </button>
              <button ghost-button flex-1 justify-center type="button" @click="reset">
                <div i-mdi-restore />
                重置范围
              </button>
            </div>

            <div
              rounded="[28px]"
              border="1 [rgba(28,28,28,0.08)] dark:[rgba(243,239,230,0.1)]"
              bg="[linear-gradient(135deg,rgba(28,28,28,0.98),rgba(68,61,54,0.92))] dark:[linear-gradient(135deg,rgba(243,239,230,0.98),rgba(196,187,173,0.9))]"
              p="6 sm:7"
              text-center
            >
              <p
                m-0 text-sm tracking="[0.18em]" uppercase
                text="[rgba(252,251,248,0.68)] dark:[rgba(28,28,28,0.55)]"
              >
                Current Result
              </p>
              <p
                m="3 0 0"
                text="[clamp(4rem,11vw,6.5rem)] [#fcfbf8] dark:[#161514]"
                leading-none tracking="[-0.08em]"
                :style="{ fontFamily: 'var(--font-display)' }"
              >
                {{ resultLabel }}
              </p>
            </div>

            <div flex="~ col gap-3">
              <div flex="~ items-center justify-between gap-4">
                <p eyebrow m-0>
                  Recent outputs
                </p>
                <span text-xs text="[rgba(28,28,28,0.52)] dark:[rgba(243,239,230,0.58)]">最多保留 6 条</span>
              </div>
              <div v-if="history.length" grid="~ cols-1 sm:cols-2 gap-3">
                <article
                  v-for="entry in history"
                  :key="`${entry.time}-${entry.value}`"
                  rounded="[20px]"
                  border="1 [#eceae4] dark:[#3a3833]"
                  bg="[rgba(255,255,255,0.4)] dark:[rgba(255,255,255,0.03)]"
                  p-4
                  flex="~ col gap-2"
                >
                  <div flex="~ items-center justify-between gap-3">
                    <span text-xs text="[rgba(28,28,28,0.52)] dark:[rgba(243,239,230,0.6)]">{{ entry.time }}</span>
                    <span text-xs text="[rgba(28,28,28,0.52)] dark:[rgba(243,239,230,0.6)]">范围 {{ entry.range }}</span>
                  </div>
                  <strong
                    text-2xl text="[rgba(28,28,28,0.92)] dark:[rgba(243,239,230,0.94)]"
                    :style="{ fontFamily: 'var(--font-display)' }"
                  >
                    {{ entry.value }}
                  </strong>
                </article>
              </div>
              <div
                v-else
                rounded="[20px]"
                border="1 [#eceae4] dark:[#3a3833]"
                bg="[rgba(255,255,255,0.34)] dark:[rgba(255,255,255,0.03)]"
                p-4 text-sm text="[rgba(28,28,28,0.56)] dark:[rgba(243,239,230,0.62)]"
              >
                先生成一次结果，历史记录会出现在这里。
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>

    <section id="highlights" section-frame relative z-1 py-14 md:py-20>
      <div flex="~ col gap-4" mb-10>
        <span eyebrow>Highlights</span>
        <h2
          m-0 max-w="[10ch]"
          text="[clamp(2.4rem,5vw,4rem)] [rgba(28,28,28,0.96)] dark:[rgba(243,239,230,0.96)]"
          leading="[0.95]" tracking="[-0.05em]"
          :style="{ fontFamily: 'var(--font-display)' }"
        >
          不靠花哨，也能有记忆点。
        </h2>
      </div>

      <div grid="~ cols-1 md:cols-3 gap-4">
        <article
          v-for="feature in features"
          :key="feature.title"
          soft-panel
          bg="[rgba(255,255,255,0.26)] dark:[rgba(255,255,255,0.03)]"
          p="5 sm:6"
          flex="~ col gap-4"
        >
          <div
            h-12 w-12 rounded-full
            border="1 [rgba(28,28,28,0.08)] dark:[rgba(243,239,230,0.12)]"
            bg="[rgba(255,255,255,0.48)] dark:[rgba(255,255,255,0.04)]"
            flex="~ items-center justify-center"
            text-xl
          >
            <div i-mdi-circle-medium />
          </div>
          <h3
            m-0 text-2xl leading-tight tracking="[-0.04em]"
            :style="{ fontFamily: 'var(--font-display)' }"
          >
            {{ feature.title }}
          </h3>
          <p
            m-0 text-base leading-relaxed
            text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]"
          >
            {{ feature.description }}
          </p>
        </article>
      </div>
    </section>

    <section id="scenarios" section-frame relative z-1 py-14 md:py-20>
      <div
        soft-panel
        bg="[rgba(255,255,255,0.28)] dark:[rgba(255,255,255,0.03)]"
        p="6 sm:8"
      >
        <div grid="~ cols-1 lg:cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-8 lg:gap-12">
          <div flex="~ col gap-4">
            <span eyebrow>Scenarios</span>
            <h2
              m-0 max-w="[8ch]"
              text="[clamp(2.4rem,5vw,4rem)] [rgba(28,28,28,0.96)] dark:[rgba(243,239,230,0.96)]"
              leading="[0.95]" tracking="[-0.05em]"
              :style="{ fontFamily: 'var(--font-display)' }"
            >
              一个界面，容纳多种随机需求。
            </h2>
            <p
              m-0 text="base md:lg [rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]"
              leading-relaxed
            >
              当前已完成的是数字生成器，但页面结构已经改造成可扩展的产品首页。
              未来如果加入“今天吃什么”或“电影推荐”，视觉与信息架构都可以直接复用。
            </p>
          </div>

          <div grid="~ cols-1 md:cols-3 gap-4" items-stretch>
            <article
              v-for="scenario in scenarios"
              :key="scenario.title"
              rounded="[24px]"
              border="1 [#eceae4] dark:[#3a3833]"
              bg="[rgba(28,28,28,0.03)] dark:[rgba(243,239,230,0.04)]"
              p="5"
              flex="~ col justify-between gap-6"
            >
              <div flex="~ col gap-3">
                <div text-xs uppercase tracking="[0.24em]" text="[rgba(28,28,28,0.45)] dark:[rgba(243,239,230,0.5)]">
                  Use case
                </div>
                <h3
                  m-0 text-2xl leading-tight tracking="[-0.04em]"
                  :style="{ fontFamily: 'var(--font-display)' }"
                >
                  {{ scenario.title }}
                </h3>
                <p m-0 text-sm leading-relaxed text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">
                  {{ scenario.description }}
                </p>
              </div>
              <div
                rounded-full border="1 [rgba(28,28,28,0.1)] dark:[rgba(243,239,230,0.12)]"
                px-3 py-1.5 w-max
                text-xs text="[rgba(28,28,28,0.58)] dark:[rgba(243,239,230,0.62)]"
              >
                Ready for expansion
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <footer section-frame relative z-1 pt-8 pb-10 md:pt-12 md:pb-14>
      <div
        rounded="[28px]"
        border="1 [#eceae4] dark:[#3a3833]"
        bg="[rgba(255,255,255,0.22)] dark:[rgba(255,255,255,0.03)]"
        p="5 sm:6"
        flex="~ col md:row items-start md:items-center justify-between gap-5"
      >
        <div>
          <p eyebrow mb-3>
            Random Generator
          </p>
          <p m-0 text-sm text="[rgba(28,28,28,0.68)] dark:[rgba(243,239,230,0.72)]">
            以日常工具的效率为核心，用更完整的界面把体验重新组织起来。
          </p>
        </div>
        <div flex="~ items-center gap-3">
          <a href="#generator" ghost-button>回到生成器</a>
          <button ghost-button type="button" @click="toggleTheme">
            <div i-mdi-theme-light-dark />
            {{ theme === 'dark' ? '暗色已开启' : '浅色已开启' }}
          </button>
        </div>
      </div>
    </footer>
  </main>
</template>

<style>
@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-rise {
  animation: hero-rise 700ms cubic-bezier(0.19, 1, 0.22, 1) both;
}

.hero-delay-1 {
  animation-delay: 120ms;
}

.hero-delay-2 {
  animation-delay: 220ms;
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise,
  .hero-delay-1,
  .hero-delay-2 {
    animation: none;
  }
}
</style>
