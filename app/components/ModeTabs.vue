<script setup lang="ts">
import type { GeneratorMode, ModeOption } from '~/types/generator'

defineProps<{
  modes: ModeOption[]
  activeMode: GeneratorMode
}>()

const emit = defineEmits<{
  select: [mode: GeneratorMode]
}>()
</script>

<template>
  <nav
    aria-label="生成模式"
    class="grid grid-cols-2 gap-px border border-ink bg-ink sm:grid-cols-5"
  >
    <button
      v-for="mode in modes"
      :key="mode.value"
      type="button"
      class="flex h-[52px] cursor-pointer items-center px-4 text-[14px] font-medium transition-colors duration-150 sm:h-14 last:col-span-2 sm:last:col-span-1"
      :class="
        activeMode === mode.value ? 'bg-accent text-field-ink' : 'bg-page text-ink hover:bg-plate'
      "
      :aria-pressed="activeMode === mode.value"
      @click="emit('select', mode.value)"
    >
      {{ mode.label }}
    </button>
  </nav>
</template>

<style scoped>
nav button:focus-visible {
  outline-offset: -3px;
}
</style>
