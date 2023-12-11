<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <client-only>
      <AuthLogout :inactive="inactive"></AuthLogout>
    </client-only>
  </main>
</template>

<script setup lang="ts">
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.AuthLogout()
  })

  definePageMeta({
    layout: 'landing'
  })

  const route = useRoute()

  const inactive = !!route.query.inactive
</script>
