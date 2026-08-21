<script setup lang="ts">
import type { GeneratorResult } from '~/types/generator'

const props = defineProps<{
  result: GeneratorResult | null
}>()

const emit = defineEmits<{
  generate: []
}>()

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const resultValues = computed(() => props.result?.values.join('、') ?? '—')
const resultMeta = computed(() => props.result?.meta ?? '选择一个模式，点击生成开始随机')
const hasResult = computed(() => props.result !== null)

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
  <aside
    class="flex flex-col justify-between gap-8 border border-inverted-page bg-inverted-page p-6 text-inverted-ink sm:p-8"
  >
    <div>
      <p class="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-inverted-muted">
        生成结果
      </p>

      <Transition name="result-pop" mode="out-in">
        <p
          :key="hasResult ? props.result?.values.join('|') : 'empty'"
          class="m-0 mt-4 wrap-break-word text-[clamp(3rem,10vw,5.5rem)] font-bold leading-none tracking-tight text-inverted-ink"
        >
          {{ resultValues }}
        </p>
      </Transition>

      <p class="m-0 mt-4 text-sm text-inverted-muted">{{ resultMeta }}</p>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        class="inline-flex cursor-pointer appearance-none items-center justify-center gap-2 border bg-transparent px-6 py-3 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
        :class="
          hasResult
            ? 'border-inverted-ink bg-inverted-ink text-inverted-muted hover:border-accent hover:bg-accent'
            : 'border-inverted-muted text-inverted-muted'
        "
        :disabled="!hasResult"
        @click="emit('generate')"
      >
        <span class="i-mdi-dice-multiple-outline" aria-hidden="true" />
        再来一次
      </button>
      <button
        type="button"
        class="inline-flex cursor-pointer appearance-none items-center justify-center gap-2 border bg-transparent px-4 py-3 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed"
        :class="
          hasResult
            ? 'border-inverted-muted text-inverted-ink hover:border-inverted-ink'
            : 'border-inverted-muted text-inverted-muted'
        "
        :disabled="!hasResult"
        @click="copyResult"
      >
        <span :class="copied ? 'i-mdi-check' : 'i-mdi-content-copy'" aria-hidden="true" />
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.result-pop-enter-active,
.result-pop-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.result-pop-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.result-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
