<script setup lang="ts">
defineProps<{
  label: string
}>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="inline-flex cursor-pointer select-none items-center gap-2.5 py-1.5">
    <input v-model="model" type="checkbox" class="peer sr-only" />
    <span
      class="flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      :class="model ? 'border-ink bg-ink' : 'border-line-strong bg-plate'"
      aria-hidden="true"
    >
      <span v-if="model" class="i-mdi-check text-[13px] text-page" />
    </span>
    <span class="text-[14px] text-ink">{{ label }}</span>
  </label>
</template>
