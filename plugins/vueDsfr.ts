import {
  DsfrBreadcrumb,
  DsfrButton,
  DsfrButtonGroup
} from '@gouvminint/vue-dsfr'

export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  nuxtApp.vueApp.component('DsfrBreadcrumb', DsfrBreadcrumb)
  nuxtApp.vueApp.component('DsfrButton', DsfrButton)
  nuxtApp.vueApp.component('DsfrButtonGroup', DsfrButtonGroup)
})
