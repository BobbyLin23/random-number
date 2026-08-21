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
  <nav aria-label="生成模式" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
    <button
      v-for="mode in modes"
      :key="mode.value"
      type="button"
      class="flex cursor-pointer items-center justify-center gap-2 border px-3 py-3 text-sm font-medium transition-colors duration-200"
      :class="activeMode === mode.value ? 'tab-active' : 'tab-inactive'"
      :aria-pressed="activeMode === mode.value"
      @click="emit('select', mode.value)"
    >
      <span :class="mode.icon" class="text-base" aria-hidden="true" />
      {{ mode.label }}
    </button>
  </nav>
</template>
