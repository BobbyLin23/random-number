import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: {
    'page-shell':
      'min-h-screen bg-[#f7f4ed] text-[#1c1c1c] transition-colors duration-300 dark:bg-[#161514] dark:text-[#f3efe6]',
    'page-border': 'border border-[#eceae4] dark:border-[#3a3833]',
    'soft-panel': 'rounded-[28px] border border-[#eceae4] dark:border-[#3a3833]',
    'section-frame': 'mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8',
    'eyebrow': 'text-[11px] uppercase tracking-[0.3em] text-[rgba(28,28,28,0.55)] dark:text-[rgba(243,239,230,0.58)]',
    'ghost-button':
      'inline-flex items-center gap-2 rounded-full border border-[rgba(28,28,28,0.22)] px-4 py-2 text-sm text-[#1c1c1c] transition-all duration-200 hover:bg-[rgba(28,28,28,0.04)] dark:border-[rgba(243,239,230,0.18)] dark:text-[#f3efe6] dark:hover:bg-[rgba(243,239,230,0.06)]',
    'primary-button':
      'inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1c1c] px-5 py-3 text-sm text-[#fcfbf8] transition-all duration-200 hover:opacity-90 dark:bg-[#f3efe6] dark:text-[#161514]',
    'metric-card':
      'soft-panel bg-[rgba(255,255,255,0.36)] p-5 dark:bg-[rgba(255,255,255,0.03)]',
    'input-shell':
      'w-full rounded-[18px] border border-[#eceae4] bg-[rgba(255,255,255,0.48)] px-4 py-3 text-base text-[#1c1c1c] outline-none transition-all duration-200 placeholder:text-[#6f6b63] focus:border-[rgba(28,28,28,0.4)] focus:bg-[rgba(255,255,255,0.72)] dark:border-[#3a3833] dark:bg-[rgba(255,255,255,0.03)] dark:text-[#f3efe6] dark:placeholder:text-[#9c968c] dark:focus:border-[rgba(243,239,230,0.28)] dark:focus:bg-[rgba(255,255,255,0.05)]',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
})
