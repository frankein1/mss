import { defineNuxtModule } from '@nuxt/kit'

const PLUGINS_TO_STRIP = /auth|sentry|matomo|chart|refresh-app/

export default defineNuxtModule({
  meta: { name: 'test-strip-plugins' },
  setup(_options, nuxt) {
    nuxt.hook('app:resolve', app => {
      app.plugins = app.plugins.filter(p => !PLUGINS_TO_STRIP.test(p.src))
    })
  }
})
