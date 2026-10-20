import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

const cssVar = (name: string) => `var(--color-${name})`

export default defineConfig({
  theme: {
    colors: {
      'page': cssVar('page'),
      'plate': cssVar('plate'),
      'ink': cssVar('ink'),
      'muted': cssVar('ink-muted'),
      'faint': cssVar('ink-faint'),
      'line': cssVar('line'),
      'line-strong': cssVar('line-strong'),
      'accent': cssVar('accent'),
      'danger': cssVar('danger'),
      'field': {
        DEFAULT: cssVar('field'),
        ink: cssVar('field-ink'),
        muted: cssVar('field-muted'),
        line: cssVar('field-line'),
        danger: cssVar('field-danger'),
      },
      'stub': {
        DEFAULT: cssVar('stub'),
        ink: cssVar('stub-ink'),
        line: cssVar('stub-line'),
        hover: cssVar('stub-hover'),
      },
    },
    fontFamily: {
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
    },
  },
  shortcuts: {
    'container': 'mx-auto w-full max-w-[1120px] px-5 sm:px-8',
    'field-label': 'block text-[12px] font-medium leading-none text-muted',
    'input':
      'w-full border border-line bg-plate px-3 py-2.5 text-[16px] leading-6 text-ink outline-none sm:text-[15px] transition-colors duration-150 placeholder:text-faint hover:border-line-strong focus:border-ink',
    'btn-quiet':
      'inline-flex h-9 cursor-pointer items-center justify-center gap-2 border border-line bg-transparent px-3 text-[12px] font-medium text-ink transition-colors duration-150 hover:border-ink hover:bg-plate',
    'tnum': '[font-variant-numeric:tabular-nums]',
  },
  presets: [presetUno(), presetAttributify(), presetIcons()],
})
