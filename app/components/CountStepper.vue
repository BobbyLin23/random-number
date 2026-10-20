<script setup lang="ts">
const model = defineModel<number>({ required: true })

const props = withDefaults(
  defineProps<{
    label?: string
    min?: number
    max?: number
  }>(),
  {
    label: '数量',
    min: 1,
    max: 999,
  },
)

const draft = ref(String(model.value))

watch(model, value => {
  if (Number(draft.value) !== value) {
    draft.value = String(value)
  }
})

function clampValue(value: number): number {
  if (!Number.isFinite(value)) {
    return props.min
  }

  return Math.min(props.max, Math.max(props.min, Math.floor(value)))
}

function commit() {
  const parsed = Number(draft.value)

  model.value = clampValue(Number.isFinite(parsed) ? parsed : props.min)
  draft.value = String(model.value)
}

function step(delta: number) {
  model.value = clampValue(model.value + delta)
  draft.value = String(model.value)
}
</script>

<template>
  <div class="inline-flex h-11 items-stretch border border-line bg-plate">
    <button
      type="button"
      class="flex w-11 cursor-pointer items-center justify-center text-[17px] leading-none text-ink transition-colors duration-150 hover:bg-page"
      :aria-label="`减少${label}`"
      @click="step(-1)"
    >
      −
    </button>
    <input
      v-model="draft"
      type="number"
      class="tnum w-14 border-x border-line bg-transparent text-center text-[16px] text-ink outline-none sm:text-[15px]"
      :aria-label="label"
      @blur="commit"
      @keydown.enter="commit"
    />
    <button
      type="button"
      class="flex w-11 cursor-pointer items-center justify-center text-[17px] leading-none text-ink transition-colors duration-150 hover:bg-page"
      :aria-label="`增加${label}`"
      @click="step(1)"
    >
      +
    </button>
  </div>
</template>
