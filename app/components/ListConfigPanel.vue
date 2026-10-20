<script setup lang="ts">
import type { GeneratorMode, ListConfig } from '~/types/generator'

const props = defineProps<{
  mode: GeneratorMode
  presetCount: number
}>()

const config = defineModel<ListConfig>({ required: true })

const ownItems = computed(() => parseListItems(config.value.rawItems))

const fieldLabel = computed(() => (props.mode === 'custom' ? '可选项' : '追加可选项'))

const placeholder = computed(() =>
  props.mode === 'custom' ? '每行一个，或用逗号分隔' : '每行一个，会追加到内置选项里',
)

const itemHint = computed(() => {
  if (props.mode === 'custom') {
    return ownItems.value.length > 0
      ? `已填写 ${ownItems.value.length} 个选项`
      : '还没有可选项，一行写一个'
  }

  if (ownItems.value.length > 0) {
    return `内置 ${props.presetCount} 个，加上你的 ${ownItems.value.length} 个，共 ${props.presetCount + ownItems.value.length} 个`
  }

  return `内置 ${props.presetCount} 个，可以直接抽，也可以追加自己的`
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <span class="field-label">{{ fieldLabel }}</span>
      <textarea
        v-model="config.rawItems"
        class="input mt-2 min-h-[132px] resize-y"
        rows="5"
        :aria-label="fieldLabel"
        :placeholder="placeholder"
      />
      <p class="m-0 mt-2 text-[12px] leading-5 text-faint">{{ itemHint }}</p>
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
      </div>
    </div>
  </div>
</template>
