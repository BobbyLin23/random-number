<script setup lang="ts">
import type { NumberConfig } from '~/types/generator'

const config = defineModel<NumberConfig>({ required: true })

const rangeInvalid = computed(() => {
  const { min, max } = config.value

  return !Number.isFinite(min) || !Number.isFinite(max) || min > max
})

const rangeHint = computed(() => {
  const { min, max, integer } = config.value

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return '请输入最小值和最大值'
  }

  if (min > max) {
    return '最小值不能大于最大值'
  }

  if (!integer) {
    return `可含小数，范围 ${min} 到 ${max}`
  }

  const size = Math.floor(max) - Math.ceil(min) + 1

  return `共 ${size.toLocaleString('zh-CN')} 个整数可选`
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <span class="field-label">范围</span>
      <div class="mt-2 flex items-center gap-2">
        <input
          v-model.number="config.min"
          class="input tnum px-2 text-center"
          type="number"
          inputmode="numeric"
          aria-label="最小值"
        />
        <span class="text-[13px] text-faint">至</span>
        <input
          v-model.number="config.max"
          class="input tnum px-2 text-center"
          type="number"
          inputmode="numeric"
          aria-label="最大值"
        />
      </div>
      <p
        class="m-0 mt-2 text-[12px] leading-5"
        :class="rangeInvalid ? 'text-danger' : 'text-faint'"
      >
        {{ rangeHint }}
      </p>
    </div>

    <div class="border-t border-line pt-5">
      <span class="field-label">抽几个</span>
      <div class="mt-2.5">
        <CountStepper v-model="config.count" label="抽取数量" />
      </div>
    </div>

    <div class="border-t border-line pt-5">
      <span class="field-label">选项</span>
      <div class="mt-1.5 flex flex-col">
        <CheckOption v-model="config.unique" label="不重复" />
        <CheckOption v-model="config.integer" label="只取整数" />
        <CheckOption v-model="config.sort" label="升序排列" />
      </div>
    </div>
  </div>
</template>
