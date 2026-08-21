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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
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
