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
  <header class="flex items-center justify-between gap-6 py-5 sm:py-6">
    <div class="flex items-center gap-3">
      <svg
        class="h-6 w-6 shrink-0 text-accent"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="24" height="24" fill="currentColor" />
        <g fill="var(--color-field-ink)">
          <circle cx="7" cy="7" r="1.7" />
          <circle cx="17" cy="7" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="7" cy="17" r="1.7" />
          <circle cx="17" cy="17" r="1.7" />
        </g>
      </svg>
      <div>
        <h1 class="m-0 font-serif text-[21px] font-bold leading-none tracking-tight text-ink">
          随机生成器
        </h1>
        <p class="m-0 mt-1.5 text-[12px] leading-none text-muted">决定不了的时候，抽一个。</p>
      </div>
    </div>

    <button
      type="button"
      class="btn-quiet h-10 w-10 shrink-0 px-0 sm:h-9 sm:w-auto sm:px-3"
      :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
      @click="emit('toggleTheme')"
    >
      <span
        :class="theme === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-moon-waning-crescent'"
        class="text-[15px]"
        aria-hidden="true"
      />
      <span class="hidden sm:inline">{{ theme === 'dark' ? '切换浅色' : '切换深色' }}</span>
    </button>
  </header>
</template>
