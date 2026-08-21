<script setup lang="ts">
import type { NumberConfig } from '~/types/generator'

const config = defineModel<NumberConfig>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <label class="block">
      <span class="field-label">最小值</span>
      <input v-model.number="config.min" class="input mt-2" type="number" inputmode="numeric" />
    </label>
    <label class="block">
      <span class="field-label">最大值</span>
      <input v-model.number="config.max" class="input mt-2" type="number" inputmode="numeric" />
    </label>
    <label class="block">
      <span class="field-label">数量</span>
      <input
        v-model.number="config.count"
        class="input mt-2"
        type="number"
        min="1"
        inputmode="numeric"
      />
    </label>
  </div>

  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <ToggleSwitch v-model="config.unique">唯一数字</ToggleSwitch>
    <ToggleSwitch v-model="config.integer">整数</ToggleSwitch>
    <ToggleSwitch v-model="config.sort">排序</ToggleSwitch>
  </div>
</template>
