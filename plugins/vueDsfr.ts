import { DsfrBreadcrumb } from '@gouvminint/vue-dsfr'

export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  nuxtApp.vueApp.component('DsfrBreadcrumb', DsfrBreadcrumb)
})
