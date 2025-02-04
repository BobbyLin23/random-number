<script setup lang="ts">
import '@unocss/reset/tailwind.css'

const min = ref(0)
const max = ref(100)
const result = ref(0)

function generate() {
  result.value = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value
}

function reset() {
  min.value = 0
  max.value = 100
  result.value = 0
}
</script>

<template>
  <main p2 min-h-screen flex="~ col items-center justify-center gap-4">
    <h1 text-3xl font-bold>
      Random Number Generator
    </h1>
    <div border="~ b-coolGray" class="container mxa p4" rounded-md shadow-md>
      <label block mb2>
        <span block mb1>
          Min
        </span>
        <input v-model="min" type="number" class="w-full border rounded-md p2">
      </label>
      <label block mb2>
        <span block mb1>
          Max
        </span>
        <input v-model="max" type="number" class="w-full border rounded-md p2">
      </label>
      <div class="flex mt4 items-center gap-4">
        <button block bg-blue-500 text-white rounded p2 w-full @click="generate">
          Generate
        </button>
        <button block bg-coolGray-100 text-coolGray-800 rounded p2 w-full @click="reset">
          Reset
        </button>
      </div>
      <div block mt4>
        <span block mb1>
          Result
        </span>
        <span block bg-coolGray-100 rounded p2 w-full>
          {{ result }}
        </span>
      </div>
    </div>
  </main>
</template>
