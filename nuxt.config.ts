// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      script: [
        {
          innerHTML: [
            '(function () {',
            "  var stored = localStorage.getItem('random-generator-theme')",
            "  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches",
            "  var theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light'",
            '  var root = document.documentElement',
            "  root.classList.toggle('dark', theme === 'dark')",
            '  root.style.colorScheme = theme',
            '})()',
          ].join('\n'),
        },
      ],
    },
  },
})
