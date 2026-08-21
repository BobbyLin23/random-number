<script setup lang="ts">
import type { GeneratorMode, ListConfig } from '~/types/generator'

const props = defineProps<{
  mode: GeneratorMode
  presetCount: number
}>()

const config = defineModel<ListConfig>({ required: true })

const fieldLabel = computed(() =>
  props.mode === 'custom' ? '可选项' : '追加可选项（一行一个，或逗号分隔）',
)
const placeholder = computed(() =>
  props.mode === 'custom' ? '一行一个，或逗号分隔' : '可留空，也可追加你的选项',
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <label class="block">
      <span class="field-label">{{ fieldLabel }}</span>
      <textarea
        v-model="config.rawItems"
        class="input mt-2 min-h-32 resize-y"
        rows="6"
        :placeholder="placeholder"
      />
      <span v-if="presetCount > 0" class="mt-1.5 block text-xs text-faint">
        内置 {{ presetCount }} 个选项，将与你追加的内容合并
      </span>
    </label>

    <label class="block max-w-48">
      <span class="field-label">数量</span>
      <input
        v-model.number="config.count"
        class="input mt-2"
        type="number"
        min="1"
        inputmode="numeric"
      />
    </label>

    <ToggleSwitch v-model="config.unique">唯一结果</ToggleSwitch>
  </div>
</template>
