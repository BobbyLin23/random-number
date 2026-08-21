import type {
  GeneratorMode,
  GeneratorResult,
  ListConfig,
  NumberConfig,
  ValidationResult,
} from '~/types/generator'

export function parseListItems(rawItems: string): string[] {
  return rawItems
    .split(/[\n,，]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function pickIndexes(total: number, count: number, unique: boolean): number[] {
  if (!unique) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * total))
  }

  const indexes = Array.from({ length: total }, (_, index) => index)

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentIndex = indexes[index]
    indexes[index] = indexes[swapIndex]
    indexes[swapIndex] = currentIndex
  }

  return indexes.slice(0, count)
}

export function validateNumberConfig(config: NumberConfig): ValidationResult {
  if (!Number.isFinite(config.min) || !Number.isFinite(config.max)) {
    return { valid: false, message: '请输入有效的数字范围。' }
  }

  if (config.min > config.max) {
    return { valid: false, message: '最小值不能大于最大值。' }
  }

  if (!Number.isFinite(config.count) || config.count < 1) {
    return { valid: false, message: '生成数量至少为 1。' }
  }

  const rangeSize = Math.floor(config.max) - Math.ceil(config.min) + 1

  if (config.integer && config.unique && config.count > rangeSize) {
    return { valid: false, message: '唯一模式下，数量不能超过可选范围。' }
  }

  return { valid: true, message: '' }
}

export function validateListConfig(config: ListConfig, items: string[]): ValidationResult {
  if (items.length === 0) {
    return { valid: false, message: '请至少输入一个可选项。' }
  }

  if (!Number.isFinite(config.count) || config.count < 1) {
    return { valid: false, message: '生成数量至少为 1。' }
  }

  if (config.unique && config.count > items.length) {
    return { valid: false, message: '唯一模式下，数量不能超过可选项数量。' }
  }

  return { valid: true, message: '' }
}

export function generateNumbers(config: NumberConfig): GeneratorResult {
  const validation = validateNumberConfig(config)

  if (!validation.valid) {
    throw new Error(validation.message)
  }

  const min = config.integer ? Math.ceil(config.min) : config.min
  const max = config.integer ? Math.floor(config.max) : config.max
  let values: number[]

  if (config.integer) {
    if (config.unique) {
      values = pickIndexes(max - min + 1, config.count, true).map(index => min + index)
    } else {
      values = Array.from({ length: config.count }, () => {
        return Math.floor(Math.random() * (max - min + 1)) + min
      })
    }
  } else {
    values = Array.from({ length: config.count }, () => {
      return Number((Math.random() * (max - min) + min).toFixed(2))
    })
  }

  if (config.sort) {
    values = [...values].sort((left, right) => left - right)
  }

  return {
    mode: 'number',
    values,
    meta: `${config.min} - ${config.max}`,
  }
}

export function generateListResult(
  mode: Exclude<GeneratorMode, 'number'>,
  config: ListConfig,
  presetItems: readonly string[] = [],
): GeneratorResult {
  const items = [...presetItems, ...parseListItems(config.rawItems)]
  const validation = validateListConfig(config, items)

  if (!validation.valid) {
    throw new Error(validation.message)
  }

  return {
    mode,
    values: pickIndexes(items.length, config.count, config.unique).map(index => items[index]),
    meta: `${items.length} 个可选项`,
  }
}
