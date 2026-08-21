<script setup lang="ts">
import type { ThemeMode } from '~/types/generator'

defineProps<{
  theme: ThemeMode
}>()

const emit = defineEmits<{
  toggleTheme: []
}>()
</script>

<template>
  <header class="flex items-center justify-between gap-4 border-b border-line pb-6">
    <div class="flex items-center gap-3">
      <span
        class="flex h-10 w-10 items-center justify-center border border-ink bg-ink text-page"
        aria-hidden="true"
      >
        <span class="i-mdi-shuffle-variant text-lg" />
      </span>
      <div>
        <p class="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">随机工具</p>
        <h1 class="m-0 text-xl font-bold tracking-tight text-ink">随机生成器</h1>
      </div>
    </div>

    <button
      type="button"
      class="btn-ghost cursor-pointer"
      aria-label="切换主题"
      @click="emit('toggleTheme')"
    >
      <span
        :class="theme === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-moon-waning-crescent'"
        aria-hidden="true"
      />
      <span class="hidden sm:inline">{{ theme === 'dark' ? '切换浅色' : '切换深色' }}</span>
    </button>
  </header>
</template>
