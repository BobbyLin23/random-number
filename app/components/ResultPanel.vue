<script setup lang="ts">
import type { GeneratorResult } from '~/types/generator'

const props = defineProps<{
  result: GeneratorResult | null
  rollingValues: Array<number | string> | null
  serial: number
  ctaLabel: string
  modeLabel: string
  question: string
  error: string
}>()

const emit = defineEmits<{
  draw: []
}>()

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const hasResult = computed(() => props.result !== null)
const rolling = computed(() => props.rollingValues !== null)
const displayValues = computed(() => props.rollingValues ?? props.result?.values ?? [])

const announcement = computed(() => {
  if (rolling.value || !props.result) {
    return ''
  }

  return `抽到：${props.result.values.join('、')}`
})

function widthOf(value: string): number {
  return Array.from(value).reduce((total, char) => {
    return total + (/[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/.test(char) ? 1 : 0.56)
  }, 0)
}

const sizeFactor = computed(() => {
  const values = props.result?.values ?? []
  const widths = values.map(value => widthOf(String(value)))
  const units = widths.reduce((sum, width) => sum + width, 0) + (values.length - 1) * 0.5
  const factor = units > 0 ? 92 / units : 12

  return String(Math.min(factor, 30))
})

async function copyResult() {
  if (!props.result) {
    return
  }

  try {
    await navigator.clipboard.writeText(props.result.values.join('、'))
    copied.value = true
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    copied.value = false
  }
}

onUnmounted(() => {
  if (copyTimer) {
    clearTimeout(copyTimer)
  }
})
</script>

<template>
  <section class="on-field flex min-h-[460px] flex-col sm:min-h-[540px]">
    <div class="flex flex-1 flex-col bg-field text-field-ink">
      <div
        class="flex items-center justify-between gap-4 border-b border-field-line px-5 py-3.5 sm:px-7"
      >
        <span class="text-[12px] leading-none text-field-muted">{{ modeLabel }}</span>
        <span v-if="serial > 0 && hasResult" class="tnum text-[12px] leading-none text-field-muted">
          第 {{ serial }} 次抽取
        </span>
      </div>

      <p class="sr-only" aria-live="polite">{{ announcement }}</p>

      <div class="flex flex-1 flex-col justify-center px-5 py-8 sm:px-7 sm:py-10">
        <template v-if="hasResult">
          <div
            class="display-values flex flex-wrap items-baseline gap-y-2 transition-opacity duration-150"
            :class="rolling ? 'blur-[1px] opacity-60' : ''"
            :style="{ '--size-factor': sizeFactor }"
          >
            <span
              v-for="(value, index) in displayValues"
              :key="`${serial}-${index}`"
              class="display-value font-serif"
              :style="{ animationDelay: `${60 + index * 45}ms` }"
            >
              {{ value }}
            </span>
          </div>

          <p class="m-0 mt-6 text-[13px] leading-5 text-field-muted">{{ result?.meta }}</p>
        </template>

        <template v-else>
          <p
            class="m-0 font-serif text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.14] tracking-tight text-field-ink"
          >
            {{ question }}
          </p>
          <p class="m-0 mt-4 text-[13px] leading-5 text-field-muted">
            按下「{{ ctaLabel }}」，让概率决定。
          </p>
        </template>
      </div>

      <p
        v-if="error"
        role="alert"
        class="m-0 border-l-2 border-field-danger px-5 pb-5 text-[13px] leading-5 text-field-danger sm:px-7"
      >
        {{ error }}
      </p>
    </div>

    <div class="on-stub flex items-stretch bg-stub text-stub-ink">
      <button
        type="button"
        class="flex h-16 flex-1 cursor-pointer items-center justify-center gap-2 px-4 text-[15px] font-semibold tracking-wide transition-colors duration-150 hover:bg-stub-hover"
        @click="emit('draw')"
      >
        {{ ctaLabel }}
      </button>
      <button
        v-if="hasResult"
        type="button"
        class="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center border-l border-stub-line transition-colors duration-150 hover:bg-stub-hover"
        :class="copied ? 'bg-accent text-field-ink' : ''"
        :aria-label="copied ? '已经复制结果' : '复制结果'"
        @click="copyResult"
      >
        <span
          :class="copied ? 'i-mdi-check' : 'i-mdi-content-copy'"
          class="text-[17px]"
          aria-hidden="true"
        />
      </button>
    </div>
  </section>
</template>

<style scoped>
.display-values {
  container-type: inline-size;
}

.display-value:not(:last-child) {
  margin-right: 0.5em;
}

.display-value {
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  font-size: clamp(1.5rem, calc(var(--size-factor) * 1cqw), 9.5rem);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.02em;
  animation: lock-in 420ms cubic-bezier(0.22, 0.8, 0.24, 1) both;
}

@keyframes lock-in {
  from {
    opacity: 0;
    transform: translateY(0.16em);
    filter: blur(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
</style>
