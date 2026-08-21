<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="inline-flex cursor-pointer select-none items-center gap-2.5">
    <input v-model="model" type="checkbox" class="sr-only" />
    <span
      class="relative h-6 w-11 shrink-0 border transition-colors duration-200"
      :class="model ? 'border-accent bg-accent' : 'border-line-strong bg-page'"
      aria-hidden="true"
    >
      <span
        class="absolute top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-200"
        :class="model ? 'left-[calc(100%-1.25rem)] bg-page' : 'left-1 bg-ink'"
      />
    </span>
    <span class="text-sm text-ink"><slot /></span>
  </label>
</template>
