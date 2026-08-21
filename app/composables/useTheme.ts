import type { ThemeMode } from '~/types/generator'

const THEME_STORAGE_KEY = 'random-generator-theme'

export function useTheme() {
  const theme = ref<ThemeMode>('light')

  function readStoredTheme(): ThemeMode | null {
    if (!import.meta.client) {
      return null
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY)

    return stored === 'dark' || stored === 'light' ? stored : null
  }

  function readSystemTheme(): ThemeMode {
    if (!import.meta.client) {
      return 'light'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function applyTheme(nextTheme: ThemeMode) {
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    document.documentElement.style.colorScheme = nextTheme
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  onMounted(() => {
    theme.value = readStoredTheme() ?? readSystemTheme()
    applyTheme(theme.value)
  })

  watch(theme, value => {
    if (import.meta.client) {
      applyTheme(value)
    }
  })

  const mediaQuery = import.meta.client ? window.matchMedia('(prefers-color-scheme: dark)') : null

  function onSystemThemeChange(event: MediaQueryListEvent) {
    if (readStoredTheme() === null) {
      theme.value = event.matches ? 'dark' : 'light'
    }
  }

  onMounted(() => mediaQuery?.addEventListener('change', onSystemThemeChange))
  onUnmounted(() => mediaQuery?.removeEventListener('change', onSystemThemeChange))

  return {
    theme,
    toggleTheme,
  }
}
