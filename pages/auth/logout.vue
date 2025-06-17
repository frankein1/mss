<template>
  <div>
    <div class="fr-container fr-pt-4w">
      <TheLandingBreadcrumb :text="routes.auth.AuthLogout.title" />

      <DsfrAlert
        class="fr-mb-4w"
        type="success"
        :title="routes.auth.AuthLogout.title"
      ></DsfrAlert>

      <client-only>
        <AuthLogout :inactive="inactive"></AuthLogout>
      </client-only>
    </div>

    <div class="fr-container">
      <p>
        Un problème ? Contactez notre équipe support :
        <NuxtLink :to="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { SUPPORT_EMAIL } from '~/utils/constants'

  useHead({
    title: routes.auth.AuthLogout.title
  })

  definePageMeta({
    layout: 'landing'
  })

  const route = useRoute()

  const inactive = !!route.query.inactive
</script>
