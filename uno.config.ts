import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

const cssVar = (name: string) => `var(--color-${name})`

export default defineConfig({
  theme: {
    colors: {
      'page': cssVar('page'),
      'panel': cssVar('panel'),
      'ink': cssVar('ink'),
      'muted': cssVar('ink-muted'),
      'faint': cssVar('ink-faint'),
      'line': cssVar('line'),
      'line-strong': cssVar('line-strong'),
      'accent': cssVar('accent'),
      'accent-soft': cssVar('accent-soft'),
      'danger': cssVar('danger'),
      'inverted': {
        page: cssVar('inverted-page'),
        ink: cssVar('inverted-ink'),
        muted: cssVar('inverted-muted'),
      },
    },
    fontFamily: {
      sans: 'var(--font-sans)',
    },
  },
  shortcuts: {
    'container': 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8',
    'panel': 'border border-line bg-panel',
    'field-label': 'block text-xs font-semibold uppercase tracking-[0.14em] text-muted',
    'input':
      'w-full border border-line bg-page px-3 py-2.5 text-base text-ink outline-none transition-colors duration-200 placeholder:text-faint focus:border-accent',
    'btn-primary':
      'inline-flex items-center justify-center gap-2 border border-ink bg-ink px-6 py-3 text-sm font-semibold text-page transition-colors duration-200 hover:border-accent hover:bg-accent active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
    'btn-ghost':
      'inline-flex items-center justify-center gap-2 border border-line bg-page px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink disabled:cursor-not-allowed disabled:opacity-50',
    'tab-active': 'border-ink bg-ink text-page hover:bg-ink',
    'tab-inactive': 'border-line bg-page text-ink hover:border-ink',
  },
  presets: [presetUno(), presetAttributify(), presetIcons()],
})
