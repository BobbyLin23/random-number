export type GeneratorMode = 'number' | 'custom' | 'food' | 'movie' | 'agent'

export type ThemeMode = 'light' | 'dark'

export interface ModeOption {
  value: GeneratorMode
  label: string
  description: string
  icon: string
}

export interface NumberConfig {
  min: number
  max: number
  count: number
  unique: boolean
  integer: boolean
  sort: boolean
}

export interface ListConfig {
  rawItems: string
  count: number
  unique: boolean
}

export interface GeneratorResult {
  mode: GeneratorMode
  values: Array<number | string>
  meta: string
}

export interface ValidationResult {
  valid: boolean
  message: string
}
