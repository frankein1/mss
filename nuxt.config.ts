// https://github.com/prisma/prisma/issues/12504#issuecomment-1372635653
import { createRequire } from 'module'
import path from 'path'
import pkg from './package.json'

const require = createRequire(import.meta.url)

const prismaClient = require
  .resolve('@prisma/client')
  .replace(
    /@prisma(\/|\\)client(\/|\\)index\.js/,
    '.prisma/client/index-browser.js'
  )

const prismaIndexBrowser = path.normalize(
  path.relative(process.cwd(), prismaClient)
)

export default defineNuxtConfig({
  // https://nuxt.com/blog/v3-8
  typescript: {
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false
      }
    }
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // DSFR STYLES
    '@gouvfr/dsfr/dist/core/core.min.css',
    '@gouvfr/dsfr/dist/component/accordion/accordion.min.css',
    '@gouvfr/dsfr/dist/component/alert/alert.min.css',
    '@gouvfr/dsfr/dist/component/badge/badge.min.css',
    '@gouvfr/dsfr/dist/component/breadcrumb/breadcrumb.min.css',
    '@gouvfr/dsfr/dist/component/button/button.min.css',
    '@gouvfr/dsfr/dist/component/callout/callout.min.css',
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
    '@gouvfr/dsfr/dist/component/radio/radio.min.css',
    '@gouvfr/dsfr/dist/component/search/search.min.css',
    '@gouvfr/dsfr/dist/component/select/select.min.css',
    '@gouvfr/dsfr/dist/component/sidemenu/sidemenu.min.css',
    '@gouvfr/dsfr/dist/component/tab/tab.min.css',
    '@gouvfr/dsfr/dist/component/table/table.min.css',
    '@gouvfr/dsfr/dist/component/tag/tag.min.css',
    '@gouvfr/dsfr/dist/component/toggle/toggle.min.css',
    '@gouvfr/dsfr/dist/component/notice/notice.min.css',

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
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-scheduler',
    'nuxt-security'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  vite: {
    // Adds sourcemaps for Sentry (may not been working until releases and auth token are used)
    build: {
      sourcemap: true
    },
    // https://github.com/nuxt/nuxt/issues/24196
    optimizeDeps: {
      include: [
        '@prisma/client',
        'vee-validate',
        '@vee-validate/zod',
        'zod',
        'vue-scrollto',
        'node-fetch-native',
        'uuid',
        '@trpc/client'
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['./node_modules', './node_modules/@gouvfr/dsfr']
        }
      }
    },
    resolve: {
      alias: {
        '.prisma/client/index-browser': prismaIndexBrowser
      }
    }
  },
  build: {
    transpile: ['trpc-nuxt']
  },

  runtimeConfig: {
    auth: {
      jwtKey: process.env.AUTH_JWT_KEY,
      keycloakIssuer: process.env.AUTH_KEYCLOAK_ISSUER_URL,
      keycloakClientId: process.env.AUTH_KEYCLOAK_CLIENT_ID,
      keycloakClientSecret: process.env.AUTH_KEYCLOAK_CLIENT_SECRET,
      keycloakProvider: 'InclusionConnect',
      keycloakLabel: 'keycloak'
    },
    s3: {
      bucket: process.env.S3_BUCKET || '',
      host: process.env.S3_ENDPOINT || 's3.fr-par.scw.cloud',
      region: process.env.S3_REGION || 'fr-par',
      key: process.env.S3_KEY || '',
      secret: process.env.S3_SECRET || ''
    },
    email: {
      smtpHost: process.env.EMAIL_SMTP_HOST || '',
      smtpPassword: process.env.EMAIL_SMTP_PASSWORD || '',
      smtpPort: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
      smtpSecure: (process.env.EMAIL_SMTP_SECURE || 'false') === 'true',
      smtpUser: process.env.EMAIL_SMTP_USER || ''
    },
    public: {
      clientVersion: pkg.version,
      cguVersion: '1.0',
      appUrl: process.env.APP_URL,
      auth: {
        cookieKey: 'MSS_SESSION_TOKEN',
        tokenValidationInMinutes: parseInt(
          process.env.TOKEN_VALIDATION_IN_MINUTES || '30'
        )
      },
      disconnect: {
        threshold: parseInt(process.env.DISCONNECT_THRESHOLD || '30'),
        alertThreshold: parseInt(process.env.DISCONNECT_ALERT_THRESHOLD || '5')
      },

      matomo: {
        host: process.env.MATOMO_HOST,
        siteId: parseInt(process.env.MATOMO_SITE_ID || '1')
      },
      mssEnvironment: process.env.MSS_ENVIRONMENT || 'local',
      email: {
        from: process.env.EMAIL_FROM || ''
      },
      sentry: {
        dsn: process.env.SENTRY_DSN,
        debug: !!process.env.SENTRY_DEBUG,
        tracesSampleRate: parseFloat(
          process.env.SENTRY_TRACE_SAMPLE_RATE || '1.0'
        )
      }
    }
  },

  // Prevent nuxt to export types.ts files as components
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['.vue']
    }
  ],

  // Adds sourcemaps for Sentry (may not been working until releases and auth token are used)
  sourcemap: {
    client: true,
    server: true
  },
  security: {
    removeLoggers: false,
    headers: {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    }
  },
  routeRules: {
    '/api/s3/create': {
      security: {
        xssValidator: false
      }
    }
  }
})
