export default defineNuxtConfig({
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // DSFR STYLES
    '@gouvfr/dsfr/dist/core/core.min.css',
    '@gouvfr/dsfr/dist/component/accordion/accordion.min.css',
    '@gouvfr/dsfr/dist/component/alert/alert.min.css',
    '@gouvfr/dsfr/dist/component/badge/badge.min.css',
    '@gouvfr/dsfr/dist/component/button/button.min.css',
    '@gouvfr/dsfr/dist/component/card/card.min.css',
    '@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css',
    '@gouvfr/dsfr/dist/component/content/content.min.css',
    '@gouvfr/dsfr/dist/component/download/download.min.css',
    '@gouvfr/dsfr/dist/component/footer/footer.min.css',
    '@gouvfr/dsfr/dist/component/form/form.min.css',
    '@gouvfr/dsfr/dist/component/header/header.min.css',
    '@gouvfr/dsfr/dist/component/input/input.min.css',
    '@gouvfr/dsfr/dist/component/link/link.min.css',
    '@gouvfr/dsfr/dist/component/logo/logo.min.css',
    '@gouvfr/dsfr/dist/component/modal/modal.min.css',
    '@gouvfr/dsfr/dist/component/navigation/navigation.min.css',
    '@gouvfr/dsfr/dist/component/pagination/pagination.min.css',
    '@gouvfr/dsfr/dist/component/quote/quote.min.css',
    '@gouvfr/dsfr/dist/component/search/search.min.css',
    '@gouvfr/dsfr/dist/component/select/select.min.css',
    '@gouvfr/dsfr/dist/component/sidemenu/sidemenu.min.css',
    '@gouvfr/dsfr/dist/component/tab/tab.min.css',
    '@gouvfr/dsfr/dist/component/table/table.min.css',
    '@gouvfr/dsfr/dist/component/tag/tag.min.css',
    '@gouvfr/dsfr/dist/component/toggle/toggle.min.css',
    '@gouvfr/dsfr/dist/scheme/scheme.min.css',

    // DSFR ICONS
    '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-communication/icons-communication.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-media/icons-media.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css',

    // GLOBAL STYLES
    '@/assets/style/main.scss',
    '@/assets/style/button.scss',
    '@/assets/style/icons.css',
    '@/assets/style/tab.scss',
    '@/assets/style/stats.scss',
    '@/assets/style/form.scss',
    '@/assets/style/menu.scss'
  ],

  // Modules: https://v3.nuxtjs.org/api/configuration/nuxt.config#modules
  modules: [
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/eslint-module', { lintOnStart: false }],
    // https://go.nuxtjs.dev/stylelint
    ['@nuxtjs/stylelint-module', { lintOnStart: false }],
    '@pinia/nuxt',
    'nuxt-vitest'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['./node_modules', './node_modules/@gouvfr/dsfr']
        }
      }
    }
  },
  build: {
    transpile: ['trpc-nuxt']
  },

  runtimeConfig: {
    private: {
      jwtKey: process.env.JWT_KEY,
      inclusionConnect: {
        secret: process.env.IC_CLIENT_SECRET
      }
    },
    public: {
      apiUrl: process.env.API_URL,
      appUrl: process.env.APP_URL,
      inclusionConnect: {
        issuer: process.env.IC_ISSUER,
        clientId: process.env.IC_CLIENT_ID,
        type: process.env.IC_AUTH_TYPE,
        provider: process.env.IC_PROVIDER
      },
      sessionCookieKey: 'MSS_SESSION_TOKEN',
      authRefreshDelay: 0.75
    }
  },

  // Prevent nuxt to export types.ts files as components
  components: [
    {
      path: '~/components',
      extensions: ['.vue']
    }
  ]
})
