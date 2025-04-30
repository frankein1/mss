<template>
  <div class="landing-main-container fr-container fr-my-8w">
    <client-only>
      <AuthLogout :inactive="inactive"></AuthLogout>
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  useHead({
    title: routes.auth.AuthLogout.title
  })

  definePageMeta({
    layout: 'landing'
  })

  const route = useRoute()

  const inactive = !!route.query.inactive
</script>
